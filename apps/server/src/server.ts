import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Separar o monte de código em arquivos diferentes, e implementar sessões.

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
    hello: t.procedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(({ input }) => {
            return `Hello, ${input.name}! How are you?`
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