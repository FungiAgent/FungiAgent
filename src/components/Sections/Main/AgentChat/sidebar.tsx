import React, { useState, useEffect } from 'react';
import SideModal from "@/components/Modals/SideModal";

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
}) => {
  const [tableReloadKey, setTableReloadKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const handleClickPrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleClickNext = () => {
    handlePageChange(currentPage + 1);
  };

  const handleReloadTable = () => {
    setTableReloadKey((prevKey) => prevKey + 1);
  };

  const renderPageNumbers = () => {
    // Existing page number rendering logic
  };

  return (
    <div className="w-[209px]">
      <div className="flex justify-between mb-4 w-[209px]">
        <div className="flex justify-between items-center text-lg font-semibold mb-4 pl-20">
        <SideModal
            isOpen={isModalOpen}
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
              <img
                src="navbar/portfolio.svg"
                className="mr-2"
                width="20"
                height="20"
              />
              Portfolio
            </a>
            <br />
            <a href="/history" className="flex items-center">
              <img
                src="navbar/history.svg"
                className="mr-2"
                width="20"
                height="20"
              />
              History
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Secondary;

      {/* {tokens.length > 0 ? (
        <div className="flex flex-col items-center mt-4 relative h-full">
          <LightSpotTable
            startIndex={startIndex}
            endIndex={endIndex}
            getLength={getLength}
            handlePageChange={handlePageChange}
            setTokenFrom={setTokenFrom}
            forceReload={forceTableReload}
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
              {renderPageNumbers()}
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
          {" "}
          <Loader />
        </div>
      )} */}