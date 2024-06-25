import React from "react";
import { motion } from "framer-motion";

const ConfirmationButtons = ({ confirmAction, rejectAction, isConfirmed }) => {
    return (
        <div className="flex justify-center space-x-8">
            <motion.div
                whileHover={{ y: -5 }} // Change this value to adjust the float effect
            >
                <button
                    onClick={confirmAction}
                    disabled={isConfirmed}
                    className={`px-4 py-2 rounded-full shadow-lg bg-confirm text-white hover:opacity-70 w-[88px] ${isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Confirm
                </button>
            </motion.div>
            <motion.div
                whileHover={{ y: -5 }} // Change this value to adjust the float effect
            >
                <button
                    onClick={rejectAction}
                    disabled={isConfirmed}
                    className={`px-4 py-2 rounded-full shadow-lg bg-cancel text-white hover:opacity-70 w-[88px] ${isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Cancel
                </button>
            </motion.div>
        </div>
    );
};

export default ConfirmationButtons;
