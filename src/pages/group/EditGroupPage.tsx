import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import GroupForm from "../../components/forms/GroupForm.tsx";
import { api } from "../../components/api/api.ts";

import type { IGroup } from "../../interfaces/group.ts";
import type { IGroupFormValues } from "../../interfaces/group/groupFormValues.ts";
import type { IGroupResponseDetail} from "../../interfaces/group/groupResponseDetail.ts";

const EditGroupPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();

    const [group, setGroup] = useState<IGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!groupId) {
            // setServerError("Er is geen geldige groep geselecteerd.");
            // setIsLoading(false);
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
                setServerError(null);
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                if (axios.isAxiosError(error)) {
                    setServerError(
                        error.response?.data?.message ??
                        "De groep kon niet worden opgehaald."
                    );
                } else {
                    setServerError(
                        "Er is een onverwachte fout opgetreden."
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        void getGroup();

        return () => {
            isCancelled = true;
        };
    }, [groupId]);

    const updateGroup = async (
        data: IGroupFormValues
    ): Promise<void> => {
        if (!groupId) {
            return;
        }

        setServerError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("id", groupId);
        formData.append("name", data.gro_name);

        if (Array.isArray(data.gro_members)) {
            formData.append(
                "member_ids",
                JSON.stringify(data.gro_members)
            );
        } else {
            formData.append(
                "member_ids",
                data.gro_members ?? ""
            );
        }

        const profilePhoto =
            data.gro_profile_photo_url instanceof FileList
                ? data.gro_profile_photo_url[0]
                : undefined;

        if (profilePhoto) {
            formData.append(
                "profile_photo",
                profilePhoto
            );
        }

        try {
            await api.post(
                "/group/fta_edit_group.php",
                formData
            );

            setSuccessMessage(
                "De groep is succesvol bijgewerkt."
            );

            navigate(
                `/groups/${groupId}`,
                {
                    replace: true,
                    state: {
                        message:
                            "De groep is succesvol bijgewerkt.",
                    },
                }
            );
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ??
                    "De groep kon niet worden bijgewerkt."
                );
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container py-4">
                <p>Groep laden...</p>
            </main>
        );
    }

    if (serverError && !group) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger" role="alert">
                    {serverError}
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

    if (!group) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger">
                    De groep werd niet gevonden.
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

    if (!group.is_creator) {
        return (
            <Navigate
                to={`/groups/${group.gro_id}`}
                replace
            />
        );
    }

    return (
        <main className="container py-4">
            <section className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">
                        Groepsbeheer
                    </p>

                    <h1 className="mb-0">
                        {group.gro_name} bewerken
                    </h1>
                </div>

                <div className="col-auto">
                    <Link
                        to={`/groups/${group.gro_id}`}
                        className="btn btn-outline-secondary"
                    >
                        Annuleren
                    </Link>
                </div>
            </section>

            <section className="row justify-content-center">
                <div className="col-12 col-lg-9">
                    {serverError && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {serverError}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            className="alert alert-success"
                            role="alert"
                        >
                            {successMessage}
                        </div>
                    )}

                    <div className="card">
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <h2 className="h5 mb-2">
                                    Groepsgegevens
                                </h2>

                                <p className="text-muted mb-0">
                                    Pas de naam, afbeelding en leden van
                                    deze groep aan.
                                </p>
                            </div>

                            <GroupForm
                                mode="edit"
                                defaultValues={{
                                    gro_name: group.gro_name,
                                    gro_profile_photo_url:
                                    group.gro_profile_photo_url,
                                    gro_creator_id:
                                        group.gro_creator_id.toString(),
                                }}
                                isSubmitting={isSubmitting}
                                onSubmit={updateGroup}
                                onServerError={serverError}
                                hasFriendList={group.gro_members ?? []}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Link
                            to={`/groups/${group.gro_id}`}
                            className="text-decoration-none"
                        >
                            Terug naar groep
                        </Link>

                        <Link
                            to="/groups"
                            className="text-decoration-none"
                        >
                            Alle groepen
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default EditGroupPage;
