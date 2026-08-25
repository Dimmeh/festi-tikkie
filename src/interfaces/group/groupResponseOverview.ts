import type {IGroupResponse} from "./groupResponse.ts";
import type {IGroup} from "../group.ts";

export interface IGroupsResponseOverview extends IGroupResponse{
    groups: IGroup[];
}
