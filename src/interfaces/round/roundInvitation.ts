export interface IRoundInvitation {
    invusr_id: number;
    invrou_id: number;
    invusr_status: "invited";
    invrou_creator_id: number;
    group_id: number;
    event_id: number;
    group_name: string;
    group_profile_photo_url: string | null;
    creator_name: string;
    creator_profile_photo_url: string | null;
    expires_at: string;
    created_at: string;
}
