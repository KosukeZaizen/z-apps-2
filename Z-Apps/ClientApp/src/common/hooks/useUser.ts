import { useEffect } from "react";
import { mergeLocalStorageAndSavedUserData } from "../../components/zApps/Layout/Login/MyPage/progressManager";
import { FetchResult } from "../../types/fetch";
import { changeAppState, useAppState } from "../appState";

export type User = {
    userId: number;
    name: string;
    email: string;
    progress: string | null;
    level: number;
    xp: number;
    avatarPath: string;
    bio: string;
};

let isFetchUnnecessary = false;

export function useUser() {
    const [user] = useAppState("user");
    const [isUserFetchDone, setUserFetchDone] = useAppState("isUserFetchDone");

    useEffect(() => {
        if (isFetchUnnecessary || user) {
            return;
        }
        isFetchUnnecessary = true;
        fetchUser().finally(() => {
            setUserFetchDone(true);
        });
    }, []);

    return { user, isUserFetchDone };
}

async function fetchUser() {
    const response = await fetch("api/Auth/GetUser", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const user: FetchResult<User> = await response.json();

    if ("error" in user) {
        changeAppState("user", undefined);
        return;
    }

    await mergeLocalStorageAndSavedUserData(user);
}
