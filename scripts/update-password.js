const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('12345', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'familybakery' },
    update: {
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
    create: {
      username: 'familybakery',
      name: 'Super Admin',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  })
  
  console.log('Admin account setup successful:', admin.username)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
