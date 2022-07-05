import { useEffect, useState } from "react";
import { useAppState } from "../appState";
import { useUser } from "./useUser";

let previousFetchedXp: number = 0;
let previousLevelBeforeSignUp: number | undefined = undefined;

export function useLevel() {
    const { user } = useUser();
    const [levelBeforeSignUp, setLevelBeforeSignUp] = useState(
        previousLevelBeforeSignUp
    );
    const [xpBeforeSignUp] = useAppState("xpBeforeSignUp");

    useEffect(() => {
        if (user?.level != null) {
            return;
        }
        if (
            previousFetchedXp !== xpBeforeSignUp ||
            previousLevelBeforeSignUp == null
        ) {
            previousFetchedXp = xpBeforeSignUp;
            fetchLevelForXp(xpBeforeSignUp).then(l => {
                previousLevelBeforeSignUp = l;
                setLevelBeforeSignUp(l);
            });
            return;
        }
        setLevelBeforeSignUp(previousLevelBeforeSignUp);
    }, [user?.level, xpBeforeSignUp]);

    return { level: user?.level ?? levelBeforeSignUp };
}

async function fetchLevelForXp(xp: number) {
    const res = await fetch(`api/User/GetLevelFromXp?xp=${xp}`);
    return res.json();
}
