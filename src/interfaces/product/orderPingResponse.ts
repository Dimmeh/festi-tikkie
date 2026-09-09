import type {IApiResponse} from "../api/apiResponse.ts";

export interface IResponseOrderPing extends IApiResponse {
    data: {
        total_users: number;
        total_orders: number;
    }
}
