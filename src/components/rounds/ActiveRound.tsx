import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {api} from "../api/api.ts";
import type {IRoundInvitationsResponse} from "../../interfaces/round/roundInvitationsResponse.ts";
import axios from "axios";
import type {IRoundInvitation} from "../../interfaces/round/roundInvitation.ts";
import useAuth from "../auth/useAuth.ts";
import type {IGroup} from "../../interfaces/group/group.ts";
import type {IAcceptRoundInvitationResponse} from "../../interfaces/round/acceptRoundInvitationResponse.ts";

interface IActiveRoundProps {
    group: IGroup | null;
}

const ActiveRound = ({group}: IActiveRoundProps) => {
    const {user} = useAuth();
    const [rounds, setRounds] = useState<IRoundInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasActiveRound, setActiveRound] = useState(false);
    const [isGroupPage, setIsGroupPage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isStartingRound, setIsStartingRound] = useState(false);
    const [startRoundError, setStartRoundError] = useState("");
    const [invitations, setInvitations] = useState<IRoundInvitation[]>([]);

    const navigate = useNavigate();
    const setupRound = async (): Promise<void> => {
        if (isStartingRound) {
            return;
        }

        setIsStartingRound(true);
        setStartRoundError("");
        if(group){
            navigate(
                `/groups/${group.gro_id}/events/${group.evn_id}/setup-round`
            )
        }


    };

    const leaveRound = async (invitation:IRoundInvitation) =>  {

        const formData = new FormData();

        formData.append(
            "invusr_id",
            invitation.invusr_id.toString()
        );
        formData.append(
            "invusr_status",
            "declined"
        );

        try {
            const response =
                await api.post<IAcceptRoundInvitationResponse>(
                    "/round/fta_confirm_status_round_invitation.php",
                    formData
                );

            console.log(response)
            refreshRounds()
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error.response)
                setErrorMessage(
                    error.response?.data?.message ??
                    "Je kan niet uit het rondje gaan. Probeer het opnieuw."
                );
            } else {
                setErrorMessage(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    };

    const refreshRounds = async () => {
        const resp = await api.get<IRoundInvitationsResponse>(
            "/round/fta_get_round_invitations.php",
            {
                params: {
                    invusr_status: "joined"
                }
            }
        );

        setRounds(
            resp.data.data.invitations ?? []
        );

        setActiveRound(
            resp.data.data.invitation_count > 0
        );

        setErrorMessage("");
    }

    const removeRound = async () => {
        try {
            await api.delete(
                "/round/fta_delete_round.php",
                {
                    params: {
                        invrou_id: rounds[0].invrou_id.toString()
                    }
                }
            );

            await refreshRounds();

            setShowDeleteModal(false);
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ??
                    "De ronde kon niet worden verwijderd."
                );
            } else {
                setErrorMessage(
                    "Er is iets mis gegaan met het verwijderen van de ronde."
                );
            }
        }
    };

    useEffect(() => {
        let isCancelled = false;
        const getInvitations = async () => {
            if (group) {
                setIsGroupPage(true)
            }
            try {
                // invusr_status: '*' is het ophalen van joined en invited invitations.
                const resp = await api.get<IRoundInvitationsResponse>(
                    "/round/fta_get_round_invitations.php",{
                        params:{
                            invusr_status: "*"
                        }
                    });
                if (!isCancelled) {
                    const activeRound = resp.data.data.invitations.filter(
                        (invitation) => invitation.invusr_status === "joined"
                    );

                    const invitations = resp.data.data.invitations.filter(
                        (invitation) => invitation.invusr_status === "invited"
                    );

                    if (activeRound.length > 0) {
                        setActiveRound(true);
                        setRounds(activeRound);
                    }
                    if(invitations.length > 0) {
                        setInvitations(invitations);
                    }
                    setErrorMessage("");
                }
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De ronden konden niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "De ronden konden niet worden opgehaald."
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }
        void getInvitations();
        return () => {
            isCancelled = true;
        };
    }, [group, user?.usr_id]);

    return (
        <>
            {startRoundError && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {startRoundError}
                </div>
            )}
            <p className="text-muted mb-2">
                Actieve ronde
            </p>

            {isLoading && (
                <p>Uitnodigingen laden...</p>
            )}

            {!isLoading && errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            {!isLoading && (
                <>
                    {hasActiveRound ? (
                        <>
                            <h2 className="h5">
                                {rounds[0]?.group_name}
                            </h2>
                            <Link
                                to={!showDeleteModal ? `/groups/${rounds[0]?.group_id}/events/${rounds[0]?.event_id}/rounds/${rounds[0]?.invrou_id}/products` : "#"}
                                className={`btn btn-success ${showDeleteModal ? "disabled" : ""}`}
                                aria-disabled={showDeleteModal}
                                onClick={(event) => {
                                    if (!rounds[0]?.group_id) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                Bekijk ronde
                            </Link>
                            {rounds[0].invrou_creator_id === user?.usr_id ? (
                                <button
                                    type="button"
                                    className="btn btn-danger ms-3 me-2"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Ronde Verwijderen
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger ms-3 me-2"
                                    onClick={() => void leaveRound(rounds[0])}
                                >
                                    Ronde verlaten
                                </button>
                            )

                            }

                        </>
                    ) : (
                        <>
                            <h2 className="h5">
                                Geen actieve ronde
                            </h2>
                            {isGroupPage ? (
                                <p className="text-muted">
                                    Start een ronde en nodig groepsleden uit.
                                </p>
                            ) : (
                                <p>
                                    Start een ronde vanuit een groep.
                                </p>
                            )}

                            {isGroupPage && (
                                <button
                                    type="button"
                                    className="btn btn-success me-3"
                                    onClick={() => void setupRound()}
                                    disabled={isStartingRound}
                                >
                                    Start ronde
                                </button>
                            )}

                            <Link
                                to="/round-invitations"
                                className="btn btn-outline-primary position-relative"
                            >
                                Bekijk uitnodigingen
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {invitations?.length ?? 0} <span className="visually-hidden">unread messages</span>
                                </span>
                            </Link>
                        </>
                    )}
                </>
            )
            }
            {showDeleteModal && (
                <div className="delete-modal-backdrop mt-3">
                    <div className="delete-modal">
                        <div className="delete-modal-handle"></div>

                        <h2>Ronde verwijderen?</h2>

                        <p>
                            Weet je zeker dat je deze ronde wilt verwijderen?
                            Deze actie kan niet ongedaan worden gemaakt.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="btn btn-light me-3"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Annuleren
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => void removeRound()}
                            >
                                Ja, verwijderen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ActiveRound;
