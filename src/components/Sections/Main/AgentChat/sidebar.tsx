import React, { useState } from 'react';
import SideModal from "@/components/Modals/SideModal";
import Image from 'next/image';

const Secondary = ({
  totalBalance,
  totalCash,
  tokens,
  formatCurrency,
  startIndex,
  endIndex,
  getLength,
  handlePageChange,
  setTokenFrom,
  forceTableReload,
  currentPage,
  ITEMS_PER_PAGE,
  length,
  onModalToggle,
}) => {
  const [localIsModalOpen, setLocalIsModalOpen] = useState(false);

  const toggleModal = () => {
    setLocalIsModalOpen(!localIsModalOpen);
    onModalToggle(!localIsModalOpen);
  };

  return (
    <div className="w-[209px]">
      <div className="flex justify-between mb-4 w-[209px]">
        <div className="flex justify-between items-center text-lg font-semibold mb-4 pl-20">
          <SideModal
            isOpen={localIsModalOpen}
            onClose={toggleModal}
            balance={formatCurrency(totalBalance)}
            cash={formatCurrency(totalCash)}
            tokens={tokens}
            formatCurrency={formatCurrency}
            startIndex={startIndex}
            endIndex={endIndex}
            getLength={getLength}
            handlePageChange={handlePageChange}
            forceTableReload={forceTableReload}
            currentPage={currentPage}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            length={length}
            setTokenFrom={setTokenFrom}
            onModalToggle={() => {}}
          >
            <h2 className="text-2xl font-bold mb-4">Modal Content</h2>
            <p className="text-gray-600">This is the content of the modal</p>
          </SideModal>
          <p>
            My Balance: <br />
            {formatCurrency(totalBalance)} <br />
            <br />
            My Cash: <br />
            {formatCurrency(totalCash)} <br />
            <br />
            <br />
            <a
              href="/portfolio"
              className="flex items-center mr-8"
              onClick={(e) => {
                e.preventDefault();
                toggleModal();
              }}
            >
              <Image className={"pr-1"} src={"/navbar/portfolio.svg"} alt={"portfolio"} width={20} height={20}/>
              Portfolio
            </a>
            <br />
            <a href="/history" className="flex items-center">
              <Image className={"pr-1"} src={"/navbar/history.svg"} alt={"history"} width={20} height={20} />
              History
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Secondary;