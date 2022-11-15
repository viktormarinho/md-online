import { User } from "./session";

export interface DocType {
    id:           string;
    userId:       string;
    title:        string;
    content:      string;
    user:         User;
    allowedUsers: User[];
}