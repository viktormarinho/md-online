import { protectedProcedure } from './auth';
import { Context } from './../context';
import { initTRPC } from "@trpc/server";
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
            })

            return { newDoc }
        })
})