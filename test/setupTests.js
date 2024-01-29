const prisma = require("../src/utils/prisma")

const deleteTables = () => {
  const deleteTables = [
    prisma.post.deleteMany(),
    prisma.user.deleteMany()
  ];

  return prisma.$transaction(deleteTables)
}

global.beforeAll(() => {
  return deleteTables()
})

global.afterEach(() => {
  return deleteTables()
})

global.afterAll(() => {
  return prisma.$disconnect()
})
