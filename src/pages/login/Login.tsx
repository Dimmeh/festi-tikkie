import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import useAuth from "../../components/auth/useAuth.ts";

import type { IFormLoginInput } from "../../interfaces/formLoginInput.ts";

interface LoginLocationState {
    successMessage?: string;
}

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<IFormLoginInput>();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const { login } = useAuth();
    const location = useLocation();

    const locationState =
        location.state as LoginLocationState | null;

    const successMessage =
        locationState?.successMessage;

    const onSubmit = async (
        data: IFormLoginInput
    ): Promise<void> => {
        setServerError(null);

        try {
            await login(
                data.email,
                data.password
            );
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ??
                    "Inloggen is mislukt."
                );
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    };

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="text-center mb-4">
                        <h1 className="h2 mb-2">
                            Welkom terug
                        </h1>

                        <p className="text-muted mb-0">
                            Log in om je groepen en openstaande
                            bedragen te bekijken.
                        </p>
                    </div>

                    {successMessage && (
                        <div
                            className="alert alert-success"
                            role="alert"
                        >
                            {successMessage}
                        </div>
                    )}

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-md-5">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                            >
                                <div className="mb-4">
                                    <label
                                        htmlFor="loginEmail"
                                        className="form-label fw-semibold"
                                    >
                                        E-mailadres
                                    </label>

                                    <input
                                        id="loginEmail"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="naam@voorbeeld.nl"
                                        aria-invalid={Boolean(
                                            errors.email
                                        )}
                                        className={`form-control ${
                                            errors.email
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("email", {
                                            required:
                                                "Vul je e-mailadres in.",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    "Vul een geldig e-mailadres in.",
                                            },
                                        })}
                                    />

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label
                                            htmlFor="loginPassword"
                                            className="form-label fw-semibold"
                                        >
                                            Wachtwoord
                                        </label>
                                    </div>

                                    <input
                                        id="loginPassword"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Vul je wachtwoord in"
                                        aria-invalid={Boolean(
                                            errors.password
                                        )}
                                        className={`form-control ${
                                            errors.password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register("password", {
                                            required:
                                                "Vul je wachtwoord in.",
                                        })}
                                    />

                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>

                                {serverError && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {serverError}
                                    </div>
                                )}

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && (
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                aria-hidden="true"
                                            />
                                        )}

                                        {isSubmitting
                                            ? "Bezig met inloggen..."
                                            : "Inloggen"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                        Nog geen account?{" "}
                        <Link
                            to="/register"
                            className="fw-semibold text-decoration-none"
                        >
                            Account aanmaken
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
