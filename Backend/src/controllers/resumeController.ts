import { Request, Response, NextFunction } from 'express';
import * as resumeService from '../services/resumeService';
import { AppError } from '../middleware/error.middleware';
import { cleanupFile } from '../middleware/uploadMiddleware';

export const analyzeResumeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError(
        'Resume file (.pdf, .docx, or .txt) is required in multipart form data.',
        400
      );
    }

    const result = await resumeService.analyzeUploadedResume({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      resumeName: req.file.originalname,
      mode: req.body.mode,
      jobId: req.body.jobId,
      jobTitle: req.body.jobTitle,
      requiredSkills: req.body.requiredSkills,
      preferredSkills: req.body.preferredSkills,
      requirements: req.body.requirements,
    });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully and evaluation saved to history.',
      data: result,
    });
  } catch (error) {
    if (req.file?.path) {
      await cleanupFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Retrieves past resume ATS evaluation history.
 */
export const getResumeHistoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
    const history = await resumeService.getResumeAnalysisHistory(limit);

    res.status(200).json({
      success: true,
      data: history,
      total: history.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a single analysis record by ID.
 */
export const deleteResumeHistoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await resumeService.deleteResumeAnalysisById(id);

    res.status(200).json({
      success: true,
      message: 'Resume analysis record deleted from history.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clears all resume analysis history.
 */
export const clearResumeHistoryHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await resumeService.clearResumeAnalysisHistory();

    res.status(200).json({
      success: true,
      message: 'Resume analysis history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};
