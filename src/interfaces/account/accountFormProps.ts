import type {IAccountFormValues} from "./accountFormValues.ts";

export interface IAccountFormProps{
    defaultValues?: Partial<IAccountFormValues>;
    mode: "register" | "edit";
    isSubmitting?: boolean;
    onSubmit: (data: IAccountFormValues) => Promise<void>;
}
