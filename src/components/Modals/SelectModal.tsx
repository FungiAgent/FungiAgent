import React, { useState } from "react";
import ModalContainer from "./ModalContainer";

type item = {
    id: string;
    label: string;
    value: string;
};

type PropsType = {
    title?: string;
    items: item[];
    onSelect: any;
    showModal: boolean;
    setShowModal: any;
    defaultVal: item;
};

export default function SelectModal({
    title,
    items,
    onSelect,
    showModal,
    setShowModal,
    defaultVal,
}: PropsType) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = items.filter((item) => {
        const regex = new RegExp(searchQuery, "i");
        return (
            regex.test(item.id) ||
            regex.test(item.label) ||
            regex.test(item.value)
        );
    });
    return (
        <ModalContainer
            setShowModal={setShowModal}
            showModal={showModal}
            title={title}
        >
            <div className="min-w-[400px] w-full">
                <p className="text-xl text-main text-light py-4">
                    {defaultVal.label}
                </p>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className={`py-2 px-3 w-full rounded-chat bg-chat shadow-input pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                />
                <div className="flex flex-col gap-5 max-h-[50vh] overflow-scroll">
                    {filteredItems.map(
                        (item: {
                            id: string;
                            value: string;
                            label: string;
                        }) => (
                            <button
                                onClick={() => {
                                    onSelect(item);
                                    setShowModal(false);
                                }}
                                key={item.id}
                                value={item.value}
                                className="flex justify-start menu-item-hover px-2 py-4 rounded-chat"
                            >
                                {item.label}
                            </button>
                        ),
                    )}
                </div>
            </div>
        </ModalContainer>
    );
}
