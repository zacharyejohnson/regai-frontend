import React, { useState } from 'react';
import Button from '../Common/Button';

function KnowledgeBaseItemForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    item_type: 'rubric',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'content' ? JSON.parse(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="item_type" className="block text-sm font-medium text-gray-700">Item Type</label>
        <select
          id="item_type"
          name="item_type"
          value={formData.item_type}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="rubric">Rubric</option>
          <option value="grade">Grade</option>
          <option value="critique">Critique</option>
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (JSON)</label>
        <textarea
          id="content"
          name="content"
          value={JSON.stringify(formData.content, null, 2)}
          onChange={handleChange}
          rows="10"
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
      </div>
    </form>
  );
}

export default KnowledgeBaseItemForm;