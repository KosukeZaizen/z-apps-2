import { useEffect, useState } from "react";
import { useAppState } from "../appState";
import { useUser } from "./useUser";

let previousFetchedXp: number = 0;

export function useLevel() {
    const { user } = useUser();
    const [levelBeforeSignUp, setLevelBeforeSignUp] = useState(1);
    const [xpBeforeSignUp] = useAppState("xpBeforeSignUp");

    useEffect(() => {
        if (user?.level != null) {
            return;
        }
        if (previousFetchedXp !== xpBeforeSignUp) {
            previousFetchedXp = xpBeforeSignUp;
            fetchLevelForXp(xpBeforeSignUp).then(l => {
                setLevelBeforeSignUp(l);
            });
        }
    }, [user?.level, xpBeforeSignUp]);

    return { level: user?.level ?? levelBeforeSignUp };
}

async function fetchLevelForXp(xp: number) {
    const res = await fetch(`api/User/GetLevelFromXp?xp=${xp}`);
    return res.json();
}
