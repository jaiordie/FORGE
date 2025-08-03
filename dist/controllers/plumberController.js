"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobPreferences = exports.updateAvailability = exports.getPlumberDashboard = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../utils/database"));
const getPlumberDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get plumber profile
        const plumberProfile = await database_1.default.plumberProfile.findUnique({
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
            database_1.default.earning.aggregate({
                where: {
                    plumberId: userId,
                    createdAt: { gte: startOfToday }
                },
                _sum: { amount: true }
            }),
            database_1.default.earning.aggregate({
                where: {
                    plumberId: userId,
                    createdAt: { gte: startOfWeek }
                },
                _sum: { amount: true }
            }),
            database_1.default.earning.aggregate({
                where: {
                    plumberId: userId,
                    createdAt: { gte: startOfMonth }
                },
                _sum: { amount: true }
            }),
            database_1.default.earning.aggregate({
                where: { plumberId: userId },
                _sum: { amount: true }
            })
        ]);
        // Get job counts
        const [availableJobs, inProgressJobs, completedJobs] = await Promise.all([
            database_1.default.job.count({
                where: {
                    status: client_1.JobStatus.REQUESTED,
                    assignedToId: null
                }
            }),
            database_1.default.job.count({
                where: {
                    assignedToId: userId,
                    status: client_1.JobStatus.IN_PROGRESS
                }
            }),
            database_1.default.job.count({
                where: {
                    assignedToId: userId,
                    status: client_1.JobStatus.COMPLETED
                }
            })
        ]);
        const dashboardData = {
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
    }
    catch (error) {
        console.error('Get plumber dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPlumberDashboard = getPlumberDashboard;
const updateAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ error: 'isActive must be a boolean' });
        }
        const updatedProfile = await database_1.default.plumberProfile.update({
            where: { userId },
            data: { isActive }
        });
        res.json({
            message: 'Availability updated successfully',
            isActive: updatedProfile.isActive
        });
    }
    catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateAvailability = updateAvailability;
const updateJobPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { preferredJobTypes, maxDistanceKm, mondayStart, mondayEnd, tuesdayStart, tuesdayEnd, wednesdayStart, wednesdayEnd, thursdayStart, thursdayEnd, fridayStart, fridayEnd, saturdayStart, saturdayEnd, sundayStart, sundayEnd, } = req.body;
        // Get plumber profile
        const plumberProfile = await database_1.default.plumberProfile.findUnique({
            where: { userId }
        });
        if (!plumberProfile) {
            return res.status(404).json({ error: 'Plumber profile not found' });
        }
        // Upsert job preferences
        const preferences = await database_1.default.jobPreference.upsert({
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
    }
    catch (error) {
        console.error('Update job preferences error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateJobPreferences = updateJobPreferences;
//# sourceMappingURL=plumberController.js.map