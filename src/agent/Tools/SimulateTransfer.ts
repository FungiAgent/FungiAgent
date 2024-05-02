// import { BigNumber } from "ethers";


// type SimulateTransferParams = {
//     tokenAddress: string;
//     amount: string;
//     recipient: string;
// };

// type SimulateTransferCallbacks = {
//     onSimulationResult: (result: any) => void;
//     onLoading: (loading: boolean) => void;
//     onError: (error: Error) => void;
//     showMessage: (message: string, type: "error" | "success") => void;
//     addMessage: (message: string) => Promise<void>;
// };

// async function simulateTransfer(
//     params: SimulateTransferParams,
//     callbacks: SimulateTransferCallbacks
// ): Promise<void> {
//     const { tokenAddress, amount, recipient } = params;
//     const { onSimulationResult, onLoading, onError, showMessage, addMessage } = callbacks;

//     console.log(`Simulated transfer of ${amount} tokens from ${tokenAddress} to ${recipient}`);
//     onLoading(true);

//     try {
//         // Assuming sendTransfer and simTransfer are imported functions
//         const resultTx = await sendTransferUO(tokenAddress, BigNumber.from(amount), recipient);
//         const result = await simTransfer(resultTx);

//         if (!result || result.error) {
//             throw new Error(result.error || "Simulation failed. No result returned.");
//         }

//         onSimulationResult(result);
//         await addMessage(`Simulation result: ${JSON.stringify(result)}`);
//         showMessage("Transfer simulated successfully", "success");
//     } catch (error) {
//         console.error("Error performing simulation:", error);
//         onError(error);
//         await addMessage(`Error performing simulation: ${error.message}`);
//         showMessage(error.message, "error");
//     } finally {
//         onLoading(false);
//     }
// }
