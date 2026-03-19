import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

// Sử dụng Prisma.QueryEvent thay vì any
prisma.$on('query', (e: Prisma.QueryEvent) => {
  console.log("\n--- [PRISMA QUERY MONITOR] ---");
  console.log(`Query: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
  console.log("------------------------------\n");
});

export default prisma;