import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Separar o monte de código em arquivos diferentes, e implementar sessões.

// TODO -> Lifetime das sessões

// fazer uma função para adicionar 1 hora na data de agora na hora de criar sessão. a logica e tipo assim
// Date.prototype.addHours = function(h) {
//   this.setTime(this.getTime() + (h*60*60*1000));
//   return this;
// }

async function createContext({ req, res }: CreateFastifyContextOptions) {
    if (req.headers.authorization) {
        const sessionId = req.headers.authorization?.split(' ')[1];

        const session = await prisma.session.findFirst({
            where: {
                id: sessionId
            },
            include: {
                user: true
            }
        });

        return { prisma, session }
    }

    return { prisma };
}

type Context = inferAsyncReturnType<typeof createContext>;

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

const protectedProcedure = t.procedure.use(isAuthed);

const appRouter = t.router({
    getMessage: protectedProcedure
        .query(({ input, ctx }) => {
            const { user } = ctx;
            
            return {
                protectedMessage: 'Hello, ' + user.username + '!'
            }
        }),
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

            const session = await prisma.session.create({
                data: {
                    userId: user.id
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

            const session = await prisma.session.create({
                data: {
                    userId: user.id
                }
            })
            
            return { session };
        })

})

export type AppRouter = typeof appRouter;

const server = fastify({
    maxParamLength: 5000
});

server.register(cors, {
    origin: true
})

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
});

(async function() {
    try {
        await server.listen({ port: 3000 })
        console.log('Server is up')
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})()