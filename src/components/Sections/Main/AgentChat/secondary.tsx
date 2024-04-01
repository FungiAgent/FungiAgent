import React, { useState, useEffect } from 'react';
import LightSpotTable from '@/components/Tables/LightSpotTable';
import Loader from "../../../Loader/SpinnerLoader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";


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
  handleReloadTable,
  forceTableReload,
  currentPage,
  ITEMS_PER_PAGE,
  length,
}) => {
  const handleClickPrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleClickNext = () => {
    handlePageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    for (let i = 1; i <= Math.ceil(length / ITEMS_PER_PAGE); i++) {
      if (
        i === 1 ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1 ||
        i === Math.ceil(length / ITEMS_PER_PAGE)
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((pageNumber, index) =>
      pageNumber.toString() !== "..." ? (
        <button
          key={index}
          className={
            pageNumber === currentPage
              ? "bg-main px-2 rounded-lg text-white"
              : "mx-2.5"
          }
          onClick={() => handlePageChange(Number(pageNumber))}
        >
          {pageNumber}
        </button>
      ) : (
        <span className="mx-1" key={index}>
          {pageNumber}
        </span>
      )
    );
  };

  return (
    <>
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
                Account Details
                <button onClick={handleReloadTable}>
                    <img src="/Reload.svg" alt="Reload Icon" className="w-4 h-4 mr-2" />
                </button>
            </div>
      <div className="flex justify-between mb-4">
        
        <div className="text-2xl font-bold">
          <p>Total Balance: {formatCurrency(totalBalance)}</p>
          {/* <p>{formatCurrency(totalBalance)}</p> */}
          <p>Cash: {formatCurrency(totalCash)}</p>
        </div>
      </div>

      {tokens.length > 0 ? (
        <div className="flex flex-col items-center mt-4 relative h-full">
          <LightSpotTable
            startIndex={startIndex}
            endIndex={endIndex}
            getLength={getLength}
            handlePageChange={handlePageChange}
            setTokenFrom={setTokenFrom}
            forceReload={forceTableReload}
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
      )}
    </>
  );
};

export default Secondary;
