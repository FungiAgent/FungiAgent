import React from "react";

const ConfirmationButtons = ({ confirmAction, rejectAction, isConfirmed }) => {
    return (
        <div className="flex justify-center space-x-8">
            <button
                onClick={confirmAction}
                disabled={isConfirmed}
                className={`px-4 py-2 rounded-full shadow-lg bg-confirm text-white hover:opacity-70 w-[88px] ${isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Confirm
            </button>
            <button
                onClick={rejectAction}
                disabled={isConfirmed}
                className={`px-4 py-2 rounded-full shadow-lg bg-cancel text-white hover:opacity-70 w-[88px] ${isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Cancel
            </button>
        </div>
    );
};

export default ConfirmationButtons;
