import {useContext} from "react";
import {AuthContext} from "./AuthContext.tsx";

const useAuth = () => {
    const context = useContext(AuthContext);

    if(context === undefined) {
        throw new Error(
            "useAuth must be used within the AuthProvider"
        )
    }

    return context;
}

export default useAuth;
