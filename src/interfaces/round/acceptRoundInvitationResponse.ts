export interface IAcceptRoundInvitationResponse {
    success: boolean;
    message: string;
    data: {
        invusr_id: number;
        invite_round_id: number;
        group_id: number;
        event_id: number;
    };
}
