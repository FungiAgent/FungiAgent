import Image from "next/image";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import ProfileModal from "../Modals/ProfileModal";
import { useState } from "react";
import LoginButton from "../Buttons/LoginButton";
import User from "../../../public/profile/User.svg";
import { networks } from "../../../constants/Constants";

export default function RightColumn({ isConnected, isExpanded }) {
    const [openMenu, setOpenMenu] = useState(false);

    const getOpenModal = (status: boolean) => {
        setOpenMenu(status);
    };
    if (!isExpanded) {
        return (
            <div
                className="flex flex-col justify-start items-center"
                style={{ width: isExpanded ? "0%" : "20%" }}
            >
                {isConnected ? (
                    <div className="flex flex-row items-center pt-10">
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
                    <div className="pt-10">
                        <LoginButton />
                    </div>
                )}
            </div>
        );
    }
}
