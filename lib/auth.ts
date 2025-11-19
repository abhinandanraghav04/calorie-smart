import { prisma } from './prisma'

const DEMO_EMAIL = 'demo@calorie-smart.app'
const DEMO_NAME = 'Demo User'

export async function getOrCreateDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    create: {
      email: DEMO_EMAIL,
      name: DEMO_NAME,
    },
    update: {},
    include: {
      profile: true,
    },
  })

  return user
}
