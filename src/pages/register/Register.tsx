import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import AccountForm from "../../components/forms/AccountForm.tsx";
import { api } from "../../components/api/api.ts";

import type { IAccountFormValues } from "../../interfaces/account/accountFormValues.ts";

import "./register-component.scss";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [serverError, setServerError] =
        useState<string | null>(null);

    const registerAccount = async (
        data: IAccountFormValues
    ): Promise<void> => {
        setServerError(null);
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append(
            "name",
            data.usr_name
        );

        formData.append(
            "email",
            data.usr_email
        );

        formData.append(
            "password",
            data.usr_password ?? ""
        );

        const profilePhoto =
            data.usr_profile_photo_url?.[0];

        if (profilePhoto) {
            formData.append(
                "profile_photo",
                profilePhoto
            );
        }

        try {
            await api.post(
                "/auth/fta_register.php",
                formData
            );

            navigate("/login", {
                replace: true,
                state: {
                    successMessage:
                        "Je account is succesvol aangemaakt. Je kunt nu inloggen.",
                },
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ??
                    "Het account kon niet worden aangemaakt."
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

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="text-center mb-4">
                        <h1 className="h2 mb-2">
                            Account aanmaken
                        </h1>

                        <p className="text-muted mb-0">
                            Maak een account aan en houd samen met
                            je vrienden de festivalrondjes bij.
                        </p>
                    </div>

                    {serverError && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {serverError}
                        </div>
                    )}

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-md-5">
                            <AccountForm
                                mode="register"
                                isSubmitting={isSubmitting}
                                onSubmit={registerAccount}
                            />
                        </div>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                        Heb je al een account?{" "}
                        <Link
                            to="/login"
                            className="fw-semibold text-decoration-none"
                        >
                            Inloggen
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RegisterPage;
