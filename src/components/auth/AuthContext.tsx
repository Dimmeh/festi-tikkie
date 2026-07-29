import { createContext } from "react";
import type { IAuthContextValue } from "../../interfaces/auth/authContextValue.ts";

export const AuthContext = createContext<IAuthContextValue | undefined>(
    undefined
);
