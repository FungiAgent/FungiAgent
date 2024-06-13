import Image from "next/image";
import Logo from "../../../public/profile/Logo.svg";

export default function WelcomeMessage() {
    return (
        <div className="flex flex-col items-center mt-4">
            <Image src={Logo.src} alt="Logo" width={200} height={200} />
            <p className="mt-4 text-xxl">Hi! I'm Fungi.</p>
            <p className="mt-4 text-xxl">Your DeFi Friend</p>
        </div>
    );
}
