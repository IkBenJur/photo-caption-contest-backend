import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ancient = await prisma.photo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Ancient",
      imageUrl: "/src/images/ancient.jpg",
    },
  });

  const anubis = await prisma.photo.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Anubis",
      imageUrl: "/src/images/anubis.jpg",
    },
  });

  const cache = await prisma.photo.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "Cache",
      imageUrl: "/src/images/cache.jpg",
    },
  });

  const dust2 = await prisma.photo.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "Dust 2",
      imageUrl: "/src/images/dust2.jpg",
    },
  });

  const inferno = await prisma.photo.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: "Inferno",
      imageUrl: "/src/images/inferno.jpg",
    },
  });

  const mirage = await prisma.photo.upsert({
    where: { id: 6 },
    update: {},
    create: {
      title: "Mirage",
      imageUrl: "/src/images/mirage.jpg",
    },
  });

  const nuke = await prisma.photo.upsert({
    where: { id: 7 },
    update: {},
    create: {
      title: "Nuke",
      imageUrl: "/src/images/nuke.jpg",
    },
  });

  const overpass = await prisma.photo.upsert({
    where: { id: 8 },
    update: {},
    create: {
      title: "Overpass",
      imageUrl: "/src/images/overpass.jpg",
    },
  });

  const train = await prisma.photo.upsert({
    where: { id: 9 },
    update: {},
    create: {
      title: "Train",
      imageUrl: "/src/images/train.jpg",
    },
  });

  const vertigo = await prisma.photo.upsert({
    where: { id: 10 },
    update: {},
    create: {
      title: "Vertigo",
      imageUrl: "/src/images/vertigo.jpg",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "Test@mail.com" },
    update: {},
    create: {
      name: "Test",
      password: "Test123",
      email: "Test@mail.com",
    },
  });

  console.log(
    ancient,
    anubis,
    cache,
    dust2,
    inferno,
    mirage,
    nuke,
    overpass,
    train,
    vertigo,
    user
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
