const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

async function seed() {
  const users = [];

  while (users.length < 10) {
    const user = await createUser(faker.internet.userName(), "123456789");
    users.push(user);
  }

  const admin = await createAdmin();
  users.push(admin);

  process.exit(0);
}

async function createUser(username, password) {
  const posts = [];

  for (let i = 0; i < username.length; i++) {
    posts.push({ title: faker.lorem.sentence() });
  }

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      posts: {
        create: posts,
      },
      role: {
        connectOrCreate: {
          where: {
            name: "USER",
          },
          create: {
            name: "USER",
            permissions: {
              connectOrCreate: [
                {
                  where: {
                    permission: "CREATE_POSTS",
                  },
                  create: {
                    permission: "CREATE_POSTS",
                  },
                },
                {
                  where: {
                    permission: "DELETE_MY_POST",
                  },
                  create: {
                    permission: "DELETE_MY_POST",
                  },
                },
                {
                  where: {
                    permission: "DELETE_MY_USER",
                  },
                  create: {
                    permission: "DELETE_MY_USER",
                  },
                },
              ],
            },
          },
        },
      },
    },
    include: {
      posts: true,
    },
  });

  console.log("User created", user);

  return user;
}

async function createAdmin() {
  const user = await prisma.user.create({
    data: {
      username: "harry_123",
      passwordHash: await bcrypt.hash("passwordha23", 6),
      role: {
        connectOrCreate: {
          where: {
            name: "ADMIN",
          },
          create: {
            name: "ADMIN",
            permissions: {
              connectOrCreate: [
                {
                  where: {
                    permission: "DELETE_ANY_USER",
                  },
                  create: {
                    permission: "DELETE_ANY_USER",
                  },
                },
                {
                  where: {
                    permission: "DELETE_ANY_POST",
                  },
                  create: {
                    permission: "DELETE_ANY_POST",
                  },
                },
                {
                  where: {
                    permission: "GET_ALL_USERS",
                  },
                  create: {
                    permission: "GET_ALL_USERS",
                  },
                },
              ],
            },
          },
        },
      },
    },
  });
}


seed()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
