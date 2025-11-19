import { prisma } from './prisma';

export async function getCurrentUser() {
  const fallbackUserId = 'user_1';

  const user = await prisma.user.upsert({
    where: { id: fallbackUserId },
    update: {},
    create: {
      id: fallbackUserId,
      email: 'demo@example.com',
      name: 'Demo User',
      targetCalories: 2000,
    },
  });

  return user;
}
