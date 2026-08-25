import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import useAuth from "../../components/auth/useAuth.ts";
import { api } from "../../components/api/api.ts";

import type { IGroup } from "../../interfaces/group.ts";
import type {IGroupsResponseOverview} from "../../interfaces/group/groupResponseOverview.ts";

const GroupsPage = () => {
    const { user } = useAuth();

    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!user?.usr_id) {
            return;
        }

        let isCancelled = false;

        const getGroups = async () => {
            try {
                const response = await api.get<IGroupsResponseOverview>(
                    "/group/fta_get_group.php"
                );

                if (isCancelled) {
                    return;
                }

                setGroups(response.data.groups ?? []);
                setErrorMessage("");
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                setGroups([]);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De groepen konden niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "Er is een onverwachte fout opgetreden."
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

    return (
        <main className="container py-4">
            <section className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">
                        Groepen
                    </p>

                    <h1 className="mb-0">
                        Jouw groepen
                    </h1>
                </div>

                <div className="col-auto">
                    <Link
                        to="/overview"
                        className="btn btn-outline-secondary"
                    >
                        Terug naar dashboard
                    </Link>
                </div>
            </section>

            <section className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-0">
                        Bekijk de groepen waarvan je lid of beheerder bent.
                    </p>
                </div>

                <div className="col-auto">
                    <Link
                        to="/groups/create"
                        className="btn btn-primary"
                    >
                        Nieuwe groep
                    </Link>
                </div>
            </section>

            {isLoading && (
                <div className="alert alert-light" role="status">
                    Groepen laden...
                </div>
            )}

            {!isLoading && errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            {!isLoading &&
                !errorMessage &&
                groups.length === 0 && (
                    <section className="card">
                        <div className="card-body p-4">
                            <h2 className="h4">
                                Je zit nog niet in een groep
                            </h2>

                            <p className="text-muted">
                                Maak zelf een groep aan of laat een vriend
                                je uitnodigen met jouw vriendcode.
                            </p>

                            <Link
                                to="/groups/create"
                                className="btn btn-primary"
                            >
                                Maak een groep
                            </Link>
                        </div>
                    </section>
                )}

            {!isLoading &&
                !errorMessage &&
                groups.length > 0 && (
                    <section className="row g-3">
                        {groups.map((group) => (
                            <div
                                key={group.gro_id}
                                className="col-12 col-md-6 col-xl-4"
                            >
                                <article className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <p className="text-muted small mb-1">
                                                    Groep
                                                </p>

                                                <h2 className="h5 mb-0">
                                                    {group.gro_name}
                                                </h2>
                                            </div>

                                            {group.is_creator ? (
                                                <span className="badge text-bg-primary">
                                                    Beheerder
                                                </span>
                                            ) : (
                                                <span className="badge text-bg-secondary">
                                                    Lid
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            {group.gro_creator_name && (
                                                <p className="mb-1">
                                                    <span className="text-muted">
                                                        Beheerder:
                                                    </span>{" "}
                                                    {group.gro_creator_name}
                                                </p>
                                            )}

                                            {typeof group.member_count ===
                                                "number" && (
                                                    <p className="mb-0">
                                                    <span className="text-muted">
                                                        Leden:
                                                    </span>{" "}
                                                        {group.member_count}
                                                    </p>
                                                )}
                                        </div>

                                        <p className="text-muted">
                                            De balans van deze groep wordt
                                            hier later getoond.
                                        </p>

                                        <div className="d-flex flex-wrap gap-2 mt-auto">
                                            <Link
                                                to={`/groups/${group.gro_id}`}
                                                className="btn btn-outline-primary"
                                            >
                                                Bekijk groep
                                            </Link>

                                            {group.is_creator && (
                                                <Link
                                                    to={`/groups/${group.gro_id}/edit`}
                                                    className="btn btn-outline-secondary"
                                                >
                                                    Bewerken
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </section>
                )}
        </main>
    );
};

export default GroupsPage;
