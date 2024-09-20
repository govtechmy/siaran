'use client';

import React from 'react';

interface ViewSwitchProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

const ViewSwitch: React.FC<ViewSwitchProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex gap-0 h-[32px]" style={{ width: '167px', height: '32px', opacity: 1 }}>
      <button
        className={`${
          view === 'card'
            ? 'bg-[#E4E4E7] text-[#18181B]'
            : 'bg-transparent text-[#71717A]'
        } rounded-full border-none h-[32px] px-[10px] py-[6px] gap-[4px] transition-all`}
        style={{ borderRadius: '999px' }}
        onClick={() => onViewChange('card')}
      >
        <span className="text-[14px] font-medium" style={{ lineHeight: '20px' }}>
          Card view
        </span>
      </button>
      <button
        className={`${
          view === 'list'
            ? 'bg-[#E4E4E7] text-[#18181B]'
            : 'bg-transparent text-[#71717A]'
        } rounded-full border-none h-[32px] px-[10px] py-[6px] gap-[4px] transition-all`}
        style={{ borderRadius: '999px' }}
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
