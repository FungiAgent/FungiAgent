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

    const getOpenModal = (status: boolean) => {
        setOpenMenu(status);
    };
    return (
        <div className="h-[32px] p-5 w-full">
            {isConnected ? (
                <div className="flex flex-row items-center justify-end">
                    <ChangeNetworkDropdown networks={networks} />
                    <button onClick={() => setOpenMenu(true)} className="z-10">
                        <Image
                            width={48}
                            height={48}
                            alt="User"
                            src={User.src}
                        />
                    </button>
                    {openMenu && <ProfileModal getOpenModal={getOpenModal} />}
                </div>
            ) : (
                <div className="flex items-center justify-end">
                    <LoginButton />
                </div>
            )}
        </div>
    );
}
