import type {IApiResponse} from "../api/apiResponse.ts";

export interface OrderResponse extends IApiResponse {
    data: {
        orders: never[],
        total_orders: number
    }
}
