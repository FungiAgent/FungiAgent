import { useState } from "react";
import ModalContainer from "./ModalContainer";
import User from "../../../public/profile/User.svg";
import Image from "next/image";

export default function AddFriendModal({ isOpen, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    return (
        <ModalContainer
            showModal={isOpen}
            setShowModal={onClose}
            title="Add Friend"
        >
            <div className="min-w-[400px]">
                <div className="pr-2 flex justify-center py-10">
                    <Image width={100} height={100} alt="User" src={User.src} />
                </div>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className={`py-2 px-3 w-full rounded-chat bg-chat shadow-input pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                    />
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (optional)"
                        className={`py-2 px-3 w-full rounded-chat bg-chat shadow-input pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                    />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address (required)"
                        className={`py-2 px-3 w-full rounded-chat bg-chat shadow-input pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                    />
                    <button
                        onClick={() => {}}
                        disabled={name.length === 0 || address.length === 0}
                        className={`bg-main text-white w-full py-2 px-4 rounded transition duration-300`}
                    >
                        Add
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
