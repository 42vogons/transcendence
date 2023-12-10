import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.users.create({
        data: {
          username: 'anolivei',
          email: 'anolivei@prisma.io',
          password_hash: '#####',
          two_factor_enabled: false
        },
      })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })