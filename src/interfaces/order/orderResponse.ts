import type {IApiResponse} from "../api/apiResponse.ts";
import type {IResponseOrderWithUser} from "./orderWithUser.ts";
import type {IOrderSummary} from "./orderSummary.ts";

export interface IOrderResponse extends IApiResponse {
    data: {
        orders: IResponseOrderWithUser[],
        summary: IOrderSummary[]
    }
}
