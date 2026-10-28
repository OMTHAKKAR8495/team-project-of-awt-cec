import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Enterprise Global Pages
import HomePage from '../pages/HomePage';
import AboutUsPage from '../pages/AboutUsPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';

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

          {/* Authentication Gateway */}
          <Route path="/login" element={<LoginPage />} />

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
          <Route
            path="/database"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <AllCandidatesPage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Experience Routes — Protected with Role Authorization */}
          <Route
            path="/recruiter"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <ManageJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <CreateEditJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <CreateEditJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/applicants"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <JobApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/candidates"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <AllCandidatesPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;
