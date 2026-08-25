import {  useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import config from "../../../custom.config.ts";
import { api } from "../api/api.ts";

import type { IGroupFormValues } from "../../interfaces/group/groupFormValues.ts";
import type { IGroupFormProps } from "../../interfaces/group/groupFormProps.ts";
import type { IGroupMember } from "../../interfaces/group/groupMember.ts";

const GroupFormComponent = ({
                                defaultValues,
                                isSubmitting = false,
                                mode = "create",
                                onSubmit,
                                onServerError = null,
                                hasFriendList = [],
                            }: IGroupFormProps) => {
    const [serverError, setServerError] = useState<string | null>(
        onServerError
    );

    const [friendCodeInput, setFriendCodeInput] = useState("");
    const [friendList, setFriendList] =
        useState<IGroupMember[]>(hasFriendList);

    const [isSearchingFriend, setIsSearchingFriend] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IGroupFormValues>({
        defaultValues,
    });

    const isCreateMode = mode === "create";
    const isFriendCodeValid = /^\d{6}$/.test(friendCodeInput);

    // useEffect(() => {
    //     setServerError(onServerError);
    // }, [onServerError]);

    const searchFriend = async (): Promise<void> => {
        if (!isFriendCodeValid || isSearchingFriend) {
            return;
        }

        setServerError(null);
        setIsSearchingFriend(true);

        try {
            const response = await api.get<{ user: IGroupMember }>(
                "/utils/friendcode/friendcode.php",
                {
                    params: {
                        friendcode: friendCodeInput,
                    },
                }
            );

            const foundUser = response.data.user;

            const friendAlreadyExists = friendList.some(
                (friend) => friend.usr_id === foundUser.usr_id
            );

            if (friendAlreadyExists) {
                setServerError(
                    "Deze gebruiker staat al in de vriendenlijst."
                );

                return;
            }

            setFriendList((currentFriendList) => [
                ...currentFriendList,
                foundUser,
            ]);

            setFriendCodeInput("");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ??
                    "Deze vriendcode is niet geldig."
                );
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        } finally {
            setIsSearchingFriend(false);
        }
    };

    const handleFriendCodeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = event.target.value.replace(/\D/g, "").slice(0, 6);

        setFriendCodeInput(value);
        setServerError(null);
    };

    const handleFriendCodeKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        void searchFriend();
    };

    const deleteFromFriendList = (userId: number): void => {
        setFriendList((currentFriendList) =>
            currentFriendList.filter(
                (friend) => friend.usr_id !== userId
            )
        );
    };

    const submitGroupForm = (data: IGroupFormValues): void => {
        const memberIds = friendList.map(
            (friend) => friend.usr_id
        );

        void onSubmit({
            ...data,
            gro_members: JSON.stringify(memberIds),
        });
    };

    return (
        <form onSubmit={handleSubmit(submitGroupForm)} noValidate>
            <div className="mb-4">
                <label
                    htmlFor="groupName"
                    className="form-label fw-semibold"
                >
                    Groepsnaam
                </label>

                <input
                    id="groupName"
                    type="text"
                    className={`form-control ${
                        errors.gro_name ? "is-invalid" : ""
                    }`}
                    placeholder="Bijvoorbeeld: Alcatraz 2026"
                    aria-invalid={Boolean(errors.gro_name)}
                    {...register("gro_name", {
                        required: "Vul een groepsnaam in.",
                        minLength: {
                            value: 2,
                            message:
                                "De groepsnaam moet minimaal 2 tekens bevatten.",
                        },
                        maxLength: {
                            value: 50,
                            message:
                                "De groepsnaam mag maximaal 50 tekens bevatten.",
                        },
                    })}
                />

                {errors.gro_name ? (
                    <div className="invalid-feedback">
                        {errors.gro_name.message}
                    </div>
                ) : (
                    <div className="form-text">
                        Kies een herkenbare naam voor je vriendengroep.
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label
                    htmlFor="groupProfilePhotoUrl"
                    className="form-label fw-semibold"
                >
                    Groepsfoto
                </label>

                <input
                    id="groupProfilePhotoUrl"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={`form-control ${
                        errors.gro_profile_photo_url
                            ? "is-invalid"
                            : ""
                    }`}
                    aria-invalid={Boolean(
                        errors.gro_profile_photo_url
                    )}
                    {...register("gro_profile_photo_url", {
                        required: isCreateMode
                            ? "Kies een groepsfoto."
                            : false,
                    })}
                />

                {errors.gro_profile_photo_url ? (
                    <div className="invalid-feedback">
                        {errors.gro_profile_photo_url.message}
                    </div>
                ) : (
                    <div className="form-text">
                        Gebruik bij voorkeur een vierkante JPG, PNG of WebP.
                        {!isCreateMode &&
                            " Laat dit veld leeg om de huidige foto te behouden."}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <div>
                        <label
                            htmlFor="groupFriendCode"
                            className="form-label fw-semibold mb-1"
                        >
                            Groepsleden
                        </label>

                        <p className="form-text mt-0 mb-0">
                            Voeg vrienden toe met hun zescijferige vriendcode.
                        </p>
                    </div>

                    <span className="badge text-bg-light">
                        {friendList.length}{" "}
                        {friendList.length === 1 ? "lid" : "leden"}
                    </span>
                </div>

                <div className="input-group">
                    <input
                        id="groupFriendCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={6}
                        value={friendCodeInput}
                        className="form-control"
                        placeholder="Bijvoorbeeld 796129"
                        aria-label="Vriendcode"
                        onChange={handleFriendCodeChange}
                        onKeyDown={handleFriendCodeKeyDown}
                    />

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        disabled={
                            !isFriendCodeValid ||
                            isSearchingFriend ||
                            isSubmitting
                        }
                        onClick={() => void searchFriend()}
                    >
                        {isSearchingFriend && (
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                aria-hidden="true"
                            />
                        )}

                        {isSearchingFriend
                            ? "Zoeken..."
                            : "Toevoegen"}
                    </button>
                </div>

                {friendCodeInput.length > 0 &&
                    !isFriendCodeValid && (
                        <div className="form-text text-warning">
                            Een vriendcode bestaat uit precies 6 cijfers.
                        </div>
                    )}
            </div>

            <div className="mb-4">
                {friendList.length === 0 ? (
                    <div className="border rounded-3 p-4 text-center">
                        <p className="fw-semibold mb-1">
                            Nog geen vrienden toegevoegd
                        </p>

                        <p className="text-muted mb-0">
                            Vul hierboven een vriendcode in om iemand toe
                            te voegen.
                        </p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {friendList.map((friend) => {
                            const profilePhotoUrl =
                                friend.usr_profile_photo_url
                                    ? config.baseUrl +
                                    friend.usr_profile_photo_url
                                    : null;

                            return (
                                <article
                                    key={friend.usr_id}
                                    className="border rounded-3 p-3"
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {profilePhotoUrl ? (
                                            <img
                                                src={profilePhotoUrl}
                                                alt={`Profielfoto van ${friend.usr_name}`}
                                                className="rounded-circle object-fit-cover flex-shrink-0"
                                                width="52"
                                                height="52"
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "52px",
                                                    height: "52px",
                                                }}
                                                aria-hidden="true"
                                            >
                                                <span className="fw-semibold text-muted">
                                                    {friend.usr_name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="fw-semibold text-truncate mb-1">
                                                {friend.usr_name}
                                            </p>

                                            <p className="text-muted small mb-0">
                                                Vriendcode:{" "}
                                                <span className="font-monospace">
                                                    {friend.usr_code}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger flex-shrink-0"
                                            disabled={isSubmitting}
                                            aria-label={`${friend.usr_name} verwijderen`}
                                            onClick={() =>
                                                deleteFromFriendList(
                                                    friend.usr_id
                                                )
                                            }
                                        >
                                            Verwijderen
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {serverError && (
                <div className="alert alert-danger" role="alert">
                    {serverError}
                </div>
            )}

            <div className="d-grid d-sm-flex justify-content-sm-end">
                <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting || isSearchingFriend}
                >
                    {isSubmitting && (
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                        />
                    )}

                    {isSubmitting
                        ? "Bezig..."
                        : isCreateMode
                            ? "Groep aanmaken"
                            : "Wijzigingen opslaan"}
                </button>
            </div>
        </form>
    );
};

export default GroupFormComponent;
