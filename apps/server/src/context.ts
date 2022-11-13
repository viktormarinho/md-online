import { getPrisma } from './db';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { inferAsyncReturnType } from '@trpc/server';

const prisma = getPrisma();

export async function createContext({ req, res }: CreateFastifyContextOptions) {
    if (req.headers.authorization) {
        const sessionId = req.headers.authorization?.split(' ')[1];

        const session = await prisma.session.findFirst({
            where: {
                id: sessionId,
                expiresIn: {
                    gte: new Date()
                }
            },
            include: {
                user: true
            }
        });

        return { prisma, session }
    }

    return { prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;