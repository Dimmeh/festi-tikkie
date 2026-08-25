import "./App.scss";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRouteComponent from "./components/routes/ProtectedRouteComponent.tsx";
import PublicRouteComponent from "./components/routes/PublicRouteComponent.tsx";

import LoginPage from "./pages/login/Login.tsx";
import RegisterPage from "./pages/register/Register.tsx";

import OverviewPage from "./pages/overview/Overview.tsx";

import GroupsPage from "./pages/group/GroupPage.tsx";
import GroupDetailPage from "./pages/group/GroupDetailPage.tsx";
import CreateGroupPage from "./pages/group/CreateGroup.tsx";
import EditGroupPage from "./pages/group/EditGroupPage.tsx";

import AccountPage from "./pages/account/AccountPage.tsx";
import EditAccountPage from "./pages/account/AccountEdit.tsx";
import RoundInvitationsPage from "./pages/round/RoundInvitationsPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";

const App = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<PublicRouteComponent />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRouteComponent />}>
                {/* Dashboard */}
                <Route path="/overview" element={<OverviewPage />} />

                {/* Groups */}
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/groups/create" element={<CreateGroupPage />} />
                <Route path="/groups/:groupId" element={<GroupDetailPage />} />
                <Route path="/groups/:groupId/edit" element={<EditGroupPage />} />

                {/* Account */}
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/edit" element={<EditAccountPage />} />

                {/* Rounds */}
                <Route path="/round-invitations" element={<RoundInvitationsPage />} />

                {/* Products */}
                <Route path="/groups/:groupId/rounds/:inviteRoundId/products" element={<ProductPage />}/>
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
    );
};

export default App;
