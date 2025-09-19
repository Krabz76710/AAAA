import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  currentStep: string;
  completedSteps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isPast = completedSteps.includes(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : isCurrent 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className={`text-sm font-semibold ${
                    isCurrent ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-24">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 relative">
                  <div className={`absolute top-6 left-0 right-0 h-0.5 transition-all duration-300 ${
                    completedSteps.includes(steps[index + 1].id) ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                  <ArrowRight className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 ${
                    completedSteps.includes(steps[index + 1].id) ? 'text-emerald-500' : 'text-gray-300'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};