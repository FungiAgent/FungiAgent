// React
import React, { useState } from "react";

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import ProfileSelectionButton from "../Buttons/ProfileSelectionButton";
import { useRouter } from "next/router";

import Send from "../../../public/profile/Send.svg";
import Settings from "../../../public/profile/Settings.svg";
import Withdraw from "../../../public/profile/Withdraw.svg";
import Deposit from "../../../public/profile/Deposit.svg";
import LogOut from "../../../public/profile/LogOut.svg";
import AddFriends from "../../../public/profile/AddFriends.svg";
import useWallet from "@/hooks/useWallet";
import { useNotification } from "@/context/NotificationContextProvider";
import SendModal from "../Modals/SendModal";
import ModalContainer from "./ModalContainer";
import DepositModal from "./DepositModal";

export default function ProfileModal({ open, setOpen }) {
    const { scAccount, logout } = useWallet();
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const router = useRouter();
    const { showNotification } = useNotification();

    const logingOut = async () => {
        logout();
        setOpen(false);
        router.push("/");
    };

    const openSendModal = async () => {
        setIsSendModalOpen(true);
        // setOpen(false);
    };

    const handle = async () => {
        console.log("//TODO Fungi");
    };

    const profileActions = [
        {
            title: "Send",
            image: Send.src,
            status: true,
            onClick: openSendModal,
        },

        {
            title: "Add Friends",
            image: AddFriends.src,
            status: false,
            onClick: handle,
        },
        {
            title: "Deposit",
            image: Deposit.src,
            status: true,
            onClick: () => setIsDepositModalOpen(true),
        },
        {
            title: "Settings",
            image: Settings.src,
            status: false,
            onClick: handle,
        },
        {
            title: "Withdraw",
            image: Withdraw.src,
            status: false,
            onClick: handle,
        },
        {
            title: "Log Out",
            image: LogOut.src,
            status: true,
            onClick: logingOut,
        },
    ];

    return (
        <div>
            <ModalContainer
                showModal={open}
                setShowModal={setOpen}
                position={"top-right"}
                title="Your Fungi Account"
            >
                <button
                    className="py-1 px-0.5 rounded-lg flex w-fit mx-auto items-center"
                    onClick={() => {
                        navigator.clipboard.writeText(scAccount as string);
                        showNotification({
                            message: "Link copied to clipboard.",
                            type: "success",
                        });
                    }}
                >
                    <UserIcon
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                    />
                    <span className="mx-[9px]">
                        {scAccount?.substring(0, 10) + "..."}
                    </span>{" "}
                    <DocumentDuplicateIcon
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                    />
                </button>
                <div className="grid grid-cols-3 gap-x-[40px] gap-y-[30px] mt-[34px]">
                    {profileActions.map((action) => {
                        return (
                            <ProfileSelectionButton
                                title={action.title}
                                image={action.image}
                                status={action.status}
                                // @ts-expect-error todo
                                onClick={action.onClick}
                                key={action.title}
                            />
                        );
                    })}
                </div>
            </ModalContainer>
            <SendModal
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
            />
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                wallet={scAccount as string}
            />
        </div>
    );
}
