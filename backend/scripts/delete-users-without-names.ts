import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting script to delete users without names...');

  // Buscar usuarios que no tengan firstName o lastName
  const usersWithoutNames = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: null },
        { lastName: null },
      ],
    },
  });

  if (usersWithoutNames.length === 0) {
    console.log('No users found without names.');
    return;
  }

  console.log(`Found ${usersWithoutNames.length} user(s) without names:`);
  usersWithoutNames.forEach((user) => {
    console.log(`  - ${user.email} (${user.id})`);
  });

  // Eliminar cada usuario y sus tareas asociadas
  for (const user of usersWithoutNames) {
    try {
      // Eliminar tareas asociadas primero
      await prisma.task.deleteMany({
        where: {
          OR: [
            { userId: user.id },
            { createdById: user.id },
            { assignedToId: user.id },
          ],
        },
      });

      // Eliminar el usuario
      await prisma.user.delete({
        where: { id: user.id },
      });

      console.log(`✓ Usuario ${user.email} eliminado`);
    } catch (error) {
      console.error(`Error eliminando usuario ${user.email}:`, error);
    }
  }

  console.log('Script completed!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

