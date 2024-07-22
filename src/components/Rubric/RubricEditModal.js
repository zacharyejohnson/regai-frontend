import React, { useState, useRef, useEffect } from 'react';
import { XIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';

function RubricEditModal({ rubric, onSave, onClose }) {
  console.log("Rubric received in RubricEditModal:", rubric);

  const rubricData = rubric.content || rubric || {};

  const [editedRubric, setEditedRubric] = useState(rubricData);
  const [editingCell, setEditingCell] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      const height = window.innerHeight * 0.9;
      modalRef.current.style.maxHeight = `${height}px`;
    }
  }, []);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave({ ...rubric, rubric: editedRubric });
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...editedRubric.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const handleLevelChange = (categoryIndex, levelIndex, field, value) => {
    const newCategories = [...editedRubric.categories];
    newCategories[categoryIndex].scoring_levels[levelIndex] = {
      ...newCategories[categoryIndex].scoring_levels[levelIndex],
      [field]: value
    };
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const addCategory = () => {
    const newCategories = [
      ...editedRubric.categories,
      {
        name: 'New Category',
        weight: 0,
        scoring_levels: editedRubric.categories[0]?.scoring_levels?.map((_, index) => ({
          level: index + 1,
          description: ''
        })) || [],
      },
    ];
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const addScoringLevel = () => {
    const newCategories = editedRubric.categories.map(category => ({
      ...category,
      scoring_levels: [
        ...(category.scoring_levels || []),
        { level: (category.scoring_levels?.length || 0) + 1, description: '' }
      ],
    }));
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const removeCategory = (index) => {
    const newCategories = editedRubric.categories.filter((_, i) => i !== index);
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const removeScoringLevel = (index) => {
    const newCategories = editedRubric.categories.map(category => ({
      ...category,
      scoring_levels: category.scoring_levels.filter((_, i) => i !== index),
    }));
    setEditedRubric({ ...editedRubric, categories: newCategories });
  };

  const truncateText = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const EditCellModal = ({ value, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg shadow-xl w-1/2" onClick={(e) => e.stopPropagation()}>
        <textarea
          className="w-full h-40 p-2 border rounded"
          value={value}
          onChange={(e) => onSave(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  console.log("Edited Rubric:", editedRubric);

  if (!rubricData || !rubricData.categories || rubricData.categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Error: Invalid Rubric</h2>
          <p>The rubric data is invalid or empty. Please check the data and try again.</p>
          <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={onClose}>
      <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Rubric</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="w-full">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} />
              {editedRubric.categories[0]?.scoring_levels.map(() => (
                <col style={{ width: `${70 / editedRubric.categories[0].scoring_levels.length}%` }} />
              ))}
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-sm">Category</th>
                <th className="border px-2 py-2 text-sm">Weight</th>
                {editedRubric.categories[0]?.scoring_levels.map((_, index) => (
                  <th key={index} className="border px-2 py-2 text-sm">Level {index + 1}</th>
                ))}
                <th className="border px-2 py-2">
                  <button onClick={addScoringLevel} className="text-green-500 hover:text-green-700">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {editedRubric.categories.map((category, categoryIndex) => (
                <tr key={categoryIndex}>
                  <td className="border px-2 py-2">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(categoryIndex, 'name', e.target.value)}
                      className="w-full border-none focus:outline-none text-sm"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="number"
                      value={category.weight}
                      onChange={(e) => handleCategoryChange(categoryIndex, 'weight', parseInt(e.target.value) || 0)}
                      className="w-full border-none focus:outline-none text-sm"
                    />
                  </td>
                  {category.scoring_levels.map((level, levelIndex) => (
                    <td
                      key={levelIndex}
                      className="border px-2 py-2 relative cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100"
                      onClick={() => setEditingCell({ categoryIndex, levelIndex })}
                    >
                      <div className="text-sm">
                        {truncateText(level.description, 100)}
                      </div>
                    </td>
                  ))}
                  <td className="border px-2 py-2">
                    <button onClick={() => removeCategory(categoryIndex)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={addCategory}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
          <button
            onClick={() => handleSave()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Rubric
          </button>
        </div>
      </div>
      {editingCell && (
        <EditCellModal
          value={editedRubric.categories[editingCell.categoryIndex].scoring_levels[editingCell.levelIndex].description}
          onSave={(value) => {
            handleLevelChange(editingCell.categoryIndex, editingCell.levelIndex, 'description', value);
            setEditingCell(null);
          }}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  );
}

export default RubricEditModal;