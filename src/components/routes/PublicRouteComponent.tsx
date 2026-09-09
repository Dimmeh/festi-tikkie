import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth.ts";

const PublicRouteComponent = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return;
    }

    if (user) {
        return <Navigate to="/overview" replace />;
    }
    return <Outlet />;
};

export default PublicRouteComponent;
