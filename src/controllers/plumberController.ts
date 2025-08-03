import { Request, Response } from 'express';
import { JobStatus } from '@prisma/client';
import prisma from '../utils/database';
import { PlumberDashboardData } from '../types';

export const getPlumberDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get plumber profile
    const plumberProfile = await prisma.plumberProfile.findUnique({
      where: { userId },
      include: {
        badges: {
          include: {
            badge: true,
          }
        }
      }
    });

    if (!plumberProfile) {
      return res.status(404).json({ error: 'Plumber profile not found' });
    }

    // Get earnings data
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayEarnings, weekEarnings, monthEarnings, totalEarnings] = await Promise.all([
      prisma.earning.aggregate({
        where: {
          plumberId: userId,
          createdAt: { gte: startOfToday }
        },
        _sum: { amount: true }
      }),
      prisma.earning.aggregate({
        where: {
          plumberId: userId,
          createdAt: { gte: startOfWeek }
        },
        _sum: { amount: true }
      }),
      prisma.earning.aggregate({
        where: {
          plumberId: userId,
          createdAt: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.earning.aggregate({
        where: { plumberId: userId },
        _sum: { amount: true }
      })
    ]);

    // Get job counts
    const [availableJobs, inProgressJobs, completedJobs] = await Promise.all([
      prisma.job.count({
        where: {
          status: JobStatus.REQUESTED,
          assignedToId: null
        }
      }),
      prisma.job.count({
        where: {
          assignedToId: userId,
          status: JobStatus.IN_PROGRESS
        }
      }),
      prisma.job.count({
        where: {
          assignedToId: userId,
          status: JobStatus.COMPLETED
        }
      })
    ]);

    const dashboardData: PlumberDashboardData = {
      profile: {
        xp: plumberProfile.xp,
        level: plumberProfile.level,
        forgeScore: plumberProfile.forgeScore,
        isActive: plumberProfile.isActive,
      },
      earnings: {
        today: todayEarnings._sum.amount || 0,
        week: weekEarnings._sum.amount || 0,
        month: monthEarnings._sum.amount || 0,
        total: totalEarnings._sum.amount || 0,
      },
      jobs: {
        available: availableJobs,
        inProgress: inProgressJobs,
        completed: completedJobs,
      },
      badges: plumberProfile.badges.map(pb => ({
        id: pb.badge.id,
        name: pb.badge.name,
        description: pb.badge.description,
        icon: pb.badge.icon,
        unlockedAt: pb.unlockedAt,
      }))
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Get plumber dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updatedProfile = await prisma.plumberProfile.update({
      where: { userId },
      data: { isActive }
    });

    res.json({
      message: 'Availability updated successfully',
      isActive: updatedProfile.isActive
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateJobPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      preferredJobTypes,
      maxDistanceKm,
      mondayStart, mondayEnd,
      tuesdayStart, tuesdayEnd,
      wednesdayStart, wednesdayEnd,
      thursdayStart, thursdayEnd,
      fridayStart, fridayEnd,
      saturdayStart, saturdayEnd,
      sundayStart, sundayEnd,
    } = req.body;

    // Get plumber profile
    const plumberProfile = await prisma.plumberProfile.findUnique({
      where: { userId }
    });

    if (!plumberProfile) {
      return res.status(404).json({ error: 'Plumber profile not found' });
    }

    // Upsert job preferences
    const preferences = await prisma.jobPreference.upsert({
      where: { plumberProfileId: plumberProfile.id },
      update: {
        preferredJobTypes: preferredJobTypes || [],
        maxDistanceKm: maxDistanceKm || 50,
        mondayStart, mondayEnd,
        tuesdayStart, tuesdayEnd,
        wednesdayStart, wednesdayEnd,
        thursdayStart, thursdayEnd,
        fridayStart, fridayEnd,
        saturdayStart, saturdayEnd,
        sundayStart, sundayEnd,
      },
      create: {
        plumberProfileId: plumberProfile.id,
        preferredJobTypes: preferredJobTypes || [],
        maxDistanceKm: maxDistanceKm || 50,
        mondayStart, mondayEnd,
        tuesdayStart, tuesdayEnd,
        wednesdayStart, wednesdayEnd,
        thursdayStart, thursdayEnd,
        fridayStart, fridayEnd,
        saturdayStart, saturdayEnd,
        sundayStart, sundayEnd,
      }
    });

    res.json({
      message: 'Job preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Update job preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};