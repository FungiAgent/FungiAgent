import { UserOperation } from "@/lib/userOperations/types";
import { sendUserOperations as sendUserOperationAlchemy } from "@/lib/userOperations/sendUserOperations";
import { useGlobalContext } from "@/context/FungiContextProvider";
import { useNotification } from "@/context/NotificationContextProvider";

export function useUserOperations() {
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
      showNotification({
        message: (
          <div>
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
