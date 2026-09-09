import type {IGroup} from "./group.ts";
import type {IApiResponse} from "../api/apiResponse.ts";

export interface IGroupsResponseOverview extends IApiResponse{
    groups: IGroup[];
}
