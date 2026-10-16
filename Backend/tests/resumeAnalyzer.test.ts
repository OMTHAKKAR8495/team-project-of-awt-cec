import path from 'path';
import fs from 'fs';
import os from 'os';
import { extractResumeText } from '../src/utils/resumeAnalyzer';

describe('Resume Analyzer Document Signature Verification', () => {
  it('should reject a file with PDF extension that lacks %PDF- magic bytes', async () => {
    const fakePdfPath = path.join(os.tmpdir(), `corrupt-${Date.now()}.pdf`);
    await fs.promises.writeFile(fakePdfPath, 'This is not a real PDF file format.', 'utf-8');

    await expect(extractResumeText(fakePdfPath, 'application/pdf')).rejects.toThrow(
      'Invalid PDF file header'
    );

    if (fs.existsSync(fakePdfPath)) {
      await fs.promises.unlink(fakePdfPath);
    }
  });

  it('should reject a file with DOCX extension that lacks ZIP signature', async () => {
    const fakeDocxPath = path.join(os.tmpdir(), `corrupt-${Date.now()}.docx`);
    await fs.promises.writeFile(fakeDocxPath, 'Not a zip file archive header.', 'utf-8');

    await expect(
      extractResumeText(
        fakeDocxPath,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ).rejects.toThrow('Invalid DOCX document signature');

    if (fs.existsSync(fakeDocxPath)) {
      await fs.promises.unlink(fakeDocxPath);
    }
  });
});
