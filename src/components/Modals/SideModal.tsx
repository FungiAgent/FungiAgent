import React, { FC, useState } from 'react';
import LightSpotTable from '@/components/Tables/LightSpotTable';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";  // Importing XIcon for the close button
import Loader from "../Loader/SpinnerLoader";

type SideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  cash: string;
  tokens: any[];
  formatCurrency: (value: number) => string;
  startIndex: number;
  endIndex: number;
  getLength: () => number;
  handlePageChange: (page: number) => void;
  forceTableReload: () => void;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  length: number;
  setTokenFrom: (token: any) => void;
  children: React.ReactNode;
};

const SideModal: FC<SideModalProps> = ({
  isOpen,
  onClose,
  balance,
  cash,
  tokens,
  formatCurrency,
  startIndex,
  endIndex,
  getLength,
  handlePageChange,
  forceTableReload,
  currentPage,
  ITEMS_PER_PAGE,
  length,
  setTokenFrom,
  children,
}) => {
  const [forceReload, setForceReload] = useState(false);
  
  if (!isOpen) return null;

  const handleClickPrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleClickNext = () => {
    handlePageChange(currentPage + 1);
  };

  const handleReloadTable = () => {
    setForceReload(true);
    forceTableReload();
    setForceReload(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-[25%] h-full bg-white z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-auto p-6">
        <button onClick={onClose} className="absolute top-5 right-5 p-2">
          {/* <XIcon className="w-6 h-6 text-black" aria-hidden="true" /> */}
          X
        </button>
        <div className="mb-6">
          <p className="text-lg font-semibold">My Balance: {balance}</p>
          <p className="text-lg font-semibold">My Cash: {cash}</p>
        </div>
        {tokens.length > 0 ? (
          <div className="flex flex-col items-center mt-4 relative h-full">
            <LightSpotTable
              startIndex={startIndex}
              endIndex={endIndex}
              getLength={getLength}
              handlePageChange={handlePageChange}
              setTokenFrom={setTokenFrom}
              forceReload={forceReload}
              handleReloadTable={handleReloadTable}
            />
            <div className="flex justify-center items-center absolute inset-x-0 2xl:bottom-6 bottom-10 mx-10">
              {length !== 0 && (
                <span className="absolute inset-x-0 bottom-2">
                  Showing {startIndex + 1}-{endIndex} out of {length}
                </span>
              )}
              <div className="absolute bottom-2">
                {currentPage !== 1 && (
                  <button
                    onClick={handleClickPrevious}
                    className="absolute top-0 -left-6"
                  >
                    <ChevronLeftIcon
                      className=" w-[24px] h-[24px] text-black"
                      aria-hidden="true"
                    />
                  </button>
                )}
                {currentPage < length / ITEMS_PER_PAGE && (
                  <button
                    onClick={handleClickNext}
                    className="absolute top-0 -right-6"
                  >
                    <ChevronRightIcon
                      className=" w-[24px] h-[24px] text-black"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Loader />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SideModal;
