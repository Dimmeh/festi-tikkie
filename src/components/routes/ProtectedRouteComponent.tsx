import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth.ts";

const ProtectedRouteComponent = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return;
    }

    if (!user) {
        console.log("no user", user);
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRouteComponent;
