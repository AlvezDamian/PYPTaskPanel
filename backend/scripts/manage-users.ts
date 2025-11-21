import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting user management script...');

  // 1. Eliminar usuario damianalvez@outlook.com si existe
  try {
    const userToDelete = await prisma.user.findUnique({
      where: { email: 'damianalvez@outlook.com' },
    });

    if (userToDelete) {
      // Eliminar tareas asociadas primero (si las hay)
      await prisma.task.deleteMany({
        where: {
          OR: [
            { userId: userToDelete.id },
            { createdById: userToDelete.id },
            { assignedToId: userToDelete.id },
          ],
        },
      });

      // Eliminar el usuario
      await prisma.user.delete({
        where: { email: 'damianalvez@outlook.com' },
      });
      console.log('✓ Usuario damianalvez@outlook.com eliminado');
    } else {
      console.log('ℹ Usuario damianalvez@outlook.com no existe');
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error);
  }

  // 2. Crear usuario admin
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@test.com' },
    });

    if (adminExists) {
      console.log('ℹ Usuario admin@test.com ya existe, actualizando...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.update({
        where: { email: 'admin@test.com' },
        data: {
          password: hashedPassword,
          role: UserRole.ADMIN,
          firstName: 'Admin',
          lastName: 'User',
        },
      });
      console.log('✓ Usuario admin@test.com actualizado');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@test.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
          firstName: 'Admin',
          lastName: 'User',
        },
      });
      console.log('✓ Usuario admin@test.com creado');
    }
  } catch (error) {
    console.error('Error creando usuario admin:', error);
  }

  // 3. Crear usuario común
  try {
    const userExists = await prisma.user.findUnique({
      where: { email: 'commonuser@test.com' },
    });

    if (userExists) {
      console.log('ℹ Usuario commonuser@test.com ya existe, actualizando...');
      const hashedPassword = await bcrypt.hash('user123', 10);
      await prisma.user.update({
        where: { email: 'commonuser@test.com' },
        data: {
          password: hashedPassword,
          role: UserRole.USER,
          firstName: 'Common',
          lastName: 'User',
        },
      });
      console.log('✓ Usuario commonuser@test.com actualizado');
    } else {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await prisma.user.create({
        data: {
          email: 'commonuser@test.com',
          password: hashedPassword,
          role: UserRole.USER,
          firstName: 'Common',
          lastName: 'User',
        },
      });
      console.log('✓ Usuario commonuser@test.com creado');
    }
  } catch (error) {
    console.error('Error creando usuario común:', error);
  }

  console.log('User management script completed!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

