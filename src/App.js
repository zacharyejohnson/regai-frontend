import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
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
import { AnimatePresence } from 'framer-motion';

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
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;