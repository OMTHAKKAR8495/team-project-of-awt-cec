import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

// Enterprise Global Pages
import HomePage from '../pages/HomePage';
import AboutUsPage from '../pages/AboutUsPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';

// Candidate Module Pages
import JobDiscoveryPage from '../pages/candidate/JobDiscoveryPage';
import JobDetailsPage from '../pages/candidate/JobDetailsPage';
import ResumeAnalyzerPage from '../pages/candidate/ResumeAnalyzerPage';
import CandidateApplicationsPage from '../pages/candidate/CandidateApplicationsPage';
import JobMatchesPage from '../pages/candidate/JobMatchesPage';
import InterviewStudioPage from '../pages/candidate/InterviewStudioPage';

// Recruiter Module Pages
import RecruiterDashboardPage from '../pages/recruiter/RecruiterDashboardPage';
import ManageJobsPage from '../pages/recruiter/ManageJobsPage';
import CreateEditJobPage from '../pages/recruiter/CreateEditJobPage';
import JobApplicantsPage from '../pages/recruiter/JobApplicantsPage';
import AllCandidatesPage from '../pages/recruiter/AllCandidatesPage';

// System Pages
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Main Enterprise Landing Page (Reference Screenshots 1, 2, 3) */}
          <Route path="/" element={<HomePage />} />

          {/* Institutional Information Pages */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/divisions" element={<ServicesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Candidate Experience Routes */}
          <Route path="/careers" element={<JobDiscoveryPage />} />
          <Route path="/jobs" element={<JobDiscoveryPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/analyze-resume" element={<ResumeAnalyzerPage />} />
          <Route path="/job-matches" element={<JobMatchesPage />} />
          <Route path="/interview-studio" element={<InterviewStudioPage />} />
          <Route path="/applications" element={<CandidateApplicationsPage />} />
          <Route path="/database" element={<AllCandidatesPage />} />

          {/* Recruiter Experience Routes */}
          <Route
            path="/recruiter"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/jobs" element={<ManageJobsPage />} />
          <Route path="/recruiter/jobs/new" element={<CreateEditJobPage />} />
          <Route path="/recruiter/jobs/:id/edit" element={<CreateEditJobPage />} />
          <Route
            path="/recruiter/jobs/:id/applicants"
            element={<JobApplicantsPage />}
          />
          <Route path="/recruiter/candidates" element={<AllCandidatesPage />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;
