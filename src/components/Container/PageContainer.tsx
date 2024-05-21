import React, { ReactElement, ReactNode } from "react";
import Image from "next/image";
import useWallet from "@/hooks/useWallet";
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

  return (
    <>
      {scAccount === undefined || keepWorkingMessage ? (
        <main className="grid grid-cols-3 mt-[20px] w-full h-[calc(100vh - 20px)] rounded-lg overflow-hidden">
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
        <main className="mt-[20px] w-full h-[calc(100vh - 20px)] rounded-lg overflow-hidden relative flex flex-col lg:flex-row">
          <div
            className={`border-l-1 w-full lg:w-[209px] lg:mr-[30px] ${
              isModalOpen ? "absolute left-0 top-0 bottom-0 h-full" : ""
            } hidden lg:block`}
            style={{ overflowY: 'auto' }}
          >
            {secondary}
          </div>
          <div
            className={`flex-1 ${
              isModalOpen ? "ml-[585px]" : ""
            } ${
              isModalOpen ? "w-[calc(100%-585px)]" : ""
            } flex justify-center`}
            style={{ overflowY: 'auto' }}
          >
            <div className="w-full max-w-[731px] p-4">
              {main}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
