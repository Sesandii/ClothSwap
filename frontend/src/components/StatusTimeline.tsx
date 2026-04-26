import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
export interface TimelineStep {
  label: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}
interface StatusTimelineProps {
  steps: TimelineStep[];
}
export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <div className="relative pl-4 py-4">
      {/* Vertical Line */}
      <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-warmGray-200" />

      <div className="space-y-8 relative">
        {steps.map((step, index) =>
        <div key={index} className="flex items-start">
            {/* Circle Indicator */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full mt-0.5 shrink-0 bg-white">
              {step.completed ?
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </div> :
            step.current ?
            <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center bg-white">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                </div> :

            <div className="w-6 h-6 rounded-full border-2 border-warmGray-300 bg-white" />
            }
            </div>

            {/* Content */}
            <div className="ml-4 flex-1">
              <h4
              className={`text-sm font-medium ${step.completed || step.current ? 'text-warmGray-900' : 'text-warmGray-500'}`}>
              
                {step.label}
              </h4>
              {step.description &&
            <p className="text-sm text-warmGray-500 mt-1">
                  {step.description}
                </p>
            }
            </div>
          </div>
        )}
      </div>
    </div>);

}