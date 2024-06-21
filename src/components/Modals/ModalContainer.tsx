import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0" },
    exit: { opacity: 0, y: "100vh" },
};

const ModalContainer = ({ showModal, setShowModal, children, position }) => {
    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className={`fixed top-0 left-0 flex w-full h-full bg-gray-300 bg-opacity-50 z-10 p-10 ${position === "top-right" ? "justify-end items-start" : "justify-center items-center"}`}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(false);
                    }}
                >
                    <motion.div
                        className=""
                        variants={modalVariants}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalContainer;
