import type {IUser} from "../user/user.ts";

export interface IGroupMember extends IUser {
    grus_id: number;
    gro_id: number;
    grus_status: number;
}
