import { Request, Response } from 'express';
import { JobStatus, UserRole } from '@prisma/client';
import prisma from '../utils/database';
import { CreateJobRequest, CreateQuoteRequest, UpdateJobStatusRequest, CreateReviewRequest } from '../types';

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, jobType, urgency, address, latitude, longitude }: CreateJobRequest = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!title || !description || !jobType || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        jobType,
        urgency,
        address,
        latitude,
        longitude,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlumberJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get plumber profile with preferences
    const plumberProfile = await prisma.plumberProfile.findUnique({
      where: { userId },
      include: {
        preferences: true,
      }
    });

    if (!plumberProfile) {
      return res.status(404).json({ error: 'Plumber profile not found' });
    }

    // Build filter conditions
    const whereConditions: any = {
      status: JobStatus.REQUESTED,
      assignedToId: null, // Only unassigned jobs
    };

    // Filter by preferred job types if set
    if (plumberProfile.preferences?.preferredJobTypes?.length) {
      whereConditions.jobType = {
        in: plumberProfile.preferences.preferredJobTypes
      };
    }

    const jobs = await prisma.job.findMany({
      where: whereConditions,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        photos: {
          select: {
            id: true,
            url: true,
            caption: true,
          }
        },
        quotes: {
          select: {
            id: true,
            goodTitle: true,
            goodDescription: true,
            goodPrice: true,
            betterTitle: true,
            betterDescription: true,
            betterPrice: true,
            bestTitle: true,
            bestDescription: true,
            bestPrice: true,
            selectedTier: true,
            status: true,
          }
        }
      },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get plumber jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitQuote = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const quoteData: CreateQuoteRequest = req.body;

    // Validate required fields
    if (!quoteData.goodTitle || !quoteData.goodDescription || !quoteData.goodPrice ||
        !quoteData.betterTitle || !quoteData.betterDescription || !quoteData.betterPrice ||
        !quoteData.bestTitle || !quoteData.bestDescription || !quoteData.bestPrice) {
      return res.status(400).json({ error: 'Missing required quote fields' });
    }

    // Check if job exists and is in correct status
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== JobStatus.REQUESTED) {
      return res.status(400).json({ error: 'Job is not available for quoting' });
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        jobId,
        ...quoteData,
      }
    });

    // Update job status to QUOTED
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.QUOTED }
    });

    res.status(201).json({
      message: 'Quote submitted successfully',
      quote
    });
  } catch (error) {
    console.error('Submit quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const { status, scheduledAt, completedAt }: UpdateJobStatusRequest = req.body;
    const userId = req.user!.id;

    // Validate status
    if (!Object.values(JobStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Authorization check - only assigned plumber or job creator can update
    if (job.assignedToId !== userId && job.createdById !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    // Prepare update data
    const updateData: any = { status };

    if (scheduledAt) {
      updateData.scheduledAt = new Date(scheduledAt);
    }

    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    }

    // If status is IN_PROGRESS, assign the job to current user (if plumber)
    if (status === JobStatus.IN_PROGRESS && req.user!.role === UserRole.PLUMBER) {
      updateData.assignedToId = userId;
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });

    res.json({
      message: 'Job status updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadJobPhoto = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const { caption } = req.body;
    const userId = req.user!.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Create photo record
    const photo = await prisma.photo.create({
      data: {
        jobId,
        uploadedById: userId,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        caption,
      }
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const { rating, comment }: CreateReviewRequest = req.body;
    const authorId = req.user!.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if job exists and is completed
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignedTo: true,
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== JobStatus.COMPLETED) {
      return res.status(400).json({ error: 'Job must be completed to leave a review' });
    }

    if (!job.assignedToId) {
      return res.status(400).json({ error: 'No plumber assigned to this job' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        jobId,
        authorId,
      }
    });

    if (existingReview) {
      return res.status(409).json({ error: 'Review already exists for this job' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        jobId,
        authorId,
        targetId: job.assignedToId,
        rating,
        comment,
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};