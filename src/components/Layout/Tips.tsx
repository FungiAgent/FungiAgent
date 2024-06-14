const tips = [
    {
        msg: "Check my portfolio",
    },
    {
        msg: "Perform a swap",
    },
    {
        msg: "Send money",
    },
];

export default function Tips() {
    return (
        <div className="flex flex-col w-full  items-center">
            <p className="font-light text-center">
                <i>Some ideas</i>
            </p>
            <div className="flex flex-row gap-5 items-start mt-10">
                {tips.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="border-2 border-gray-300 px-4 py-2 rounded-xl bg-white"
                        >
                            <p className="font-light">{item.msg}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
