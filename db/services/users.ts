import "server-only";
import { add, del, find, get, update } from "./base";
import { getUsersContainer } from "../containers/users";
import { User } from "../types/user";
import { PatchOperationType } from "@azure/cosmos";
import { convexClient, useConvex } from "@/lib/convexClient";

// CREATE
export const addUser = async (user: Omit<User, "createdAt" | "updatedAt">): Promise<User | null> => {
    const now = Date.now();
    if (useConvex && convexClient) {
        try {
            return (await (convexClient as any).mutation("users:addUser", { user })) as User | null;
        } catch {
            return null;
        }
    }
    return add<User, User>(await getUsersContainer(), {
        ...user,
        createdAt: now,
        updatedAt: now
    });
};

// READ
export const getUser = async (id: string): Promise<User | null> => {
    if (useConvex && convexClient) {
        try {
            return (await (convexClient as any).query("users:getUser", { id })) as User | null;
        } catch {
            return null;
        }
    }
    return get(await getUsersContainer(), id, id);
};

// UPDATE
export const updateUsername = async (id: string, username: string): Promise<boolean> => {
    if (useConvex && convexClient) {
        try {
            return (await (convexClient as any).mutation("users:updateUsername", { id, username })) as boolean;
        } catch {
            return false;
        }
    }
    return update(
        await getUsersContainer(),
        id,
        id,
        [
            { op: PatchOperationType.set, path: "/username", value: username },
            { op: PatchOperationType.set, path: "/updatedAt", value: Date.now() }
        ]
    );
};