import {useCallback, useEffect, useMemo, useState} from "react";
import type {IUser} from "../../interfaces/user.ts";
import {api} from "../api/api.ts";
import type {IAuthProviderProps} from "../../interfaces/auth/authProviderProps.ts";
import type {IAuthResponse} from "../../interfaces/auth/authResponse.ts";
import type {IAuthContextValue} from "../../interfaces/auth/authContextValue.ts";
import { AuthContext } from "./AuthContext.tsx";
import axios from "axios";

const AuthProvider = ({children}: IAuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refreshUser = useCallback(async () => {
        try{
            const response = await api.get<IAuthResponse>("/auth/fta_auth.php")
            setUser(response.data.user)
        }catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Status:",
                    error.response?.status
                );

                console.log(
                    "Backend response:",
                    error.response?.data
                );

                console.log(
                    "Backend message:",
                    error.response?.data?.message
                );
            }

            setUser(null);
        }
    },[])

    const login = useCallback(
        async(email: string, password: string) => {
            const formData = new FormData();

            formData.append("usr_email", email);
            formData.append("usr_password", password);
            try{
                const response = await api.post<IAuthResponse>("/auth/fta_login.php", formData);
                console.log("Login response:", response)
                setUser(response.data.user)
            }catch(error:unknown){
                if (axios.isAxiosError(error)) {
                    console.log(
                        "Status:",
                        error.response?.status
                    );

                    console.log(
                        "Backend response:",
                        error.response?.data
                    );

                    console.log(
                        "Backend message:",
                        error.response?.data?.message
                    );
                }
            }


        },
        []
    )

    const logout = useCallback(async () => {
        await api.post("/auth/fta_logout.php");

        setUser(null);
    },[])

    useEffect(() => {
        const initAuth = async () => {
            try{
                await refreshUser();
            }
            finally {
                setIsLoading(false);
            }
        }
        void initAuth();
    }, [refreshUser]);

    const contextValue = useMemo<IAuthContextValue>(
        () => ({
            user,
            isLoading,
            login,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, logout, refreshUser]
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
