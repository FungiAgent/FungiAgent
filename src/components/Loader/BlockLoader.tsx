// components/Loader.js
import { motion } from "framer-motion";
import styles from "./Loader.module.css";

const animation = {
    x: [-20, 20],
    transition: {
        x: {
            yoyo: Infinity,
            duration: 0.5,
            ease: "easeInOut",
        },
    },
};

const BlockLoader = () => {
    return (
        <div className="flex w-full h-full p-10 justify-center items-center">
            <motion.div
                className="w-[40px] h-[40px] bg-main rounded-lg"
                initial={{ scale: 0 }}
                animate={{ rotate: 180, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
            />
        </div>
    );
};

export default BlockLoader;
