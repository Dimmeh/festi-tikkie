import type {IUser} from "../user.ts";

export interface IAuthResponse {
    success: boolean;
    message: string;
    user: IUser;
}
