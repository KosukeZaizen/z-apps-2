import { Collapse, makeStyles, Theme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../../common/hooks/useUser";
import { BasicRankingRecord } from "./BasicRankingRecord";
import { TopRankingRecord } from "./TopRankingRecord";
import { UserForRanking } from "./types";

export function LevelRanking({ screenWidth }: { screenWidth: number }) {
    const isWide = screenWidth > 991;
    const isVeryWide = screenWidth > 1199;
    const c = useStyles({ isWide });
    const { user: player } = useUser();

    const [_users, setUsers] = useState<UserForRanking[]>([]);
    useEffect(() => {
        fetchUsersForRanking().then(u => {
            setUsers(u);
        });
    }, []);

    // When the user update their profile, the ranking will also change
    const users = player
        ? _users.map(u => (u.userId === player.userId ? player : u))
        : _users;

    const [user1, user2, user3, ...normalUsers] = users;
    const topUsers = user3 ? [user1, user2, user3] : [];

    return (
        <Collapse in={users.length > 0} timeout={700}>
            <div className={c.container}>
                <Card className={c.topRankingCard}>
                    {topUsers.map((user, i) => (
                        <TopRankingRecord
                            user={user}
                            rank={i + 1}
                            key={user.userId}
                            isWide={isWide}
                            isVeryWide={isVeryWide}
                        />
                    ))}
                </Card>
                <Card className={c.basicRankingCard}>
                    {normalUsers.map((user, i) => (
                        <BasicRankingRecord
                            user={user}
                            rank={i + 4}
                            key={user.userId}
                        />
                    ))}
                </Card>
            </div>
        </Collapse>
    );
}

const useStyles = makeStyles<Theme, { isWide: boolean }>(theme => ({
    container: ({ isWide }) => ({
        display: "flex",
        flexDirection: isWide ? "row" : "column",
        marginTop: 15,
    }),
    topRankingCard: {
        margin: 5,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        flex: 1,
        fontSize: "large",
        fontWeight: "bold",
    },
    basicRankingCard: {
        margin: 5,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        maxHeight: 335,
        flex: 1,
        fontSize: "large",
        overflowY: "scroll",
    },
}));

async function fetchUsersForRanking(): Promise<UserForRanking[]> {
    const res = await fetch("api/User/GetUsersForRanking");
    return res.json();
}
