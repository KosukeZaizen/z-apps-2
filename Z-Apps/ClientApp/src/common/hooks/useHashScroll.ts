import { Location } from "history";
import { useEffect } from "react";
import { scrollToElement } from "../../components/zApps/Layout/NavMenu";

export function useHashScroll(
    { hash }: Location,
    noSmooth?: boolean,
    headerShown?: boolean
) {
    useEffect(() => {
        const replacedHash = hash.replace("#", "");
        scrollToElement(
            document.getElementById(replacedHash),
            noSmooth,
            headerShown
        );
    }, [hash, noSmooth, headerShown]);
}
