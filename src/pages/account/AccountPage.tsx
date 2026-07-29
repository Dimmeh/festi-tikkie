import useAuth from "../../components/auth/useAuth.ts";
import {Link} from "react-router-dom";
import config from "../../../custom.config.ts";

const AccountPage = () =>{
    const { user } = useAuth()

    return (
        <main className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Hello account page</h1>
                    <h1>Welkom {user?.usr_name}</h1>
                    <Link to="/account/edit">
                        <button type="button" className="btn btn-primary">
                            Bewerk je profiel
                        </button>
                    </Link>
                </div>
                <div className="col-12">
                    <img src={config.baseUrl + user?.usr_profile_photo_url} alt=""/>
                </div>
                <div className="col-12">
                    <p>Jouw code is: {user?.usr_code}</p>
                </div>
            </div>
        </main>
    );
}

export default AccountPage;
