import AccountForm from "../../components/forms/AccountForm.tsx";
import axios from "axios";
import {api} from "../../components/api/api.ts";
import type {IAccountFormValues} from "../../interfaces/account/accountFormValues.ts";
import {useState} from "react";
import useAuth from "../../components/auth/useAuth.ts";
import {Link} from "react-router-dom";

const EditAccountPage = () => {
    const { user, refreshUser } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    if (!user) {
        return null;
    }

    const updateAccount = async (
        data: IAccountFormValues
    ): Promise<void> => {
        setMessage(null);
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("name", data.usr_name);
        formData.append("email", data.usr_email);

        const profilePhoto = data.usr_profile_photo_url?.[0];

        if (profilePhoto) {
            formData.append("profile_photo", profilePhoto);
        }

        try {
            await api.post("/fta_edit_account.php", formData);
            await refreshUser();

            setMessage({
                type: "success",
                text: "Je account is succesvol bijgewerkt.",
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setMessage({
                    type: "error",
                    text:
                        error.response?.data?.message ??
                        "Je account kon niet worden bijgewerkt.",
                });
            } else {
                setMessage({
                    type: "error",
                    text: "Er is een onverwachte fout opgetreden.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {message && (
                <div
                    className={`alert ${
                        message.type === "success"
                            ? "alert-success"
                            : "alert-danger"
                    }`}
                >
                    {message.text}
                </div>
            )}
            <Link to="/overview">
                <button type="button" className="btn btn-primary">
                    Terug naar overzicht
                </button>
            </Link>
            <AccountForm
                mode="edit"
                defaultValues={{
                    usr_name: user.usr_name,
                    usr_email: user.usr_email,
                    usr_profile_photo_url: user.usr_profile_photo_url,
                }}
                isSubmitting={isSubmitting}
                onSubmit={updateAccount}
            />
        </>
    );
}

export default EditAccountPage
