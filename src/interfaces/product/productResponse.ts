import type {IProductExtraInfo} from "./productExtraInfo.ts";
import type {IApiResponse} from "../api/apiResponse.ts";

export interface IProductResponse extends IApiResponse{
    data: {
        products: IProductExtraInfo[];
        product_count: number;
    };
}
