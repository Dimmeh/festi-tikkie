import type {IApiResponse} from "../api/apiResponse.ts";

export interface ICreateRoundInvitationResponse extends IApiResponse{
    data:{
        invite_round_id: number;
        group_id: number;
        invited_user_count: number;
    }
}
