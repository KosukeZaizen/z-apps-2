import { makeStyles, Theme } from "@material-ui/core";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useEffect, useState } from "react";
import { useScreenSize } from "../../../../../../../common/hooks/useScreenSize";
import { User } from "../../../../../../../common/hooks/useUser";
import { BasicRanking } from "../../../../../zApps/parts/Ranking/LevelRanking/BasicRanking/BasicRanking";
import { UserForRanking } from "../../../../../zApps/parts/Ranking/LevelRanking/types";
import { OpenableCard } from "../OpenableCard";

export function RankingAroundMe({ user: player }: { user: User }) {
    const [users, setUsers] = useState<UserForRanking[]>([]);
    const [myRank, setMyRank] = useState(0);
    const [open, setOpen] = useState(false);
    const { screenWidth } = useScreenSize();

    useEffect(() => {
        fetchUsersAroundMyRank(player.userId).then(({ users, myRank }) => {
            setUsers(users);
            setMyRank(myRank);
        });
    }, [player]);

    const c = useStyles({ screenWidth });

    return (
        <OpenableCard
            title={`Ranking: ${myRank}`}
            icon={<TrendingUpIcon />}
            saveKey="MypageUserRankingAroundMe"
            open={open}
            setOpen={setOpen}
            alwaysShowIcon
            alwaysShowTitle
        >
            <div className={c.container}>
                <div className={c.rankingWrapper}>
                    <BasicRanking users={users} />
                </div>
            </div>
        </OpenableCard>
    );
}
const useStyles = makeStyles<Theme, { screenWidth: number }>({
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
    rankingWrapper: ({ screenWidth }) => ({
        width: "calc(100% - 5px)",
        marginBottom:
            screenWidth > 480
                ? undefined
                : Math.max(-35, -(480 - screenWidth) / 2),
    }),
});

async function fetchUsersAroundMyRank(
    userId: number
): Promise<{ users: UserForRanking[]; myRank: number }> {
    const res = await fetch(`api/User/GetUsersAroundMyRank?userId=${userId}`);
    return res.json();
}
