import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const john = await prisma.client.create({
    data: {
      name: 'Johnny Appleseed',
      phoneNumber: '5025552233',
      userId: user.id,
    }
  })

  const jill = await prisma.client.create({
    data: {
      name: 'Jill Appleseed',
      email: 'jill@appleseed.com',
      userId: user.id,
    }
  })

  await prisma.note.create({
    data: {
      body: "Hello, world!",
      clientId: john.id,
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      body: "Hello, world!",
      clientId: jill.id,
      userId: user.id
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
