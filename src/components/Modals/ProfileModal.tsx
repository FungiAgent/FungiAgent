// React
import React, { Fragment, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";

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

export default function ProfileModal({ open, setOpen }) {
    const { scAccount, logout } = useWallet();
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
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
            status: false,
            onClick: handle,
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
            >
                <div className="bg-white rounded-lg px-2 py-1 shadow-input z-50">
                    <div className="flex flex-col justify-center px-[40px] py-[32px] text-center">
                        <p className=" mb-[18px] font-light text-lg">
                            Your Fungi Account
                        </p>
                        <button
                            className=" py-1 px-0.5 rounded-lg flex w-fit mx-auto items-center"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    scAccount as string,
                                );
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
                                        onClick={action.onClick}
                                        key={action.title}
                                    />
                                );
                            })}
                        </div>{" "}
                    </div>
                </div>
            </ModalContainer>
            {isSendModalOpen && (
                <SendModal
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
                />
            )}
        </div>
        // <Transition.Root show={open} as={Fragment}>

        //     {/* <Dialog as="div" className="relative z-10 " onClose={closeModal}>
        //         <Transition.Child
        //             as={Fragment}
        //             enter="ease-out duration-300"
        //             enterFrom="opacity-0"
        //             enterTo="opacity-100"
        //             leave="ease-in duration-200"
        //             leaveFrom="opacity-100"
        //             leaveTo="opacity-0"
        //         >
        //             <div className="fixed inset-0 transition-opacity" />
        //         </Transition.Child>

        //         <div className="fixed inset-0 z-10 overflow-y-auto">
        //             <div className="relative">
        //                 <Transition.Child
        //                     as={Fragment}
        //                     enter="ease-out duration-300"
        //                     enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        //                     enterTo="opacity-100 translate-y-0 sm:scale-100"
        //                     leave="ease-in duration-200"
        //                     leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        //                     leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        //                 >
        //                     <Dialog.Panel className="absolute transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-fit top-0 right-10"></Dialog.Panel>
        //                 </Transition.Child>
        //             </div>
        //         </div>
        //         {isSendModalOpen && (
        //             <SendModal
        //                 isOpen={isSendModalOpen}
        //                 onClose={() => setIsSendModalOpen(false)}
        //             />
        //         )}
        //     </Dialog> */}
        // </Transition.Root>
    );
}
