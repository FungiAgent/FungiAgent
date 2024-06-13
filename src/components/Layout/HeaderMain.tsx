import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/profile/Logo.svg";
import User from "../../../public/profile/User.svg";

import AgentChat from "../Sections/Main/AgentChat";
import useWallet from "@/hooks/useWallet";
import ProfileModal from "../Modals/ProfileModal";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
import { networks } from "../../../constants/Constants";

export default function HeaderMain() {
    const { isConnected } = useWallet();
    const [openMenu, setOpenMenu] = useState(false);

    const getOpenModal = (status: boolean) => {
        setOpenMenu(status);
    };

    return (
        <div className="overflow-auto">
            <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[20px] mb-16">
                <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-5 ml-4 mr-4 lg:ml-[75px] lg:mr-[25px] items-center justify-between">
                    <div className="flex items-center">
                        <Image
                            width={62}
                            height={68}
                            alt="Logo"
                            src={Logo.src}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="relative flex items-center">
                        {isConnected ? (
                            <div className="flex flex-row items-center">
                                <ChangeNetworkDropdown networks={networks} />
                                <button onClick={() => setOpenMenu(true)}>
                                    <Image
                                        width={48}
                                        height={48}
                                        alt="User"
                                        src={User.src}
                                    />
                                </button>
                                {openMenu && (
                                    <ProfileModal getOpenModal={getOpenModal} />
                                )}
                            </div>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>
            </div>

            <main>
                {isConnected ? (
                    <AgentChat />
                ) : (
                    <div className="flex flex-col items-center mt-4">
                        <Image
                            src={Logo.src}
                            alt="Logo"
                            width={200}
                            height={200}
                        />
                        <p className="mt-4 text-xxl">
                            Hi, I'm Fungi, your DeFi Friend
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
