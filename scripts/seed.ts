import { PrismaClient, UserRole, JobStatus, JobUrgency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('plumber123', 12);
  const hashedHomeownerPassword = await bcrypt.hash('homeowner123', 12);
  const hashedDispatcherPassword = await bcrypt.hash('dispatcher123', 12);

  // Create users
  const plumber = await prisma.user.upsert({
    where: { email: 'plumber@forge.com' },
    update: {},
    create: {
      email: 'plumber@forge.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1234567890',
      role: UserRole.PLUMBER,
    },
  });

  const homeowner = await prisma.user.upsert({
    where: { email: 'homeowner@forge.com' },
    update: {},
    create: {
      email: 'homeowner@forge.com',
      password: hashedHomeownerPassword,
      firstName: 'Sarah',
      lastName: 'Williams',
      phone: '+1987654321',
      role: UserRole.HOMEOWNER,
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatcher@forge.com' },
    update: {},
    create: {
      email: 'dispatcher@forge.com',
      password: hashedDispatcherPassword,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1555123456',
      role: UserRole.DISPATCHER,
    },
  });

  // Create plumber profile
  const plumberProfile = await prisma.plumberProfile.upsert({
    where: { userId: plumber.id },
    update: {},
    create: {
      userId: plumber.id,
      xp: 1250,
      level: 3,
      forgeScore: 4.8,
      isActive: true,
    },
  });

  // Create job preferences
  await prisma.jobPreference.upsert({
    where: { plumberProfileId: plumberProfile.id },
    update: {},
    create: {
      plumberProfileId: plumberProfile.id,
      preferredJobTypes: ['leak_repair', 'installation', 'maintenance'],
      maxDistanceKm: 25,
      mondayStart: '08:00',
      mondayEnd: '17:00',
      tuesdayStart: '08:00',
      tuesdayEnd: '17:00',
      wednesdayStart: '08:00',
      wednesdayEnd: '17:00',
      thursdayStart: '08:00',
      thursdayEnd: '17:00',
      fridayStart: '08:00',
      fridayEnd: '17:00',
    },
  });

  // Create sample badges
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { name: 'First Job' },
      update: {},
      create: {
        name: 'First Job',
        description: 'Complete your first job',
        icon: '🔧',
        xpRequired: 0,
        criteria: { jobsCompleted: 1 },
      },
    }),
    prisma.badge.upsert({
      where: { name: '5-Star Streak' },
      update: {},
      create: {
        name: '5-Star Streak',
        description: 'Receive 5 consecutive 5-star reviews',
        icon: '⭐',
        xpRequired: 500,
        criteria: { consecutiveFiveStars: 5 },
      },
    }),
    prisma.badge.upsert({
      where: { name: 'Speed Demon' },
      update: {},
      create: {
        name: 'Speed Demon',
        description: 'Complete 3 jobs in one day',
        icon: '⚡',
        xpRequired: 300,
        criteria: { jobsInOneDay: 3 },
      },
    }),
  ]);

  // Award some badges to the plumber
  await prisma.plumberBadge.upsert({
    where: {
      plumberProfileId_badgeId: {
        plumberProfileId: plumberProfile.id,
        badgeId: badges[0].id,
      },
    },
    update: {},
    create: {
      plumberProfileId: plumberProfile.id,
      badgeId: badges[0].id,
      unlockedAt: new Date('2024-01-01'),
    },
  });

  await prisma.plumberBadge.upsert({
    where: {
      plumberProfileId_badgeId: {
        plumberProfileId: plumberProfile.id,
        badgeId: badges[1].id,
      },
    },
    update: {},
    create: {
      plumberProfileId: plumberProfile.id,
      badgeId: badges[1].id,
      unlockedAt: new Date('2024-01-15'),
    },
  });

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Kitchen Sink Leak Repair',
        description: 'Kitchen faucet has been dripping for a week. Water is pooling under the sink and needs immediate attention.',
        jobType: 'leak_repair',
        urgency: JobUrgency.HIGH,
        status: JobStatus.REQUESTED,
        address: '123 Oak Street, Springfield, IL 62701',
        latitude: 39.7817,
        longitude: -89.6501,
        createdById: homeowner.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Bathroom Toilet Installation',
        description: 'Need to install a new toilet in the master bathroom. Old one is cracked and needs replacement.',
        jobType: 'installation',
        urgency: JobUrgency.MEDIUM,
        status: JobStatus.REQUESTED,
        address: '456 Elm Avenue, Springfield, IL 62702',
        latitude: 39.7990,
        longitude: -89.6440,
        createdById: homeowner.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Emergency Pipe Burst',
        description: 'URGENT: Pipe burst in basement, water everywhere! Need immediate assistance.',
        jobType: 'emergency_repair',
        urgency: JobUrgency.EMERGENCY,
        status: JobStatus.REQUESTED,
        address: '789 Pine Road, Springfield, IL 62703',
        latitude: 39.7700,
        longitude: -89.6800,
        createdById: homeowner.id,
      },
    }),
  ]);

  // Create sample earnings
  await Promise.all([
    prisma.earning.create({
      data: {
        jobId: jobs[0].id,
        plumberId: plumber.id,
        amount: 250.00,
        xpAwarded: 100,
        createdAt: new Date(),
      },
    }),
    prisma.earning.create({
      data: {
        jobId: jobs[1].id,
        plumberId: plumber.id,
        amount: 180.00,
        xpAwarded: 75,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n🎯 Demo Credentials:');
  console.log('Plumber: plumber@forge.com / plumber123');
  console.log('Homeowner: homeowner@forge.com / homeowner123');
  console.log('Dispatcher: dispatcher@forge.com / dispatcher123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });