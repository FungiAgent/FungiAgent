import { motion } from "framer-motion";

const tips = [
    {
        msg: "Check my portfolio",
    },
    {
        msg: "Perform a swap",
    },
    {
        msg: "Send money",
    },
];

export default function Tips() {
    return (
        <div className="flex flex-col w-full  items-center mb-[32px]">
            <p className="text-[16px] text-center">Some ideas</p>
            <div className="flex flex-row gap-5 items-start mt-[32px]">
                {tips.map((item, index) => {
                    return (
                        <motion.div
                            whileHover={{ y: -10 }} // Change this value to adjust the float effect
                            key={index}
                        >
                            <button className="px-4 py-2 rounded-tips bg-tips shadow-input">
                                <p className="font-light">{item.msg}</p>
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
