import type {IGroupFormValues} from "./groupFormValues.ts";
import type {IGroupMember} from "./groupMember.ts";

export interface IGroupFormProps{
    defaultValues?: Partial<IGroupFormValues>;
    isSubmitting?: boolean;
    mode?: "create" | "edit";
    onSubmit: (data: IGroupFormValues) => Promise<void>;
    hasFriendList: IGroupMember[];
    onServerError: string | null;
}
