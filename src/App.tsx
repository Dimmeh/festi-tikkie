import './App.scss'
import { Navigate, Route, Routes} from 'react-router-dom';
import ProtectedRouteComponent from "./components/routes/ProtectedRouteComponent.tsx";
import PublicRouteComponent from "./components/routes/PublicRouteComponent.tsx";
import OverviewPage from "./pages/overview/Overview.tsx";
import CreateGroupPage from "./pages/group/CreateGroup.tsx";
import LoginPage from "./pages/login/Login.tsx";
import RegisterPage from "./pages/register/Register.tsx";
import EditAccountPage from "./pages/account/AccountEdit.tsx";
function App() {

  return (
    <Routes>
        <Route element={<PublicRouteComponent />}>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />}/>
        </Route>
        <Route element={<ProtectedRouteComponent />}>
            <Route path="/overview" element={<OverviewPage />}/>
            <Route path="/create-group" element={<CreateGroupPage />}/>
            <Route path="/account/edit" element={<EditAccountPage />}/>
        </Route>
        <Route path="/" element={ <Navigate to="/overview" replace /> } />
        <Route path="*" element={ <Navigate to="/overview" replace /> } />
    </Routes>
  )
}

export default App
