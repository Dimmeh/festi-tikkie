import type {IGroupMember} from "./group/groupMember.ts";

export interface IGroup {
    gro_id: number;
    gro_name: string;
    gro_profile_photo_url: string;
    gro_creator_id: number;
    gro_members: IGroupMember[];
    gro_created_at: string;
    gro_updated_at: string;
    is_creator: boolean;
    gro_creator_name?: string;
    member_count?: number;
    evn_id: number;
}
