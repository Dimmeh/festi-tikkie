import type {IUser} from "./user.ts";

export interface IGroup {
    gro_id: number;
    gro_name: string;
    gro_profile_photo: string;
    gro_creator_id: number;
    gro_members?: IUser[];
    gro_created_at: string;
    gro_updated_at: string;
}
