import { Request, Response, NextFunction } from 'express';
import * as candidateService from '../services/candidateService';
import { AppError } from '../middleware/error.middleware';

export const applyCandidateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('Resume file (.pdf, .docx, or .txt) is required to apply.', 400);
    }

    const candidate = await candidateService.applyCandidate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      jobId: req.body.jobId,
      notes: req.body.notes,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Resume parsed and ATS score generated.',
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidatesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await candidateService.getCandidates(req.query);
    res.status(200).json({
      success: true,
      data: result.candidates,
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

export const getCandidateByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const candidate = await candidateService.getCandidateById(req.params.id);
    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidatesByJobHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await candidateService.getCandidatesByJob(req.params.jobId, page, limit);

    res.status(200).json({
      success: true,
      data: result.candidates,
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

export const updateCandidateStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await candidateService.updateCandidateStatus(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: `Candidate application status updated to '${req.body.status}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCandidateNotesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await candidateService.updateCandidateNotes(req.params.id, req.body.notes);
    res.status(200).json({
      success: true,
      message: 'Recruiter notes updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
