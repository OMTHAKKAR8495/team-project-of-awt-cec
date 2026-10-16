import { Request, Response, NextFunction } from 'express';
import * as resumeService from '../services/resumeService';
import { AppError } from '../middleware/error.middleware';

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
      jobId: req.body.jobId,
      jobTitle: req.body.jobTitle,
      requiredSkills: req.body.requiredSkills,
      preferredSkills: req.body.preferredSkills,
      requirements: req.body.requirements,
    });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
