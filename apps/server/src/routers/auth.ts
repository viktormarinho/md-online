import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '../context';
import { z } from 'zod';
import argon2 from 'argon2';
import { dateWithExtraHours } from '../util';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({
        ctx: {
            user: ctx.session.user
        }
    })
})

export const protectedProcedure = t.procedure.use(isAuthed);

export const authRouter = t.router({
    signUp: t.procedure
        .input(
            z.object({
                username: z.string().max(25, 'Please type in a username with less than 25 characters'),
                email: z.string().email('Please provide a valid email'),
                password: z.string().min(6, 'Please type in a password at least 6 characters long')
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;
            const { username, email } = input;

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: await argon2.hash(input.password)
                }
            })

            // Using that function, as soon as i want i can create different timed sessions
            const expiresIn = dateWithExtraHours(1);

            const session = await prisma.session.create({
                data: {
                    userId: user.id,
                    expiresIn
                }
            })

            return { session };
        }),
    login: t.procedure
        .input(
            z.object({
                username: z.string().optional(),
                email: z.string().optional(),
                password: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;
            const { username, email, password } = input;

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            })

            if (!user) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const ok = await argon2.verify(user.password, password);

            if (!ok) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }

            // Using that function, as soon as i want i can create different timed sessions
            const expiresIn = dateWithExtraHours(1);

            const session = await prisma.session.create({
                data: {
                    userId: user.id,
                    expiresIn
                }
            })
            
            return { session };
        })
})