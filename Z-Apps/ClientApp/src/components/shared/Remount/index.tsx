import { useEffect } from "react";
import { changeAppState, useAppState } from "../../../common/appState";
import { FullScreenShurikenProgress } from "../Animations/ShurikenProgress";

export function ReMountMain({ children }: { children: React.ReactNode }) {
    const [isMainMounted] = useAppState("isMainMounted");

    if (isMainMounted) {
        return <RemountChildrenWrapper>{children}</RemountChildrenWrapper>;
    }
    return <FullScreenShurikenProgress />;
}

let positionY: number = 0;
let remounting = false;

export function reMountMain(option?: { forgetPositionY?: boolean }) {
    positionY = option?.forgetPositionY ? 0 : window.pageYOffset;
    remounting = true;

    changeAppState("isMainMounted", false);
    setTimeout(() => {
        changeAppState("isMainMounted", true);
    }, 1);
}

function RemountChildrenWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!remounting) {
            // The case of the initial load
            return;
        }
        scrollTo(0, positionY);
        remounting = false;
    }, []);
    return <>{children}</>;
}
