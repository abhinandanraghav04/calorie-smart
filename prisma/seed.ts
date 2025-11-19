import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.DEMO_USER_EMAIL ?? "demo@example.com"
  const password = process.env.DEMO_USER_PASSWORD ?? "password123"

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      passwordHash,
    },
  })

  console.log(`Seeded demo user: ${email} / ${password}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
