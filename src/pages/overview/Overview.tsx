import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import useAuth from "../../components/auth/useAuth.ts";
import { api } from "../../components/api/api.ts";
import type { IGroup } from "../../interfaces/group/group.ts";
import ActiveRound from "../../components/rounds/ActiveRound.tsx";

interface GroupsResponse {
    success: boolean;
    message: string;
    groups: IGroup[];
}

const OverviewPage = () => {
    const { user } = useAuth();

    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const totalBalance = 0;

    useEffect(() => {
        if (!user?.usr_id) {
            return;
        }

        let isCancelled = false;

        const getGroups = async () => {
            try {
                const response = await api.get<GroupsResponse>(
                    "/group/fta_get_group.php"
                );
                if (!isCancelled) {
                    setGroups(response.data.groups ?? []);
                    setErrorMessage("");
                }
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }


                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De groepen konden niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "De groepen konden niet worden opgehaald."
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        void getGroups();

        return () => {
            isCancelled = true;
        };
    }, [user?.usr_id]);

    const getBalanceLabel = () => {
        if (totalBalance > 0) {
            return "Je krijgt nog munten terug.";
        }

        if (totalBalance < 0) {
            return "Je moet nog munten betalen.";
        }

        return "Je balans is helemaal gelijk.";
    };

    return (
        <main className="container py-4">
            <section className="row align-items-center mb-4">
                <div className="col">
                    <p className="mb-1 text-muted">
                        Alcatraz Festival
                    </p>

                    <h1 className="mb-0">
                        Welkom {user?.usr_name}
                    </h1>
                </div>

                <div className="col-auto">
                    <Link
                        to="/account/edit"
                        className="btn btn-outline-secondary"
                    >
                        Accountinstellingen
                    </Link>
                </div>
            </section>

            <section className="row g-3 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">
                                Jouw totale balans
                            </p>

                            <p className="display-5 fw-bold mb-2">
                                {totalBalance > 0 && "+"}
                                {totalBalance} munten
                            </p>

                            <p className="mb-0">
                                {getBalanceLabel()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <ActiveRound group={null}/>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h4 mb-0">
                        Jouw groepen
                    </h2>

                    <Link to="/groups">
                        Bekijk alle groepen
                    </Link>
                </div>

                {isLoading && (
                    <p>Groepen laden...</p>
                )}

                {!isLoading && errorMessage && (
                    <div className="alert alert-danger">
                        {errorMessage}
                    </div>
                )}

                {!isLoading &&
                    !errorMessage &&
                    groups.length === 0 && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="h5">
                                    Je zit nog niet in een groep
                                </h3>

                                <p>
                                    Maak een groep aan of laat je door
                                    een vriend uitnodigen.
                                </p>

                                <Link
                                    to="/groups/create"
                                    className="btn btn-primary"
                                >
                                    Maak een groep
                                </Link>
                            </div>
                        </div>
                    )}

                {!isLoading &&
                    !errorMessage &&
                    groups.length > 0 && (
                        <div className="row g-3">
                            {groups.slice(0, 3).map((group) => (
                                <div
                                    key={group.gro_id}
                                    className="col-12 col-md-6 col-xl-4"
                                >
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between gap-3">
                                                <h3 className="h5">
                                                    {group.gro_name}
                                                </h3>

                                                {group.is_creator && (
                                                    <span className="badge text-bg-secondary">
                                                        Beheerder
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-muted">
                                                Balans wordt binnenkort
                                                toegevoegd.
                                            </p>

                                            <Link
                                                to={`/groups/${group.gro_id}`}
                                                className="btn btn-outline-primary"
                                            >
                                                Bekijk groep
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </section>

        </main>
    );
};

export default OverviewPage;
