import React from 'react';

const ConfirmationButtons = ({ confirmAction, rejectAction, isConfirmed }) => {
  return (
    <div className="flex justify-center space-x-8">
      <button
        className={`px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 w-[88px] ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          console.log('Confirm action triggered');
          confirmAction();
        }}
      >
        Confirm
      </button>
      <button
        className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 w-[88px]"
        onClick={() => {
          console.log('Reject action triggered');
          rejectAction();
        }}
      >
        Cancel
      </button>
    </div>
  );
};


export default ConfirmationButtons;