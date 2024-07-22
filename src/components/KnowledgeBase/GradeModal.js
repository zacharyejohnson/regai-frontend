import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PencilAltIcon, CheckIcon } from '@heroicons/react/solid';

const GradeModal = ({ grade, onClose, onUpdate, isInitial }) => {
  const [editedGrade, setEditedGrade] = useState(() => {
    let content = grade.content;
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

    // Ensure categories is an array
    if (!Array.isArray(categories)) {
      console.error('Unexpected grade content structure:', content);
      categories = [];
    }

    return {...grade, content: categories};
  });

  const handleSave = () => {
    console.log(editedGrade);
  onUpdate({
    ...grade,
    content: editedGrade.content,
    human_approved: true
  });
  onClose();

  console.log(editedGrade);
  console.log(grade);
};

  const handleCategoryChange = (index, field, value) => {
    const newGrade = {...editedGrade};
    newGrade.content[index] = { ...newGrade.content[index], [field]: value };
    setEditedGrade(newGrade);
  };

  const calculateOverallScore = () => {
    if (!editedGrade.content || !Array.isArray(editedGrade.content)) return 0;

    const totalScore = editedGrade.content.reduce((sum, category) => sum + (category.score || 0), 0);
    return (totalScore / editedGrade.content.length).toFixed(2);
  };

  const EditableField = ({ value, onChange, isNumber = false, multiline = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        if (inputRef.current.type !== 'number') {
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
      }
    }, [isEditing]);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        onChange(isNumber ? parseFloat(localValue) : localValue);
        setIsEditing(false);
      }
    };

    const handleBlur = () => {
      onChange(isNumber ? parseFloat(localValue) : localValue);
      setIsEditing(false);
    };

    const commonClasses = "w-full p-2 rounded-md text-gray-700 bg-gray-50";

    if (!isEditing) {
      return (
        <div
          className={`${commonClasses} cursor-text relative group min-h-[40px]`}
          onClick={() => setIsEditing(true)}
        >
          {multiline ? (
            <pre className="whitespace-pre-wrap font-sans">{value}</pre>
          ) : (
            <p>{value}</p>
          )}
          <PencilAltIcon className="h-5 w-5 absolute top-2 right-2 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      );
    }

    return multiline ? (
      <textarea
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${commonClasses} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
        rows="3"
      />
    ) : (
      <input
        ref={inputRef}
        type={isNumber ? "number" : "text"}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${commonClasses} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
        min={isNumber ? 0 : undefined}
        max={isNumber ? 6 : undefined}
        step={isNumber ? 0.1 : undefined}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden h-full w-full flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{isInitial ? 'Initial' : 'Final'} Grade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-5xl font-bold text-indigo-600">{(calculateOverallScore() * 100 / 6).toFixed(2)}%</div>
          <div className="text-gray-500 mt-1">Overall Score: {calculateOverallScore()}/6</div>
        </div>

        <div className="space-y-4">
          {Array.isArray(editedGrade.content) && editedGrade.content.map((category, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                <EditableField
                  value={category.score}
                  onChange={(value) => handleCategoryChange(index, 'score', value)}
                  isNumber={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                <EditableField
                  value={category.justification}
                  onChange={(value) => handleCategoryChange(index, 'justification', value)}
                  multiline={true}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GradeModal;