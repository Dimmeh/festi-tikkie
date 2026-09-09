import type {IProduct} from "./product.ts";

export interface IProductExtraInfo extends IProduct{
    dep_name: string;
    dep_value: string;
    procat_name:string;
}
