export default function RightColumn({ isExpanded }) {
    if (!isExpanded) {
        return (
            <div
                className="flex flex-col justify-start items-center"
                style={{
                    width: isExpanded ? "0%" : "25%",
                }}
            ></div>
        );
    }
}
