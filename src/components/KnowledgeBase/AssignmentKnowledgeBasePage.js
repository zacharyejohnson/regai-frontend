// components/KnowledgeBase/AssignmentKnowledgeBasePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSubmissionsWithCycles, updateSubmission, updateKnowledgeBaseItem } from '../utils/knowledgeBaseApi';
import SubmissionGradingCard from './SubmissionGradingCard';
import LoadingSpinner from '../LoadingSpinner';

const AssignmentKnowledgeBasePage = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  const loadSubmissions = async () => {
  try {
    const fetchedSubmissions = await fetchSubmissionsWithCycles(assignmentId);
    setSubmissions(fetchedSubmissions);
  } catch (error) {
    console.error('Error loading submissions:', error);
    setError('Failed to load submissions. Please try again.');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  console.log(submissions);
}, [submissions]);

  const handleUpdate = async () => {
    try {
      const fetchedSubmissions = await fetchSubmissionsWithCycles(assignmentId);
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error('Error refreshing submissions:', error);
      setError('Failed to refresh submissions. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Assignment Knowledge Base</h1>
      <AnimatePresence>
       {submissions.map((submission) => (
      <SubmissionGradingCard
        key={submission.id}
        knowledgeBaseItems={{}}
        submission={submission}
        isExpanded={expandedSubmission === submission.id}
        onToggleExpand={() => setExpandedSubmission(
          expandedSubmission === submission.id ? null : submission.id
        )}
        onUpdate={handleUpdate}
      />
    ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignmentKnowledgeBasePage;