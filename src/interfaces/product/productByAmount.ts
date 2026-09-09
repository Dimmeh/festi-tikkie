import type {IProductExtraInfo} from "./productExtraInfo.ts";

export interface IProductByAmount extends IProductExtraInfo {
    product_amount: number;
}
