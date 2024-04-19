import React, { FC, useState } from 'react';
import LightSpotTable from '@/components/Tables/LightSpotTable';
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";  // Importing XIcon for the close button
import Loader from "../Loader/SpinnerLoader";
import { Categories } from "../Cards/SideModal/Categories";
import Image from 'next/image';

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
  onModalToggle: (isOpen: boolean) => void;
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
  onModalToggle,
  children,
}) => {
  const [forceReload, setForceReload] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tokens');

  if (!isOpen) return null;

  const handleReloadTable = () => {
    setForceReload(true);
    forceTableReload();
    setForceReload(false);
  };

  const categoryContent = () => {
    switch (activeCategory) {
      case 'Tokens':
        return (
          <LightSpotTable
            startIndex={startIndex}
            endIndex={endIndex}
            getLength={getLength}
            handlePageChange={handlePageChange}
            setTokenFrom={setTokenFrom}
            forceReload={true} // Simplified for demonstration
            handleReloadTable={handleReloadTable}
          />
        );
      default:
        return <div className="text-center mt-10">This feature is coming soon.</div>;
    }
  };

  const modalStyle = {
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    width: '585px',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    backgroundColor: 'white',
    zIndex: 50,
    transition: 'transform 0.9s ease-in-out',
  };

  return (
    <div style={{...modalStyle, position: 'fixed'}}>
      <div className="h-full overflow-auto p-6">
        <div className="h-[100px]">
          <button onClick={onClose} className="absolute top-5 right-5 p-2">
            {/* <img src="navbar/CloseSideBar.svg" className="mr-2" alt="Close" /> */}
            <Image src="/navbar/CloseSideBar.svg" alt="Close" width={12} height={12} />
          </button>
        </div>
        <div className="mb-6 flex justify-center items-center h-[79px] pb-[16px]">
          <div className="flex flex-col pr-[32px]">
            <p className="text-lg">My Balance:</p>
            <p className="text-lg font-semibold">{balance}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg">My Cash:</p>

            <p className="text-lg font-semibold">{cash}</p>
          </div>
        </div>

        <Categories setActiveCategory={setActiveCategory} />
        {tokens.length > 0 ? categoryContent() : <Loader />}
      </div>
    </div>
  );
  
};

export default SideModal;
