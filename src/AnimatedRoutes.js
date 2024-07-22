// AnimatedRoutes.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import AssignmentView from './components/Assignment/AssignmentView';
import RubricEditor from './components/Rubric/RubricEditor';
import SubmissionList from './components/Submission/SubmissionList';
import GradingPipeline from './components/Grading/GradingPipeline';
import KnowledgeBase from './components/KnowledgeBase/KnowledgeBase';
import SignUpPage from './components/Auth/SignUpPage';
import LoginPage from './components/Auth/LoginPage';
import NotFound from './components/NotFound';
import AssignmentKnowledgeBasePage from "./components/KnowledgeBase/AssignmentKnowledgeBasePage";
import KnowledgeBasePage from "./components/KnowledgeBase/KnowledgeBasePage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assignment/:id" element={<AssignmentView />} />
          <Route path="assignment/:id/rubric" element={<RubricEditor />} />
          <Route path="assignment/:id/submissions" element={<SubmissionList />} />
          <Route path="submission/:id/grade" element={<GradingPipeline />} />
          <Route path="knowledge-base/:assignmentId" element={<AssignmentKnowledgeBasePage />} />
          <Route path="knowledge-base/" element={<KnowledgeBasePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;