import axios from "axios"
import "./register-component.scss"
import {useNavigate} from "react-router-dom";
import AccountForm from "../../components/forms/AccountForm.tsx";
import {api} from "../../components/api/api.ts";
import {useState} from "react";
import type {IAccountFormValues} from "../../interfaces/account/accountFormValues.ts";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const registerAccount = async (
        data: IAccountFormValues
    ): Promise<void> => {
        setServerError(null);
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("name", data.usr_name);
        formData.append("email", data.usr_email);
        formData.append("password", data.usr_password ?? "");

        const profilePhoto = data.usr_profile_photo_url?.[0];

        if (profilePhoto) {
            formData.append("profile_photo", profilePhoto);
        }

        try {
            await api.post("/fta_register.php", formData);

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
        <>
            {serverError && (
                <div className="alert alert-danger">
                    {serverError}
                </div>
            )}

            <AccountForm
                mode="register"
                isSubmitting={isSubmitting}
                onSubmit={registerAccount}
            />
        </>
    )
}

export default RegisterPage
