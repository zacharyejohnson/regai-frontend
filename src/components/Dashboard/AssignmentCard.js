
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AssignmentCard({ assignment, onDelete }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="px-6 py-5">
        <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {assignment.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {assignment.description.length > 100
            ? `${assignment.description.substring(0, 100)}...`
            : assignment.description}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to={`/assignment/${assignment.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            View Details
          </Link>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {assignment.submission_count} submission{assignment.submission_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <button
          onClick={() => onDelete(assignment.id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Delete Assignment
        </button>
      </div>
    </motion.div>
  );
}

export default AssignmentCard;