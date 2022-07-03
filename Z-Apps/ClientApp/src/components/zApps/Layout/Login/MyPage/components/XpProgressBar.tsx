import { LinearProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../../../common/util/Array/spaceBetween";
import { XpProgress } from "./types";

export function XpProgressArea() {
    const c = useXpProgressStyles();
    const { user } = useUser();

    const [xpProgress, setXpProgress] = useState<XpProgress | null>(null);
    useEffect(() => {
        if (user?.xp) {
            getXpProgress(user.xp).then(x => {
                setXpProgress(x);
            });
        }
    }, [user?.xp]);

    if (!user) {
        return null;
    }

    return (
        <div
            className={spaceBetween(
                c.container,
                xpProgress ? c.width210 : c.width0
            )}
        >
            <div className="small nowrap">
                XP: {xpProgress?.xpProgress}/{xpProgress?.necessaryXp}
            </div>
            <LinearProgress
                variant="determinate"
                value={
                    xpProgress
                        ? 100 * (xpProgress.xpProgress / xpProgress.necessaryXp)
                        : 0
                }
                className={c.linearProgress}
            />
        </div>
    );
}
const useXpProgressStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "width 500ms",
        transitionDelay: "700ms", // For the timing of the panel open
        overflow: "hidden",
    },
    width0: { width: 0 },
    width210: { width: 210 },
    linearProgress: { width: 210, marginBottom: 10 },
}));

async function getXpProgress(xp: number): Promise<XpProgress> {
    const res = await fetch(`api/User/GetXpProgress?xp=${xp}`);
    return res.json();
}
