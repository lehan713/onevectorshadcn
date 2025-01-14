import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const TutorialOverlay = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const steps = [
    {
      target: '[data-tutorial="search"]',
      content: 'Search for candidates by name, email, skills, or qualifications',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="download"]',
      content: 'Download detailed information about all candidates',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="add-user"]',
      content: 'Add new users to the system',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="history"]',
      content: 'View history of sent magic links',
      position: 'left'
    },
    {
      target: '[data-tutorial="actions"]',
      content: 'Manage users: promote/demote, delete, or view details',
      position: 'left'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  if (!showTutorial) return null;

  const currentTargetEl = document.querySelector(steps[currentStep].target);
  const rect = currentTargetEl?.getBoundingClientRect() || { top: 0, left: 0 };

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bg-white/10 border-2 border-blue-500 transition-all duration-300"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: (rect.width || 0) + 8,
            height: (rect.height || 0) + 8,
            borderRadius: '8px'
          }}
        />
      </div>
      
      <div 
        className="absolute bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl"
        style={{
          top: rect.bottom + 8,
          left: rect.left,
          maxWidth: '300px'
        }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-4 text-sm">
          {steps[currentStep].content}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-x-1">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-2 h-2 rounded-full ${
                  idx === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;