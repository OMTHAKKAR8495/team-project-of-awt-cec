import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/jobService';

export const createJobHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await jobService.getJobs(req.query);
    res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedJob = await jobService.updateJob(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedJob = await jobService.deleteJob(req.params.id);
    const id = '_id' in deletedJob ? deletedJob._id : deletedJob.id;
    const title = 'title' in deletedJob ? deletedJob.title : undefined;
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
      data: { id, title },
    });
  } catch (error) {
    next(error);
  }
};
