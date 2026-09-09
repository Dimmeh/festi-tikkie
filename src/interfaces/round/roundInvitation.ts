export interface IRoundInvitation {
    created_at: string;
    creator_name: string;
    creator_profile_photo_url: string | null;
    event_id: number;
    expires_at: string;
    group_id: number;
    group_name: string;
    group_profile_photo_url: string | null;
    invrou_creator_id: number;
    invrou_id: number;
    invusr_id: number;
    invusr_status: "invited" | "joined" | "declined" | "expired";
}
