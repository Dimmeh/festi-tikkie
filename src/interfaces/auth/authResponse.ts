import type {IUser} from "../user/user.ts";

export interface IAuthResponse {
    success: boolean;
    message: string;
    user: IUser;
}
