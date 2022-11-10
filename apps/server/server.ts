import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

// TODO => Implement auth

function createContext({ req, res }: CreateFastifyContextOptions) {
    return {};
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({

})

export type AppRouter = typeof appRouter;

const server = fastify({
    maxParamLength: 5000
});

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
});

(async function() {
    try {
        await server.listen({ port: 3000 })
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})()