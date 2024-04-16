import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import Logo from "../../../public/profile/Logo.svg";

type PageContainerProps = {
  main: ReactElement;
  secondary: ReactElement;
  page: string;
  keepWorkingMessage?: string | ReactNode;
  isModalOpen: boolean;
};

export default function PageContainer({
  main,
  secondary,
  page,
  keepWorkingMessage,
  isModalOpen,
}: PageContainerProps) {
  const { scAccount } = useWallet();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const breakpointWidth = 768;
      // No need to update the visibility state, the secondary is always visible
    };
    window.addEventListener("resize", handleResize);
    handleResize();
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
        <main className="mt-[20px] w-full rounded-lg overflow-hidden relative flex">
          <div
            className={`border-l-1 w-[209px] mr-[30px] ${
              isModalOpen ? "absolute left-0 top-0 bottom-0" : ""
            }`}
          >
            {secondary}
          </div>
          <div
            className={`flex-1 ${isModalOpen ? "ml-[585px]" : ""} ${
              isModalOpen ? "w-[calc(100%-585px)]" : ""
            }`}
          >
            {main}
          </div>
        </main>
      )}
    </>
  );
}