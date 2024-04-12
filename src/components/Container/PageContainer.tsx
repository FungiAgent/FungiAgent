import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import Logo from "../../../public/profile/Logo.svg";
import  AgentChat  from "@/components/Sections/Main/AgentChat";
import { Agent } from "http";

type PageContainerProps = {
  main: ReactElement;
  secondary: ReactElement;
  page: string;
  keepWorkingMessage?: string | ReactNode;
};

export default function PageContainer({
  main,
  secondary,
  page,
  keepWorkingMessage,
}: PageContainerProps) {
  const { scAccount } = useWallet();
  const [isSecondaryVisible, setIsSecondaryVisible] = useState(false); // Initially collapsed

  const toggleSecondaryVisibility = () => {
    setIsSecondaryVisible((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is less than a certain value
      const screenWidth = window.innerWidth;
      const breakpointWidth = 768; // Adjust this value as needed
      setIsSecondaryVisible(screenWidth >= breakpointWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize once to set initial visibility
    handleResize();

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {scAccount === undefined || keepWorkingMessage ? (
        <main className="grid grid-cols-3 mt-[20px] w-full h-[740px] rounded-lg overflow-hidden">
          <div className="col-span-3 flex items-center justify-center flex-col">
            <h1 className="text-4xl">
              {keepWorkingMessage
                ? typeof keepWorkingMessage === "string"
                  ? `${keepWorkingMessage}`
                  : keepWorkingMessage
                : `Log in or sign up to access the ${page}!`}
            </h1>
            <Image
              width={210}
              height={218}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
          </div>
        </main>
      ) : (
        <main className={`grid grid-cols-${isSecondaryVisible ? '3' : '2'} mt-[20px] w-full rounded-lg overflow-hidden relative`}>
          <div className={`border-l-1 ${isSecondaryVisible ? '' : 'hidden'}`}>
            {secondary}
          </div>
          <div className={`col-span-${isSecondaryVisible ? '2' : '3'}`}>{main}</div>
          <button className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md shadow-md" onClick={toggleSecondaryVisibility}>
              {isSecondaryVisible ? 'Hide Portfolio' : 'Show Portfolio'}
          </button>
        </main>
      )}
    </>
  );
}
