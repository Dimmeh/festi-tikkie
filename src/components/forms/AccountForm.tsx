import type {IAccountFormProps} from "../../interfaces/account/accountFormProps.ts";
import type {IAccountFormValues} from "../../interfaces/account/accountFormValues.ts";
import {useForm} from "react-hook-form";

const AccountForm = ({defaultValues, mode, isSubmitting = false, onSubmit} : IAccountFormProps) => {
    const {register, handleSubmit, formState: { errors }} = useForm<IAccountFormValues>({defaultValues})
    const isRegisterMode = mode === "register";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Naam
                </label>

                <input id="name" type="text" className="form-control"
                       {...register("usr_name", {
                           required: "Vul je naam in",
                       })}
                />


                {errors.usr_name && (
                    <p className="text-danger">
                        {errors.usr_name.message}
                    </p>
                )}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    E-mailadres
                </label>

                <input id="email" type="email" className="form-control"
                       {...register("usr_email", {
                           required: "Vul je e-mailadres in",
                       })}
                />


                {errors.usr_email && (
                    <p className="text-danger">
                        {errors.usr_email.message}
                    </p>
                )}
            </div>
            {isRegisterMode && (
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Wachtwoord
                    </label>

                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        {...register("usr_password", {
                            required: isRegisterMode
                                ? "Vul een wachtwoord in."
                                : false,
                        })}
                    />

                    {errors.usr_password && (
                        <p className="text-danger">
                            {errors.usr_password.message}
                        </p>
                    )}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="profilePhoto" className="form-label">
                    Profielfoto
                </label>

                <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="form-control"
                    {...register("usr_profile_photo_url", {
                        required: isRegisterMode
                            ? "Selecteer een profielfoto."
                            : false,
                    })}
                />

                {errors.usr_profile_photo_url && (
                    <p className="text-danger">
                        {errors.usr_profile_photo_url.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? "Bezig..."
                    : isRegisterMode
                        ? "Account aanmaken"
                        : "Wijzigingen opslaan"}
            </button>
        </form>
    )
}

export default AccountForm;
