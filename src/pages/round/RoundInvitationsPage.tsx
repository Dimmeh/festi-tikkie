import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";

import { api } from "../../components/api/api.ts";
import config from "../../../custom.config.ts";

import type { IRoundInvitation } from "../../interfaces/round/roundInvitation.ts";
import type { IRoundInvitationsResponse } from "../../interfaces/round/roundInvitationsResponse.ts";
import type {IAcceptRoundInvitationResponse} from "../../interfaces/round/acceptRoundInvitationResponse.ts";

const RoundInvitationsPage = () => {
    const [invitations, setInvitations] = useState<
        IRoundInvitation[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [acceptingInvitationId, setAcceptingInvitationId] =
        useState<number | null>(null);

    const [actionError, setActionError] = useState("");

    useEffect(() => {
        let isCancelled = false;

        const getInvitations = async (): Promise<void> => {
            try {
                const response =
                    await api.get<IRoundInvitationsResponse>(
                        "/round/fta_get_round_invitations.php"
                    );
                console.log(response)
                if (isCancelled) {
                    return;
                }

                setInvitations(
                    response.data.data.invitations
                );

                setErrorMessage("");
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                setInvitations([]);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De uitnodigingen konden niet worden opgehaald."
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

        void getInvitations();

        return () => {
            isCancelled = true;
        };
    }, []);

    const acceptInvitation = async (
        invitation: IRoundInvitation
    ): Promise<void> => {
        if (acceptingInvitationId !== null) {
            return;
        }

        setAcceptingInvitationId(invitation.invusr_id);
        setActionError("");
        console.log(invitation.invusr_id)
        const formData = new FormData();

        formData.append(
            "invusr_id",
            invitation.invusr_id.toString()
        );

        try {
            const response =
                await api.post<IAcceptRoundInvitationResponse>(
                    "/round/fta_accept_round_invitation.php",
                    formData
                );

            console.log(response)

            navigate(
                `/groups/${response.data.data.group_id}` +
                `/rounds/${response.data.data.invite_round_id}` +
                `/products`
            );
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setActionError(
                    error.response?.data?.message ??
                    "De uitnodiging kon niet worden geaccepteerd."
                );
            } else {
                setActionError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        } finally {
            setAcceptingInvitationId(null);
        }
    };

    const getImageUrl = (
        imageUrl: string | null
    ): string | null => {
        if (!imageUrl) {
            return null;
        }

        return config.baseUrl + imageUrl;
    };

    const formatDateTime = (dateValue: string): string => {
        const date = new Date(
            dateValue.replace(" ", "T")
        );

        return date.toLocaleString("nl-NL", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <main className="container py-4">
                <div className="d-flex align-items-center gap-2">
                    <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                    />

                    <p className="mb-0">
                        Uitnodigingen laden...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="container py-4">
            <section className="mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => navigate(-1)}
                        aria-label="Terug naar de vorige pagina"
                    >
                        ←
                    </button>

                    <div>
                        <p className="text-muted mb-1">
                            Rondes
                        </p>

                        <h1 className="mb-0">
                            Uitnodigingen
                        </h1>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}

            {actionError && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {actionError}
                </div>
            )}

            {!errorMessage && invitations.length === 0 && (
                <section className="card">
                    <div className="card-body p-4 text-center">
                        <h2 className="h5">
                            Geen openstaande uitnodigingen
                        </h2>

                        <p className="text-muted mb-3">
                            Zodra iemand je uitnodigt voor een
                            ronde verschijnt die hier.
                        </p>

                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(-1)}
                        aria-label="Terug naar de vorige pagina"
                    >
                            Naar overzicht
                        </button>
                    </div>
                </section>
            )}

            {invitations.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h2 className="h4 mb-1">
                                Openstaande uitnodigingen
                            </h2>

                            <p className="text-muted mb-0">
                                {invitations.length}{" "}
                                {invitations.length === 1
                                    ? "uitnodiging"
                                    : "uitnodigingen"}
                            </p>
                        </div>
                    </div>

                    <section className="row g-3">
                        {invitations.map((invitation) => {
                            const groupImageUrl =
                                getImageUrl(
                                    invitation.group_profile_photo_url
                                );

                            const creatorImageUrl =
                                getImageUrl(
                                    invitation.creator_profile_photo_url
                                );

                            return (
                                <div
                                    key={invitation.invusr_id}
                                    className="col-12 col-md-6 col-xl-4"
                                >
                                    <article className="card h-100">
                                        {groupImageUrl && (
                                            <img
                                                src={groupImageUrl}
                                                alt={`Afbeelding van ${invitation.group_name}`}
                                                className="card-img-top object-fit-cover"
                                                style={{
                                                    height: "180px",
                                                }}
                                            />
                                        )}

                                        <div className="card-body d-flex flex-column">
                                            <div className="mb-3">
                                                <span className="badge text-bg-warning">
                                                    Uitgenodigd
                                                </span>
                                            </div>

                                            <h2 className="h5">
                                                {invitation.group_name}
                                            </h2>

                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                {creatorImageUrl ? (
                                                    <img
                                                        src={creatorImageUrl}
                                                        alt={`Profielfoto van ${invitation.creator_name}`}
                                                        className="rounded-circle object-fit-cover"
                                                        width="40"
                                                        height="40"
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                        }}
                                                    >
                                                        <span className="fw-semibold text-muted">
                                                            {invitation.creator_name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="text-muted small mb-0">
                                                        Uitgenodigd door
                                                    </p>

                                                    <p className="fw-semibold mb-0">
                                                        {
                                                            invitation.creator_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-muted small mb-1">
                                                    Verloopt op
                                                </p>

                                                <p className="mb-0">
                                                    {formatDateTime(
                                                        invitation.expires_at
                                                    )}
                                                </p>
                                            </div>

                                            <div className="d-grid gap-2 mt-auto">
                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    onClick={() => void acceptInvitation(invitation)}
                                                    disabled={acceptingInvitationId !== null}
                                                >
                                                    {acceptingInvitationId === invitation.invusr_id ? (
                                                        <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            aria-hidden="true"
                                                        />

                                                            Accepteren...
                                                        </>
                                                    ) : (
                                                        "Accepteren"
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    disabled
                                                >
                                                    Weigeren
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            );
                        })}
                    </section>
                </>
            )}
        </main>
    );
};

export default RoundInvitationsPage;
