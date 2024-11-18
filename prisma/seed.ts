import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.upsert({
        where: { login: 'admin' },
        update: {},
        create: {
            login: 'admin',
            password,
            createdAt: new Date(),
        },
    });

    console.log(`Created admin user with login: ${admin.login}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
