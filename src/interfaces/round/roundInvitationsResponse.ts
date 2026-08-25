import type { IRoundInvitation } from "./roundInvitation.ts";

export interface IRoundInvitationsResponse {
    success: boolean;
    message: string;
    data: {
        invitations: IRoundInvitation[];
        invitation_count: number;
    };
}
