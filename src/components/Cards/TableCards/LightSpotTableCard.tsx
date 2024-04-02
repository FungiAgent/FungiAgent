import React from "react";
import Image from "next/image";
import {
  formatNumber,
  formatAmount,
  formatAmountToUsd,
} from "@/utils/formatNumber";
import { networks } from "../../../../constants/Constants";
import { TokenData } from "@/domain/tokens/types";

type AssetsTableCardProps = {
  asset: TokenData;
  index: number;
  setTokenFrom: (TokenInfo) => void;
};

export default function AssetsTableCard({
  asset,
  setTokenFrom,
}: AssetsTableCardProps) {
  return (
    <div className="border-b-1 border-gray-300 grid grid-cols-6 py-[22px] items-center fadeInAnimation border-l-4 hover:border-l-main border-l-white cursor-pointer">
      <div className="col-span-2 flex items-center justify-start pl-[2vw]">
        <img
          width={40}
          height={40}
          alt="Token Logo"
          src={asset.token.logoURI}
          className="ml-[10px] rounded-full"
        />
        <div className="ml-[10px] text-lg">
          {asset.token.symbol}
        </div>
      </div>
      <div className="text-center">
        ${asset?.token?.priceUSD !== undefined &&
          Number(asset?.token?.priceUSD).toFixed(2)}
      </div>
      <div className="text-center">
        {asset?.token.balance !== undefined && (
          <div>
            {formatAmount(
              asset?.token?.balance.toString() || "0",
              asset?.token?.decimals
            ).slice(0, 9)}
          </div>
        )}
        {asset?.token.balance !== undefined && (
          <div>
            (${formatAmountToUsd(
              asset?.token?.balance.toString() || "0",
              asset?.token?.decimals,
              Number(asset?.token?.priceUSD)
            )})
          </div>
        )}
      </div>
    </div>
  );
}
