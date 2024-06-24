import Image from "next/image";
import LoginButton from "../Buttons/LoginButton";
import ProfileModal from "../Modals/ProfileModal";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import { networks } from "../../../constants/Constants";
import { useState } from "react";
import User from "../../../public/profile/User.svg";
import { motion } from "framer-motion";

export default function Header({ isConnected }) {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div className=" p-5 w-full h-[32px] absolute z-1 top-0 left-0">
            {isConnected ? (
                <div className="flex flex-row items-center justify-end z-10">
                    <ChangeNetworkDropdown networks={networks} />
                    <motion.div
                        whileHover={{ y: -5 }} // Change this value to adjust the float effect
                    >
                        <button
                            onClick={() => setOpenMenu(true)}
                            className="z-10"
                        >
                            <Image
                                width={60}
                                height={60}
                                alt="User"
                                src={User.src}
                            />
                        </button>
                    </motion.div>
                    {openMenu && (
                        <ProfileModal open={openMenu} setOpen={setOpenMenu} />
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-end">
                    <LoginButton />
                </div>
            )}
        </div>
    );
}
