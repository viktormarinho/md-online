import { PrismaClient } from "@prisma/client";

export const getPrisma = () => new PrismaClient();