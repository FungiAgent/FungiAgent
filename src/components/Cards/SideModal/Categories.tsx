import React from "react";

interface CategoriesProps {
    setActiveCategory: (category: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
    setActiveCategory,
}) => {
    return (
        <div className="flex justify-between mt-4 w-full">
            <div className="grid grid-cols-5 gap-4 w-full">
                {["Tokens", "Trades", "Pools", "Credit", "NFTs"].map(
                    (category) => (
                        <div
                            key={category}
                            className={`text-center py-2 cursor-default ${
                                category === "Tokens"
                                    ? "cursor-pointer hover:font-bold"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() =>
                                category === "Tokens" &&
                                setActiveCategory(category)
                            }
                        >
                            {category}
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};

export default Categories;
