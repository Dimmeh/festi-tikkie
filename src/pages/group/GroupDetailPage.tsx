import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

import useAuth from "../../components/auth/useAuth.ts";
import config from "../../../custom.config.ts";
import { api } from "../../components/api/api.ts";

import type { IGroup } from "../../interfaces/group.ts";
import type {IGroupMember} from "../../interfaces/group/groupMember.ts";
import type {IGroupResponseDetail} from "../../interfaces/group/groupResponseDetail.ts";
import type {IRoundInvitationsResponse} from "../../interfaces/round/roundInvitationsResponse.ts";
interface CreateRoundInvitationResponse {
    success: boolean;
    message: string;
    data: {
        invite_round_id: number;
        group_id: number;
        invited_user_count: number;
    };
}
const GroupDetailPage = () => {
    const { user } = useAuth();
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<IGroup | null>(null);
    // const [invitation, setInvitation] = useState<IGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isStartingRound, setIsStartingRound] = useState(false);
    const [startRoundError, setStartRoundError] = useState("");

    useEffect(() => {
        if (!user?.usr_id || !groupId) {
            return;
        }

        let isCancelled = false;

        const getGroup = async () => {
            try {
                const response = await api.get<IGroupResponseDetail>(
                    "/group/fta_get_group.php",
                    {
                        params: {
                            group_id: groupId,
                        },
                    }
                );

                if (isCancelled) {
                    return;
                }

                setGroup(response.data.group);
                setErrorMessage("");
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                setGroup(null);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De groep kon niet worden opgehaald."
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
        const getActiveInvitation = async () => {
            try {
                const response = await api.get<IRoundInvitationsResponse>(
                    "/round/fta_get_round_invitations.php"
                );

                if (isCancelled) {
                    return;
                }
                console.log(response.data.data.invitation_count)
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                setGroup(null);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De uitnodigingen kon niet worden opgehaald."
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
        }
        void getGroup();
        void getActiveInvitation();

        return () => {
            isCancelled = true;
        };
    }, [groupId, user?.usr_id]);


    const startRound = async (): Promise<void> => {
        if (!group || isStartingRound) {
            return;
        }

        setIsStartingRound(true);
        setStartRoundError("");

        const formData = new FormData();

        formData.append(
            "group_id",
            group.gro_id.toString()
        );

        formData.append(
            "evn_id",
            group.evn_id.toString()
        );
        try {
            const response =
                await api.post<CreateRoundInvitationResponse>(
                    "/round/fta_create_round_invitation.php",
                    formData
                );

            navigate(
                `/groups/${response.data.data.group_id}` +
                `/rounds/${response.data.data.invite_round_id}` +
                `/products`
            );
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "De ronde kon niet worden gestart.";

                setStartRoundError(message);

                /*
                 * Wanneer de backend het bestaande actieve
                 * ronde-ID terugstuurt, kun je eventueel direct
                 * naar die ronde navigeren.
                 */
                const activeRoundId =
                    error.response?.data?.data?.invite_round_id;

                const activeGroupId =
                    error.response?.data?.data?.group_id ??
                    group.gro_id;

                if (
                    error.response?.status === 409 &&
                    activeRoundId
                ) {
                    navigate(
                        `/groups/${activeGroupId}` +
                        `/rounds/${activeRoundId}` +
                        `/products`
                    );
                }
            } else {
                setStartRoundError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        } finally {
            setIsStartingRound(false);
        }
    };
    const getProfilePhotoUrl = (
        member: IGroupMember
    ): string | null => {
        if (!member.usr_profile_photo_url) {
            return null;
        }

        return config.baseUrl + member.usr_profile_photo_url;
    };

    if (isLoading) {
        return (
            <main className="container py-4">
                <p>Groep laden...</p>
            </main>
        );
    }

    if (errorMessage || !group) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger">
                    {errorMessage || "De groep werd niet gevonden."}
                </div>

                <Link
                    to="/groups"
                    className="btn btn-outline-secondary"
                >
                    Terug naar groepen
                </Link>
            </main>
        );
    }

    const groupMembers = group.gro_members ?? [];

    return (
        <main className="container py-4">
            <section className="row align-items-center mb-4">
                <div className="col-12">
                    <p className="text-muted mb-1">
                        Groep
                    </p>

                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <h1 className="mb-0">
                            <Link
                                to="/groups"
                                className="btn btn-outline-primary"
                            >
                                ←
                            </Link> {group.gro_name}
                        </h1>

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
                </div>

            </section>

            <section className="row g-3 mb-4">
                <div className="col-12 col-lg-8">
                    <article className="card h-100">
                        <div className="card-body p-4">
                            <p className="text-muted mb-2">
                                Jouw balans in deze groep
                            </p>

                            <p className="display-5 fw-bold mb-2">
                                0 munten
                            </p>

                            <p className="mb-0">
                                Er zijn nog geen afgeronde rondes.
                            </p>
                        </div>
                    </article>
                </div>
                {startRoundError && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {startRoundError}
                    </div>
                )}
                <div className="col-12 col-lg-4">
                    <article className="card h-100">
                        <div className="card-body p-4">
                            <p className="text-muted mb-2">
                                Actieve ronde
                            </p>

                            <h2 className="h5">
                                Geen actieve ronde
                            </h2>

                            <p className="text-muted">
                                Start een ronde en nodig groepsleden uit.
                            </p>

                            <button
                                type="button"
                                className="btn btn-success me-3"
                                onClick={() => void startRound()}
                                disabled={isStartingRound}
                            >
                                {isStartingRound
                                    ? "Ronde starten..."
                                    : "Start ronde"}
                            </button>
                            <Link
                                to="/round-invitations"
                                className="btn btn-outline-primary"
                            >
                                Bekijk uitnodigingen
                            </Link>
                        </div>
                    </article>
                </div>
            </section>

            <section className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h2 className="h4 mb-1">
                                Groepsleden
                            </h2>

                            <p className="text-muted mb-0">
                                {groupMembers.length}{" "}
                                {groupMembers.length === 1
                                    ? "geaccepteerd lid"
                                    : "geaccepteerde leden"}
                            </p>
                        </div>

                        {group.is_creator && (
                            <Link
                                to={`/groups/${group.gro_id}/edit`}
                                className="btn btn-primary"
                            >
                                Beheer groep
                            </Link>
                        )}
                    </div>

                    {groupMembers.length === 0 ? (
                        <div className="card">
                            <div className="card-body">
                                <p className="mb-0">
                                    Er zijn nog geen geaccepteerde
                                    groepsleden.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {groupMembers.map((member) => {
                                const profilePhotoUrl =
                                    getProfilePhotoUrl(member);

                                const isCurrentUser =
                                    member.usr_id === user?.usr_id;

                                const isGroupCreator =
                                    member.usr_id ===
                                    group.gro_creator_id;

                                return (
                                    <div
                                        key={member.grus_id}
                                        className="col-12 col-md-6"
                                    >
                                        <article className="card h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center gap-3">
                                                    {profilePhotoUrl ? (
                                                        <img
                                                            src={
                                                                profilePhotoUrl
                                                            }
                                                            alt={`Profielfoto van ${member.usr_name}`}
                                                            className="rounded-circle object-fit-cover"
                                                            width="56"
                                                            height="56"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                                                            style={{
                                                                width: "56px",
                                                                height: "56px",
                                                            }}
                                                        >
                                                            <span className="h5 text-muted mb-0">
                                                                {member.usr_name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                                            <h3 className="h6 mb-0">
                                                                {
                                                                    member.usr_name
                                                                }
                                                            </h3>

                                                            {isCurrentUser && (
                                                                <span className="badge text-bg-light">
                                                                    Jij
                                                                </span>
                                                            )}

                                                            {isGroupCreator && (
                                                                <span className="badge text-bg-primary">
                                                                    Beheerder
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-muted small mb-0">
                                                            {
                                                                member.usr_code
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <hr />

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-muted">
                                                        Onderlinge balans
                                                    </span>

                                                    <span className="fw-semibold">
                                                        0 munten
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="col-12 col-lg-4">
                    <article className="card mb-3">
                        <div className="card-body">
                            <h2 className="h5">
                                Groepsinformatie
                            </h2>

                            {group.gro_creator_name && (
                                <div className="mb-3">
                                    <p className="text-muted small mb-1">
                                        Beheerder
                                    </p>

                                    <p className="mb-0">
                                        {group.gro_creator_name}
                                    </p>
                                </div>
                            )}

                            <div className="mb-3">
                                <p className="text-muted small mb-1">
                                    Aangemaakt op
                                </p>

                                <p className="mb-0">
                                    {new Date(
                                        group.gro_created_at
                                    ).toLocaleDateString("nl-NL", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted small mb-1">
                                    Jouw rol
                                </p>

                                <p className="mb-0">
                                    {group.is_creator
                                        ? "Beheerder"
                                        : "Groepslid"}
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="card-body">
                            <h2 className="h5">
                                Snelle acties
                            </h2>

                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => void startRound()}
                                    disabled={isStartingRound}
                                >
                                    {isStartingRound
                                        ? "Ronde starten..."
                                        : "Start ronde"}
                                </button>

                                {group.is_creator && (
                                    <Link
                                        to={`/groups/${group.gro_id}/edit`}
                                        className="btn btn-outline-primary"
                                    >
                                        Bewerk groep
                                    </Link>
                                )}

                                <Link
                                    to="/groups"
                                    className="btn btn-outline-secondary"
                                >
                                    Alle groepen
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
};

export default GroupDetailPage;
