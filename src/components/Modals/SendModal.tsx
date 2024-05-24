import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { BigNumber } from "alchemy-sdk";
import { useNotification } from "@/context/NotificationContextProvider";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useSimUO } from "@/hooks/useSimUO";
import TokenDropdown from "@/components/Dropdown/TokenDropdown";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose }) => {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const { showNotification } = useNotification();
  const [status, sendTransfer] = useERC20Transfer(tokenAddress, BigNumber.from(amount || '0'), recipient);
  const { sendUserOperations } = useUserOperations();
  const { simStatus, simTransfer } = useSimUO();
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const [isSimulateEnabled, setIsSimulateEnabled] = useState<boolean>(false);

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  useEffect(() => {
    if (tokenAddress && amount && isValidAddress(recipient)) {
      setIsSimulateEnabled(true);
      handleSim();  // Automatically trigger simulation
    } else {
      setIsSimulateEnabled(false);
    }
  }, [tokenAddress, amount, recipient]);

  const handleSend = async () => {
    if (!tokenAddress || !amount || !recipient || !isValidAddress(recipient) || typeof sendTransfer !== "function") {
      showNotification({
        message: "Error sending tokens",
        type: "error",
      });
      return Promise.resolve();
    }
    const resultTx: any = await sendTransfer();
    await sendUserOperations(resultTx);
  };

  const handleSim = async () => {
    if (!tokenAddress || !amount || !recipient || !isValidAddress(recipient) || typeof sendTransfer !== "function") {
      showNotification({
        message: "Error sending tokens",
        type: "error",
      });
      return Promise.resolve();
    }
    try {
      const resultTx: any = await sendTransfer();
      const result: any = await simTransfer(resultTx);
      if (!result || result.error) {
        throw new Error(result?.error || "Simulation failed. No result returned.");
      }
      setSimulationResult(result);
    } catch (error: any) {
      showNotification({
        message: error.message,
        type: "error",
      });
      setSimulationResult(null); // Clear previous simulation results
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur-sm bg-opacity-30 bg-black fixed inset-0"></div>
        <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-auto transition-all">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            X
          </button>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Send Tokens</h2>
            <TokenDropdown onSelect={setTokenAddress} />
            { !tokenAddress && <p className="text-red-500 text-sm mb-2">Please select a token.</p> }
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-2 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            { !amount && <p className="text-red-500 text-sm mb-2">Please enter an amount.</p> }
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`mb-2 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
                isValidAddress(recipient) ? 'focus:ring-blue-500' : 'focus:ring-red-500'
              }`}
            />
            { !recipient && <p className="text-red-500 text-sm mb-2">Please enter a recipient address.</p> }
            { recipient && !isValidAddress(recipient) && <p className="text-red-500 text-sm mb-2">Invalid Ethereum address.</p> }
            <div className="flex justify-between">
              <button
                onClick={handleSend}
                disabled={!isSimulateEnabled}
                className={`py-2 px-4 rounded transition duration-300 ${
                  isSimulateEnabled ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
            {simulationResult ? (
              <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                <h3 className="text-lg font-medium text-gray-700">Transaction Summary</h3>
                <p className="text-gray-700">Estimated Network Fee: {simulationResult.changes[0].amount} {simulationResult.changes[0].symbol}</p>
                {simulationResult.changes.slice(2).map((change, index) => (
                  <div key={index} className="mt-2 text-gray-700">
                    <p>You will send: {change.amount} {change.symbol}</p>
                    <p>To: {change.to}</p>
                  </div>
                ))}
              </div>
            ) : simStatus.loading ? (
              <p className="mt-4 text-blue-500">Loading...</p>
            ) : simStatus.error ? (
              <p className="mt-4 text-red-500">{simStatus.error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SendModal;
