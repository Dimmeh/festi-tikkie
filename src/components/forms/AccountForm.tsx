import { useForm } from "react-hook-form";

import type { IAccountFormProps } from "../../interfaces/account/accountFormProps.ts";
import type { IAccountFormValues } from "../../interfaces/account/accountFormValues.ts";

const AccountForm = ({
                         defaultValues,
                         mode,
                         isSubmitting = false,
                         onSubmit,
                     }: IAccountFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IAccountFormValues>({
        defaultValues,
    });

    const isRegisterMode = mode === "register";

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
                <label htmlFor="accountName" className="form-label fw-semibold">
                    Naam
                </label>

                <input
                    id="accountName"
                    type="text"
                    autoComplete="name"
                    className={`form-control ${
                        errors.usr_name ? "is-invalid" : ""
                    }`}
                    placeholder="Vul je naam in"
                    aria-invalid={Boolean(errors.usr_name)}
                    {...register("usr_name", {
                        required: "Vul je naam in.",
                        minLength: {
                            value: 2,
                            message: "Je naam moet minimaal 2 tekens bevatten.",
                        },
                    })}
                />

                {errors.usr_name ? (
                    <div className="invalid-feedback">
                        {errors.usr_name.message}
                    </div>
                ) : (
                    <div className="form-text">
                        Deze naam is zichtbaar voor je vrienden.
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="accountEmail" className="form-label fw-semibold">
                    E-mailadres
                </label>

                <input
                    id="accountEmail"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${
                        errors.usr_email ? "is-invalid" : ""
                    }`}
                    placeholder="naam@voorbeeld.nl"
                    aria-invalid={Boolean(errors.usr_email)}
                    {...register("usr_email", {
                        required: "Vul je e-mailadres in.",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Vul een geldig e-mailadres in.",
                        },
                    })}
                />

                {errors.usr_email && (
                    <div className="invalid-feedback">
                        {errors.usr_email.message}
                    </div>
                )}
            </div>

            {isRegisterMode && (
                <div className="mb-4">
                    <label
                        htmlFor="accountPassword"
                        className="form-label fw-semibold"
                    >
                        Wachtwoord
                    </label>

                    <input
                        id="accountPassword"
                        type="password"
                        autoComplete="new-password"
                        className={`form-control ${
                            errors.usr_password ? "is-invalid" : ""
                        }`}
                        placeholder="Kies een veilig wachtwoord"
                        aria-invalid={Boolean(errors.usr_password)}
                        {...register("usr_password", {
                            required: "Vul een wachtwoord in.",
                            minLength: {
                                value: 8,
                                message:
                                    "Je wachtwoord moet minimaal 8 tekens bevatten.",
                            },
                        })}
                    />

                    {errors.usr_password ? (
                        <div className="invalid-feedback">
                            {errors.usr_password.message}
                        </div>
                    ) : (
                        <div className="form-text">
                            Gebruik minimaal 8 tekens.
                        </div>
                    )}
                </div>
            )}

            <div className="mb-4">
                <label
                    htmlFor="accountProfilePhoto"
                    className="form-label fw-semibold"
                >
                    Profielfoto
                </label>

                <input
                    id="accountProfilePhoto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={`form-control ${
                        errors.usr_profile_photo_url ? "is-invalid" : ""
                    }`}
                    aria-invalid={Boolean(errors.usr_profile_photo_url)}
                    {...register("usr_profile_photo_url", {
                        required: isRegisterMode
                            ? "Selecteer een profielfoto."
                            : false,
                    })}
                />

                {errors.usr_profile_photo_url ? (
                    <div className="invalid-feedback">
                        {errors.usr_profile_photo_url.message}
                    </div>
                ) : (
                    <div className="form-text">
                        Gebruik bij voorkeur een vierkante JPG, PNG of WebP.
                        {!isRegisterMode &&
                            " Laat dit veld leeg om je huidige foto te behouden."}
                    </div>
                )}
            </div>

            <div className="d-grid d-sm-flex justify-content-sm-end">
                <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting && (
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                        />
                    )}

                    {isSubmitting
                        ? "Bezig..."
                        : isRegisterMode
                            ? "Account aanmaken"
                            : "Wijzigingen opslaan"}
                </button>
            </div>
        </form>
    );
};

export default AccountForm;
