import useAuth from "../../components/auth/useAuth.ts";
import { Link } from "react-router-dom";
import config from "../../../custom.config.ts";
import { api } from "../../components/api/api.ts";
import { useEffect, useState } from "react";
import type { IGroup } from "../../interfaces/group.ts";

const OverviewPage = () => {
    const { user, logout } = useAuth();

    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!user?.usr_id) {
            console.log("user does not exist");
            return;
        }

        const getGroups = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const response = await api.get<{ groups: IGroup[] }>(
                    "/fta_get_group.php",
                    {
                        params: {
                            creator_id: user.usr_id,
                        },
                    }
                );
                console.log(response.data.groups);
                setGroups(response.data.groups);
            } catch (error) {
                console.error(error);
                setErrorMessage("De groepen konden niet worden opgehaald.");
            } finally {
                setIsLoading(false);
            }
        };

        void getGroups();
    }, [user?.usr_id]);

    const groupItems = groups?.map(group =>
        <div key={group.gro_id} className="col-12 mb-3">
            <div className="card">
                <div className="card-body">
                    <h2 className="h5">{group.gro_name}</h2>
                    <Link to={`/groups/${group.gro_id}/edit`}>
                        <button type="button" className="btn btn-primary">
                            Bewerk groep
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <main className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Welkom {user?.usr_name}</h1>

                    <Link to="/account/edit">
                        <button type="button" className="btn btn-primary">
                            Bewerk je profiel
                        </button>
                    </Link>
                </div>

                <div className="col-12">
                    {user?.usr_profile_photo_url && (
                        <img
                            src={
                                config.baseUrl +
                                user.usr_profile_photo_url
                            }
                            alt={`Profielfoto van ${user.usr_name}`}
                        />
                    )}
                </div>

                <div className="col-12">
                    <p>Jouw code is: {user?.usr_code}</p>
                </div>

                <div className="col-12">
                    <h2>Jouw groepen:</h2>
                </div>

                {isLoading && (
                    <div className="col-12">
                        <p>Groepen laden...</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="col-12">
                        <p className="text-danger">{errorMessage}</p>
                    </div>
                )}

                {!isLoading &&
                    !errorMessage &&
                    (groups?.length === 0 || !groups) && (
                        <div className="col-12">
                            <p>Je hebt nog geen groepen aangemaakt.</p>
                        </div>
                    )}

                {!isLoading && groupItems}

                <div className="col-12 mb-3">
                    <Link to="/create-group">
                        <button
                            type="button"
                            className="btn btn-primary"
                        >
                            Maak een groep
                        </button>
                    </Link>
                </div>

                <div className="col-12">
                    <button type="button" onClick={logout}>
                        Uitloggen
                    </button>
                </div>
            </div>
        </main>
    );
};

export default OverviewPage;
