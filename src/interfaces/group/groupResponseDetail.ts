import type {IGroupResponse} from "./groupResponse.ts";
import type {IGroup} from "../group.ts";

export interface IGroupResponseDetail extends IGroupResponse{
    group: IGroup;
}
