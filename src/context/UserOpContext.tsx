import {
    createContext,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
} from "react";
import { UserOperation } from "@/lib/userOperations/types";
import React from "react";

// Define the context type
interface UserOpContextType {
    userOp: UserOperation[];
    setUserOp: Dispatch<SetStateAction<UserOperation[]>>;
}

// Create the context with default values
const UserOpContext = createContext<UserOpContextType | undefined>(undefined);

// Provide a custom hook to access the context
export const useUserOpContext = () => {
    const context = useContext(UserOpContext);
    if (!context) {
        throw new Error(
            "useUserOpContext must be used within a UserOpProvider",
        );
    }
    return context;
};

// Create a provider component
export const UserOpProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [userOp, setUserOp] = useState<UserOperation[]>([]);

    return (
        <UserOpContext.Provider value={{ userOp, setUserOp }}>
            {children}
        </UserOpContext.Provider>
    );
};
