import Card from "@material-ui/core/Card";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useRef } from "react";
import { sleepAsync } from "../../../../../../../common/functions";
import { User } from "../../../../../../../common/hooks/useUser";
import { EllipsisLabel } from "../../../../../../shared/EllipsisLabel/EllipsisLabel";
import { UserAvatar } from "../../../../../../shared/User/UserAvatar/UserAvatar";
import { UserForRanking } from "../types";

export function BasicRankingRecord({
    user,
    rank,
    player,
    scrollableContainer,
    collapseOpen,
}: {
    user: UserForRanking;
    rank: number;
    player?: User;
    scrollableContainer: HTMLDivElement | null;
    collapseOpen: boolean;
}) {
    const isMyself = user.userId === player?.userId;
    const c = useStyles({ isMyself });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isMyself && collapseOpen) {
            // Wait until Collapse opens
            sleepAsync(700).then(() => {
                if (!ref.current || !scrollableContainer) {
                    return;
                }
                scrollableContainer.scrollTo({
                    top: ref.current.offsetTop - 4,
                    behavior: "smooth",
                });
            });
        }
    }, [player, user, scrollableContainer, collapseOpen]);

    return (
        <Card className={c.card} ref={ref}>
            <div className={c.rankAndAvatar}>
                <div className={c.rank}>{rank}.</div>
                <UserAvatar user={user} colorNumber={rank} size={40} />
            </div>
            <div className={c.nameAndLevel}>
                <div className={c.name}>
                    <EllipsisLabel title={user.name} placement="top" />
                </div>
                <div className={c.level}>Lv. {user.level}</div>
            </div>
        </Card>
    );
}

const useStyles = makeStyles<Theme, { isMyself: boolean }>(({ palette }) => ({
    card: ({ isMyself }) => ({
        margin: 5,
        display: "flex",
        padding: 5,
        height: 50,
        border: isMyself ? "solid" : undefined,
        fontWeight: isMyself ? "bold" : undefined,
        borderColor: isMyself ? palette.primary.main : undefined,
    }),
    rankAndAvatar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 20,
        minWidth: 73,
    },
    rank: { marginRight: 10 },
    nameAndLevel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
    },
    name: { flex: 3, overflow: "hidden", paddingRight: 20 },
    level: {
        flex: 1,
        textAlign: "left",
        marginRight: 10,
        whiteSpace: "nowrap",
    },
}));
