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
        if (open) {
            fetchUsersAroundMyRank(player.userId).then(({ users, myRank }) => {
                setUsers(users);
                setMyRank(myRank);
            });
            return;
        }
        fetchMyRank(player.userId).then(myRank => {
            setMyRank(myRank);
        });
    }, [player, open]);

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
            {users.length > 0 && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            width: "calc(100% - 5px)",
                            marginBottom:
                                screenWidth > 480
                                    ? undefined
                                    : Math.max(-35, -(480 - screenWidth) / 2),
                        }}
                    >
                        <BasicRanking users={users} />
                    </div>
                </div>
            )}
        </OpenableCard>
    );
}

async function fetchUsersAroundMyRank(
    userId: number
): Promise<{ users: UserForRanking[]; myRank: number }> {
    const res = await fetch(`api/User/GetUsersAroundMyRank?userId=${userId}`);
    return res.json();
}

async function fetchMyRank(userId: number): Promise<number> {
    const res = await fetch(`api/User/GetMyRank?userId=${userId}`);
    return res.json();
}
