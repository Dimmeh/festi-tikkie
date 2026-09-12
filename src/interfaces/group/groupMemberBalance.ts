import type {IApiResponse} from "../api/apiResponse.ts";
import type {IBalance} from "./balance.ts";

export interface IGroupMemberBalance extends IApiResponse {
    data: {
        balances: IBalance[]
    }

}
