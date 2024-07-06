import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function RubricDisplay({ rubric, onEditRubric, isApproved }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const popoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoutRef.current && !popoutRef.current.contains(event.target)) {
        setHoveredCell(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!rubric || !rubric.categories || !Array.isArray(rubric.categories) || rubric.categories.length === 0) {
    return (
      <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">No valid rubric available.</p>
        <p>Please create or update the rubric for this assignment.</p>
      </div>
    );
  }

  const maxLevels = Math.max(...rubric.categories.map(category =>
    Array.isArray(category.scoring_levels) ? category.scoring_levels.length : 0
  ));

  const truncateText = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const handleCellHover = (event, row, col) => {
    const cellRect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({ row, col, rect: cellRect });
  };

  return (
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className={`mt-8 ${!isApproved ? 'border-2 border-yellow-500 p-4 rounded-lg' : ''}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{rubric.title || 'Rubric'}</h2>
          <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onClick={() => onEditRubric(rubric)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
          >
            <PencilIcon className="h-5 w-5 mr-2"/>
            Edit Rubric
          </motion.button>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              {[...Array(maxLevels)].map((_, index) => (
                  <th key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level {index + 1}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {rubric.categories.map((category, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name} ({category.weight}%)
                  </td>
                  {[...Array(maxLevels)].map((_, colIndex) => {
                    const level = category.scoring_levels && category.scoring_levels[colIndex];
                    return (
                        <td
                            key={colIndex}
                            className="px-6 py-4 text-sm text-gray-500 relative cursor-pointer"
                            onMouseEnter={(e) => handleCellHover(e, rowIndex, colIndex)}
                            onMouseLeave={() => setHoveredCell(null)}
                        >
                          {level ? truncateText(level.description, 30) : 'N/A'}
                        </td>
                    );
                  })}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        {hoveredCell && (
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.2}}
                ref={popoutRef}
                className="fixed z-50 bg-white border border-gray-200 p-4 rounded shadow-lg max-w-md"
                style={{
                  top: `${hoveredCell.rect.bottom + window.scrollY}px`,
                  left: `${hoveredCell.rect.left}px`,
                }}
            >
              {rubric.categories[hoveredCell.row]?.scoring_levels?.[hoveredCell.col] ? (
                  <>
                    <h4 className="font-bold">
                      Level {rubric.categories[hoveredCell.row].scoring_levels[hoveredCell.col].level}
                    </h4>
                    <p>{rubric.categories[hoveredCell.row].scoring_levels[hoveredCell.col].description}</p>
                  </>
              ) : (
                  <p>No information available for this level.</p>
              )}
            </motion.div>
        )}
      </motion.div>
  );
}

export default RubricDisplay;