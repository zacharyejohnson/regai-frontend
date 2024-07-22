import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon } from '@heroicons/react/solid';
import { approveKnowledgeBaseItem } from "../utils/knowledgeBaseApi";

import RubricModal from "./RubricModal";
import GradeModal from "./GradeModal";
import CritiqueModal from "./CritiqueModal";
import {CheckCircleIcon} from "@heroicons/react/outline";

function CircularProgressBar({ percentage }) {
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent) => {
    if (percent >= 80) return '#10B981';
    if (percent >= 60) return '#FBBF24';
    return '#EF4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-12 h-12" viewBox="0 0 44 44">
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          r="20"
          cx="22"
          cy="22"
        />
        <circle
          className="text-blue-600"
          stroke={getColor(percentage)}
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
          r="20"
          cx="22"
          cy="22"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease 0s',
          }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700">{percentage}%</span>
    </div>
  );
}

const SubmissionGradingCard = ({ submission, isExpanded, onToggleExpand, onUpdate }) => {
  const [modalState, setModalState] = useState({ isOpen: false, type: null, item: null });
  const [localSubmission, setLocalSubmission] = useState(submission);
  console.log("Submission data: ", submission);

  const stages = [
    { name: 'rubric', label: 'Rubric', color: 'indigo', icon: '📋' },
    { name: 'initial_grade', label: 'Initial Grade', color: 'blue', icon: '🔎' },
    { name: 'critique', label: 'Critique', color: 'purple', icon: '💬' },
    { name: 'final_grade', label: 'Final Grade', color: 'green', icon: '🏆' },
  ];

  const handleViewItem = (item, type) => {
  let modalItem = { ...item };

  if (type === 'initial_grade' || type === 'final_grade') {
    let content = modalItem.content;
    let categories = [];

    if (Array.isArray(content)) {
      if (content.length > 0 && content[0].categories) {
        categories = content[0].categories;
      } else {
        categories = content;
      }
    } else if (typeof content === 'object') {
      if (content.categories) {
        categories = content.categories;
      } else {
        categories = [content];
      }
    }

    modalItem.content = categories;
  }

  setModalState({
    isOpen: true,
    type,
    item: modalItem,
  });
};

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null, item: null });
  };

  const handleApproveItem = async (itemType, item) => {
    try {
      console.log("Approving item:", itemType, item);
      const updatedItem = await approveKnowledgeBaseItem(itemType, item);
      setLocalSubmission(prevSubmission => ({
        ...prevSubmission,
        knowledge_base_items: {
          ...prevSubmission.knowledge_base_items,
          [itemType]: {
            ...prevSubmission.knowledge_base_items[itemType],
            ...updatedItem,
            human_approved: true
          }
        }
      }));
      onUpdate(localSubmission);
      handleCloseModal();
    } catch (error) {
      console.error(`Error approving ${itemType}:`, error);
      // Implement error handling (e.g., show an error message to the user)
    }
  };

  const renderModal = () => {
    const { isOpen, type, item } = modalState;
    if (!isOpen || !item) return null;

    const commonProps = {
      onClose: handleCloseModal,
      onUpdate: (updatedData) => {
        console.log("this data will be the content key for the KB item: ", updatedData);
        handleApproveItem(type, { ...item, content: updatedData, human_approved: true });
      },
    };

    switch (type) {
      case 'rubric':
        return <RubricModal rubric={item} {...commonProps} />;
      case 'initial_grade':
      case 'final_grade':
        let gradeContent = item.content;
        if (Array.isArray(gradeContent) && gradeContent.length === 1 && Array.isArray(gradeContent[0])) {
          gradeContent = gradeContent[0];
        }
        return <GradeModal grade={{...item, content: gradeContent}} isInitial={type === 'initial_grade'} {...commonProps} />;
      case 'critique':
        return <CritiqueModal critique={item} {...commonProps} />;
      default:
        return null;
    }
  };


  const getFinalGrade = () => {
  const finalGrade = localSubmission.knowledge_base_items?.final_grade;
  if (!finalGrade || !finalGrade.content) return null;

  let gradeContent = finalGrade.content;
  let categories = [];

  // Handle different possible structures
  if (Array.isArray(gradeContent)) {
    if (gradeContent.length > 0 && gradeContent[0].categories) {
      categories = gradeContent[0].categories;
    } else {
      categories = gradeContent;
    }
  } else if (typeof gradeContent === 'object') {
    if (gradeContent.categories) {
      categories = gradeContent.categories;
    } else {
      categories = [gradeContent];
    }
  }

  // Ensure categories is an array
  if (!Array.isArray(categories)) {
    console.error('Unexpected grade content structure:', gradeContent);
    return null;
  }

  const validScores = categories.filter(cat => typeof cat.score === 'number' && !isNaN(cat.score));

  if (validScores.length === 0) return null;

  const overallScore = validScores.reduce((sum, cat) => sum + cat.score, 0) / validScores.length;
  const percentage = Math.round((overallScore / 6) * 100);

  return <CircularProgressBar percentage={percentage} />;
};


  const getStageStatus = (stage) => {
    const item = localSubmission.knowledge_base_items?.[stage.name];
    if (!item) return 'pending';
    if (item.human_approved) return 'approved';
    return 'completed';
  };

  const renderGradeContent = (item) => {
  if (!item || !item.content) return 'Not available';

  let categories = Array.isArray(item.content) ? item.content : [item.content];
  if (categories.length > 0 && categories[0].categories) {
    categories = categories[0].categories;
  }

  const validScores = categories.filter(cat => typeof cat.score === 'number' && !isNaN(cat.score));
  if (validScores.length === 0) return 'No valid scores';

  const avgScore = validScores.reduce((sum, cat) => sum + cat.score, 0) / validScores.length;
  return `Overall Score: ${avgScore.toFixed(2)}/6`;
};

  const renderStageContent = (stage, item) => {
  if (!item || !item.content) return <span className="italic">Not available</span>;

  switch (stage.name) {
    case 'rubric':
      return `${item.content.categories?.length || 0} categories defined`;
    case 'initial_grade':
    case 'final_grade':
      let gradeContent = item.content;
      let categories = [];

      if (Array.isArray(gradeContent)) {
        if (gradeContent.length > 0 && gradeContent[0].categories) {
          categories = gradeContent[0].categories;
        } else {
          categories = gradeContent;
        }
      } else if (typeof gradeContent === 'object') {
        if (gradeContent.categories) {
          categories = gradeContent.categories;
        } else {
          categories = [gradeContent];
        }
      }

      if (!Array.isArray(categories)) {
        console.error('Unexpected grade content structure:', gradeContent);
        return 'Invalid grade data';
      }

      const validScores = categories.filter(cat => typeof cat.score === 'number' && !isNaN(cat.score));
      if (validScores.length === 0) return 'No valid scores';
      const avgScore = validScores.reduce((sum, cat) => sum + cat.score, 0) / validScores.length;
      return `Overall Score: ${avgScore.toFixed(2)}/6`;
    case 'critique':
      return truncate(item.content.overall_assessment || '', 100);
    default:
      return '';
  }
};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white shadow-lg rounded-lg p-4 mb-4 w-full transition-all duration-300 ${isExpanded ? 'hover:shadow-xl' : 'hover:bg-gray-50'}`}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">{localSubmission.student_name}'s Submission</h3>
          <p className="text-sm text-gray-500">
            Submitted: {new Date(localSubmission.submitted_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {getFinalGrade()}
          {isExpanded ? (
            <ChevronUpIcon className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            <div className="relative">
              {stages.map((stage, index) => {
                const status = getStageStatus(stage);
                const item = localSubmission.knowledge_base_items?.[stage.name];
                return (
                    <div key={stage.name} className="mb-8 last:mb-0">
                      <div
                          className={`absolute left-8 top-0 bottom-0 w-1 bg-${stage.color}-300 ${index === stages.length - 1 ? 'h-1/2' : ''}`}/>
                      <div className="relative flex items-center">
                        <div
                            className={`w-16 h-16 rounded-full bg-${stage.color}-200 flex items-center justify-center text-2xl z-10`}>
                          {stage.icon}
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className={`bg-${stage.color}-100 p-4 rounded-lg shadow-sm`}>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className={`text-lg font-semibold text-${stage.color}-800`}>{stage.label}</h4>
                              {status === 'approved' && (
                                  <CheckCircleIcon className="w-6 h-6 text-green-600"/>
                              )}
                            </div>
                            <p className={`text-sm text-${stage.color}-700 mb-2`}>
                              {renderStageContent(stage, item)}
                            </p>
                            <div className="flex justify-between items-center">
                              <motion.button
                                  whileHover={{scale: 1.05}}
                                  whileTap={{scale: 0.95}}
                                  onClick={() => item && handleViewItem(item, stage.name)}
                                  className={`bg-${stage.color}-600 hover:bg-${stage.color}-700 text-white font-bold py-2 px-4 rounded inline-flex items-center text-sm ${!item && 'opacity-50 cursor-not-allowed'}`}
                                  disabled={!item}
                              >
                                <EyeIcon className="w-4 h-4 mr-2"/>
                                View
                              </motion.button>
                              {item && !item.human_approved && (
                                  <motion.button
                                      whileHover={{scale: 1.05}}
                                      whileTap={{scale: 0.95}}
                                      onClick={() => handleApproveItem(stage.name, item)}
                                      className={`bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs`}
                                  >
                                    Approve
                                  </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalState.isOpen && renderModal()}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to truncate text
const truncate = (str, n) => {
  if (!str) return ''; // Return empty string if str is null or undefined
  return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

export default SubmissionGradingCard;