import { protectedProcedure } from './auth';
import { Context } from './../context';
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from 'zod';


const t = initTRPC.context<Context>().create();

export const docsRouter = t.router({
    getMyDocs: protectedProcedure
        .query(async ({ ctx }) => {
            const { prisma, user } = ctx;

            const docs = await prisma.document.findMany({
                where: {
                    userId: user.id
                }
            });

            return { docs };
        }),
    createNewDoc: protectedProcedure
        .input(
            z.object({
                title: z.string().max(30, 'Escolha um título com menos de 30 caracteres')
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma, user } = ctx;
            const { title } = input;

            const newDoc = await prisma.document.create({
                data: {
                    title,
                    content: '',
                    userId: user.id
                }
            });

            return { newDoc };
        }),
    getOneDoc: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const { id } = input;
            const { user, prisma } = ctx;

            const doc = await prisma.document.findFirst({
                where: {
                    id
                },
                include: {
                    allowedUsers: true,
                    user: true
                }
            });

            if (!doc) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const isAllowedUser = doc.allowedUsers.map(u => u.id).includes(user.id);

            if (doc.userId !== user.id && !isAllowedUser) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return { doc };
        }),
    updateDoc: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                newContent: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, newContent } = input;
            const { prisma } = ctx;

            const doc = await prisma.document.update({
                where: {
                    id
                },
                data: {
                    content: newContent
                }
            });

            return { doc };
        }),
    addAllowedUser: protectedProcedure
        .input(
            z.object({
                docId: z.string(),
                username: z.string().optional(),
                email: z.string().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { docId, email, username } = input;
            const { prisma, user } = ctx;

            const doc = await prisma.document.findFirst({
                where: {
                    id: docId
                }
            });

            if (!doc) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            if (doc.userId !== user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            const userToAdd = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            })

            if (!userToAdd) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const { allowedUsers } = await prisma.document.update({
                where: {
                    id: docId
                },
                data: {
                    allowedUsers: {
                        connect: {
                            id: userToAdd.id
                        }
                    }
                },
                include: {
                    allowedUsers: true
                }
            })

            return {
                allowedUsers
            }
        }),
    deleteDoc: protectedProcedure
        .input(
            z.object({
                docId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma, user } = ctx;
            const { docId } = input;

            const doc = await prisma.document.findFirst({
                where: {
                    id: docId
                }
            });

            if (!doc) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            if (doc.userId !== user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            await prisma.document.delete({
                where: {
                    id: docId
                }
            })

            const newDocList = prisma.document.findMany({
                where: {
                    userId: user.id
                }
            })

            return { newDocList };
        })
})