// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import LogoutButton from "../Buttons/LogoutButton";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
import Assets from "../Sections/Assets";
import Portfolio from "../Sections/Portfolio";
import Home from "../Sections/Home";
// Wagmi
import { useAccount, useNetwork } from "wagmi";
// Constants
import { networks, navigation } from "../../../constants/Constants";
// Types
import { NetworkType, navigationType } from "@/types/Types";
// Next
import Image from "next/image";
import Link from "next/link";
// Images
import Logo from "../../../public/Logo.svg";

export default function ActionsSideBar() {
  const { isConnected } = useAccount();
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [page, setPage] = useState<ReactElement>(<Home />);
  const [previousNetwork, setPreviousNetwork] = useState<NetworkType>();
  const [actionSelected, setActionSelected] = useState<string>("Home");

  const { chain } = useNetwork();

  const getViewComponent = () => {
    switch (actionSelected) {
      case "Home":
        setPage(<Home />);
        break;
      case "Spot":
        setPage(<Portfolio />);
        break;
      case "Perps":
        setPage(<Assets />);
        break;
      default:
        setPage(<Home />);
        break;
    }
  };

  useEffect(() => {
    isConnected ? setConnectedWallet(true) : setConnectedWallet(false);
  }, [isConnected]);

  useEffect(() => {
    getViewComponent();
  }, [actionSelected]);

  useEffect(() => {
    if (
      chain &&
      (chain.id === 42161 ||
        chain.id === 80001 ||
        chain.id === 1 ||
        chain.id === 137)
    ) {
      const prev = networks.filter((network) => network.name === chain?.name);

      setPreviousNetwork(prev[0]);
    }
  }, [chain]);

  return (
    <div>
      <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-5 ml-[75px] mr-[25px]">
          <Link href="/" className="text-red-500">
            <Image
              width={62}
              height={68}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
          </Link>
          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            {connectedWallet && previousNetwork ? (
              <div className="flex items-center">
                <ChangeNetworkDropdown
                  isModal={false}
                  networks={networks}
                  previousNetwork={previousNetwork}
                />{" "}
                <LogoutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
      <div className="h-[44px] p-[4px] w-[800px] rounded-full grid grid-cols-6 bg-white items-center text-center shadow-xl text-sm mt-[24px]">
        {navigation.map((link: navigationType) => {
          return (
            <button
              key={link.href}
              onClick={() => setActionSelected(link.name)}
              className={
                link.name === actionSelected
                  ? `bg-black text-white rounded-full py-[8px] flex items-center justify-center`
                  : "bg-white flex items-center justify-center hover:bg-gray-100 hover:rounded-full hover:py-[8px]"
              }
            >
              <Image
                width={20}
                height={20}
                alt="Logo"
                src={link.image}
                aria-hidden="true"
                className="mr-3"
              />
              {link.name}
            </button>
          );
        })}
      </div>

      <main>{page}</main>
    </div>
  );
}
