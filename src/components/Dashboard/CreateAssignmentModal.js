import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import Button from '../Common/Button';
import DynamicLoadingScreen from '../Loading/DynamicLoadingScreen';
import RubricApprovalModal from '../Rubric/RubricApprovalModal';

function CreateAssignmentModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [processId, setProcessId] = useState(null);
  const [createdAssignment, setCreatedAssignment] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onClose(); // Close the modal immediately

    try {
      const response = await axios.post(`${API_BASE_URL}/assignments/`, formData);
      setProcessId(response.data.process_id);
      setCreatedAssignment(response.data);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setIsLoading(false);
    }
  };

  const handleRubricApproval = (approvedRubric) => {
    // Here you would typically send the approved rubric back to the server
    // and then call onCreate with the final assignment data
    onCreate({ ...createdAssignment, rubric: approvedRubric });
    setIsLoading(false);
  };

  if (isLoading && !createdAssignment) {
    return <DynamicLoadingScreen processId={processId} />;
  }

  if (createdAssignment) {
    return (
      <RubricApprovalModal
        assignment={createdAssignment}
        onApprove={handleRubricApproval}
        onReject={() => setIsLoading(false)} // Handle rejection (e.g., go back to form)
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Create Assignment</Button>
            <Button onClick={onClose} variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignmentModal;