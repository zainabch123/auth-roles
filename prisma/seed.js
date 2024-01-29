const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function seed() {
  const users = []

  while (users.length < 10) {
    const user = await createUser(faker.internet.userName(), '123456789')
    users.push(user)
  }

  process.exit(0)
}

async function createUser(username, password) {
  const posts = []

  for (let i = 0; i < username.length; i++) {
    posts.push({ title: faker.lorem.sentence() })
  }

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      posts: {
        create: posts
      }
    },
    include: {
      posts: true
    }
  })

  console.log('User created', user)

  return user
}

seed()
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
