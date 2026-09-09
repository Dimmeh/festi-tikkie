import type {IUser} from "../user/user.ts";

export interface IAuthContextValue {
    user: IUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}
