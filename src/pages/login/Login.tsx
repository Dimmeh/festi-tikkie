import {useForm} from "react-hook-form";
import axios from "axios";
import type {IFormLoginInput} from "../../interfaces/formLoginInput.ts";
import {useState} from "react";
import useAuth from "../../components/auth/useAuth.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";

const LoginPage = () => {

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<IFormLoginInput>();

    const [serverError, setServerError] = useState<string | null>(null);

    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.successMessage;

    const onSubmit = async (data: IFormLoginInput) => {
        setServerError(null);

        try {
            await login(data.email, data.password)
            console.log("login success")
            navigate('/overview', {
                replace: true
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "Inloggen is mislukt.";

                setServerError(message);
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    }
    return (
        <>
            <div id="login-form-container" className="form-container">
                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label
                            htmlFor="loginEmail"
                            className="form-label"
                        >
                            E-mailadres
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            id="loginEmail"
                            autoComplete="email"
                            {...register("email", {
                                required: "Vul je e-mailadres in.",
                            })}
                        />

                        {errors.email && (
                            <p className="text-danger">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="loginPassword"
                            className="form-label"
                        >
                            Wachtwoord
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            id="loginPassword"
                            autoComplete="current-password"
                            {...register("password", {
                                required: "Vul je wachtwoord in.",
                            })}
                        />

                        {errors.password && (
                            <p className="text-danger">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <div className="alert alert-danger">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Bezig met inloggen..." : "Inloggen"}
                    </button>
                    <Link to="/register">
                        <button type="button" className="btn btn-link">Registreren</button>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default LoginPage
