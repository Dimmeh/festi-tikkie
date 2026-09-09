import type {IApiResponse} from "../api/apiResponse.ts";

export interface ICreateOrderResponse extends IApiResponse {
    data:{
        is_creator: boolean,
    }
}
