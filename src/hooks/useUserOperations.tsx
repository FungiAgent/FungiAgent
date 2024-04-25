// import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
// import { getExplorerUrl } from "@/utils/gmx/config/chains";
import { UserOperation } from "@/lib/userOperations/types";
import useWallet from "@/hooks/useWallet";
import { sendUserOperations as sendUserOperationAlchemy } from "@/lib/userOperations/sendUserOperations";
import { useGlobalContext } from "@/context/FungiContextProvider";
import { useNotification } from "@/context/NotificationContextProvider";

export function useUserOperations() {
  const { chainId } = useWallet();
  const { alchemyScaProvider } = useGlobalContext();
  const { showNotification } = useNotification();
  const sendUserOperations = async (
    userOperations: UserOperation[],
    successMessage?: string
  ) => {
    try {
      if (!alchemyScaProvider) {
        return;
      }

      const txHash = await sendUserOperationAlchemy(
        alchemyScaProvider,
        userOperations
      );
      // const txUrl = getExplorerUrl(chainId!) + "tx/" + txHash;
      // const sentMsg = `Transaction sent.`;
      showNotification({
        message: (
          <div>
            {/* {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink> */}
            <br />
            {successMessage && <br />}
            {successMessage}
          </div>
        ),
        type: "success",
      });
      return txHash;
    } catch (e) {
      console.error(e);
      showNotification({
        message: "Error submitting order",
        type: "error",
      });
    }
  };

  return { sendUserOperations };
}
