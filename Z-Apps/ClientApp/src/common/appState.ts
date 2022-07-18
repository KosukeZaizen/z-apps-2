import { useEffect, useState } from "react";
import { initialAuthorPanelState } from "../components/shared/Author";
import { SignInPanelState } from "../components/zApps/Layout/Login/Panel";
import { User } from "./hooks/useUser";

type AppState = {
    headerHeight: number;
    isNoYouTubeAdMode: boolean;
    screenSize: { screenWidth: number; screenHeight: number };
    signInPanelState: SignInPanelState;
    authorPanelState: { open: true; title?: string } | { open: false };
    user?: User;
    otherUserPanelState: { targetUserId: number } | "closed";
    isUserFetchDone: boolean;
    isMainMounted: boolean;
    xpBeforeSignUp: number;
};
const appState: AppState = {
    headerHeight: 60,
    isNoYouTubeAdMode: false,
    screenSize: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
    },
    signInPanelState: "close",
    authorPanelState: initialAuthorPanelState,
    user: undefined,
    otherUserPanelState: "closed",
    isUserFetchDone: false,
    isMainMounted: true,
    xpBeforeSignUp: 0,
};

export function getAppState() {
    return { ...appState };
}

type ArrFnc = ((value: AppState[keyof AppState]) => void)[];

const setValues: {
    [key in keyof AppState]?: ArrFnc;
} = {};

export function changeAppState<T extends keyof AppState>(
    name: T,
    value: AppState[T]
) {
    appState[name] = value;
    setValues[name]?.forEach(f => f(value));
}

export function useAppState<T extends keyof AppState>(
    stateName: T
): [AppState[T], (value: AppState[T]) => void] {
    const [value, setValue] = useState<AppState[T]>(appState[stateName]);

    useEffect(() => {
        setValue(appState[stateName]);

        const arrFnc: ArrFnc = setValues[stateName] || [];
        setValues[stateName] = [...arrFnc, setValue] as ArrFnc;

        return () => {
            setValues[stateName] = setValues[stateName]?.filter(
                f => f !== setValue
            );
        };
    }, [stateName]);

    return [
        value,
        newValue => {
            changeAppState(stateName, newValue);
        },
    ];
}
