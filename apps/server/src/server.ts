import { initTRPC } from '@trpc/server';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { Context, createContext } from './context';
import { protectedProcedure, authRouter } from './routers/auth';

const t = initTRPC.context<Context>().create();

const messageRouter = t.router({
    getMessage: protectedProcedure
        .query(({ ctx }) => {
            const { user } = ctx;
            
            return {
                protectedMessage: 'Hello, ' + user.username + '!'
            }
        })
})

const appRouter = t.mergeRouters(messageRouter, authRouter)

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