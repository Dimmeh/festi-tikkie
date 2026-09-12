import type {IUserOrderProduct} from "./userOrderProduct";

export interface IUserOrder {
    usr_id: number;
    usr_name: string;
    usr_email: string;
    usr_profile_photo_url: string;
    usr_total_price: string;
    products: IUserOrderProduct[]
}
