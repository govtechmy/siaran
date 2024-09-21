'use client';

import React from 'react';

interface ViewSwitchProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

const ViewSwitch: React.FC<ViewSwitchProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex">
      <button
        className={`flex justify-center items-center gap-1 px-[10px] py-[6px] rounded-full ${
          view === 'card'
            ? 'bg-[#E4E4E7] text-[#18181B]' 
            : 'bg-transparent text-[#71717A]' 
        }`}
        style={{
          height: '32px',
          minHeight: '32px',
        }}
        onClick={() => onViewChange('card')}
      >
        <span className="text-[14px] font-medium" style={{ lineHeight: '20px' }}>
          Card view
        </span>
      </button>

      <button
        className={`flex justify-center items-center gap-1 px-[10px] py-[6px] rounded-full ${
          view === 'list'
            ? 'bg-[#E4E4E7] text-[#18181B]'
            : 'bg-transparent text-[#71717A]' 
        }`}
        style={{
          height: '32px',
          minHeight: '32px',
        }}
        onClick={() => onViewChange('list')}
      >
        <span className="text-[14px] font-medium" style={{ lineHeight: '20px' }}>
          List view
        </span>
      </button>
    </div>
  );
};

export default ViewSwitch;
