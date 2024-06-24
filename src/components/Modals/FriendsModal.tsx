import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import User from "../../../public/profile/User.svg";
import AddFriends from "../../../public/profile/AddFriends.svg";

import Image from "next/image";
import AddFriendModal from "./AddFriendModal";

type Friend = {
    name: string;
    address: string;
};

export default function FriendsModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");

    const [friends, setFriends] = useState<Friend[]>([
        {
            name: "John Doe",
            address: "0x...",
        },
        {
            name: "Jane Doe",
            address: "0x...",
        },
    ]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = friends.filter((item: Friend) => {
        const regex = new RegExp(searchQuery, "i");
        return regex.test(item.name) || regex.test(item.address);
    });
    const onSelect = (friend: Friend) => {};
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    return (
        <ModalContainer
            showModal={isOpen}
            setShowModal={onClose}
            title="Friends"
        >
            <div className="w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className={`py-2 px-3 w-full rounded-chat bg-chat shadow-input pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                />
                <div className="flex flex-col gap-5 max-h-[50vh] overflow-scroll mt-[32px]">
                    {filteredItems.map((item: Friend) => (
                        <button
                            onClick={() => {
                                onSelect(item);
                                // onClose();
                            }}
                            key={item.name}
                            className="flex justify-start items-center menu-item-hover px-2 py-4 rounded-chat"
                        >
                            <div className="pr-2">
                                <Image
                                    width={40}
                                    height={40}
                                    alt="User"
                                    src={User.src}
                                />
                            </div>
                            <p></p>
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="w-full flex justify-end mt-[-10px]">
                    <button onClick={() => setIsAddFriendOpen(true)}>
                        <Image
                            width={40}
                            height={40}
                            alt="AddFriends"
                            src={AddFriends.src}
                        />
                    </button>
                </div>
            </div>
            <AddFriendModal
                isOpen={isAddFriendOpen}
                onClose={() => {
                    setIsAddFriendOpen(false);
                }}
            />
        </ModalContainer>
    );
}
