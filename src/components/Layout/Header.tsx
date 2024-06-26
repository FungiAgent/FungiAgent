import Image from "next/image";
import LoginButton from "../Buttons/LoginButton";
import ProfileModal from "../Modals/ProfileModal";
import { useState } from "react";
import User from "../../../public/profile/User.svg";
import { motion } from "framer-motion";
import { useGlobalContext } from "@/context/NewGlobalContext";

export default function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const { isConnected } = useGlobalContext();

    return (
        <div className=" p-5 w-full h-[32px] absolute z-1 top-0 left-0">
            <div className="flex flex-row items-center justify-end z-10">
                {isConnected && (
                    <>
                        {/* <ChangeNetworkDropdown networks={networks} /> */}

                        <button
                            onClick={() => setOpenMenu(true)}
                            className="z-10 mr-5"
                        >
                            <motion.div
                                whileHover={{ y: -5 }} // Change this value to adjust the float effect
                            >
                                <Image
                                    width={60}
                                    height={60}
                                    alt="User"
                                    src={User.src}
                                />
                            </motion.div>
                        </button>
                        {openMenu && (
                            <ProfileModal
                                open={openMenu}
                                setOpen={setOpenMenu}
                            />
                        )}
                    </>
                )}
                <LoginButton />
            </div>
        </div>
    );
}
