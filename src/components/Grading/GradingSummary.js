import React from 'react';

function GradingSummary({ initialGrade, critique, finalGrade }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Grading Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Initial Grade</h3>
          <p className="text-3xl font-bold text-blue-500">{initialGrade.overall_score}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Critique</h3>
          <p className="text-sm">{critique.overall_assessment}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Final Grade</h3>
          <p className="text-3xl font-bold text-green-500">{finalGrade.overall_score}</p>
        </div>
      </div>
    </div>
  );
}

export default GradingSummary;