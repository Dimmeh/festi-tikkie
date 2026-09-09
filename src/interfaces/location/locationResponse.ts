import type {IApiResponse} from "../api/apiResponse.ts";
import type {ILocation} from "./location.ts";

export interface ILocationResponse extends IApiResponse{
    data:{
        locations:ILocation[];
        location_count:number
    };
}
