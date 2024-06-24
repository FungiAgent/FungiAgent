import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/20/solid";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0" },
    exit: { opacity: 0, y: "100vh" },
};

const ModalContainer = ({
    showModal,
    setShowModal,
    children,
    position,
    title,
    close,
}: {
    showModal: boolean;
    setShowModal: any;
    children: any;
    position?: "top-right" | "center";
    title?: string;
    close?: boolean;
}) => {
    return (
        <AnimatePresence mode="wait">
            {showModal && (
                <motion.div
                    className={`fixed top-0 left-0 flex w-full h-full bg-gray-300 bg-opacity-50 z-10 p-10 ${position === "top-right" ? "justify-end items-start" : "justify-center items-center"}`}
                    variants={backdropVariants}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(false);
                    }}
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="bg-white rounded-lg  shadow-input py-[32px] px-[26px]">
                            {/* {close ? (
                                <div className="flex justify-end pt-2 pr-2">
                                    <button onClick={() => setShowModal(false)}>
                                        <XMarkIcon
                                            className="text-black"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                </div>
                            ) : (
                                <div></div>
                            )} */}
                            <div className="w-full flex justify-between pb-[10px]">
                                {title && (
                                    <p className="font-light text-center w-full text-lg">
                                        {title}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col justify-center  text-center">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalContainer;
