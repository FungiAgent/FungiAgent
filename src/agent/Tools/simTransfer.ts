import { UserOperation } from "@/lib/userOperations/types";

export async function SimTransfer(
    userOperations: UserOperation[],
    alchemyScaProvider: any, // Accept context or provider directly
    onStatusChange: (status: { loading: boolean, error: string | null, success: string | null, result: any }) => void,
    onResult: (result: any) => void
): Promise<any> {
    onStatusChange({ loading: true, error: null, success: null, result: null });

    if (userOperations.length === 0) {
        onStatusChange({ loading: false, error: "No user operations provided", success: null, result: null });
        return null;
    }

    try {
        const result = await alchemyScaProvider.simulateUserOperation({
            account: alchemyScaProvider.account!,
            uo: userOperations.length > 1 ? userOperations : userOperations[0],
        });
        onResult(result);

        onStatusChange({ loading: false, error: null, success: "Transfer simulated successfully", result });
        return result;
    } catch (error) {
        console.error(error);
        onStatusChange({ loading: false, error: "Simulation failed", success: null, result: null });
        return null;
    }
}