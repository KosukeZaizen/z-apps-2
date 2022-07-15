import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { useEffect, useState } from "react";
import { BasicRankingRecord } from "./BasicRankingRecord";
import { TopRankingRecord } from "./TopRankingRecord";
import { UserForRanking } from "./types";

export function LevelRanking({ screenWidth }: { screenWidth: number }) {
    const c = useStyles();
    const [users, setUsers] = useState<UserForRanking[]>([]);
    useEffect(() => {
        fetchUsersForRanking().then(u => {
            setUsers(u);
        });
    }, []);

    const isWide = screenWidth > 991;
    const isVeryWide = screenWidth > 1199;

    const [user1, user2, user3, ...normalUsers] = users;
    const topUsers = user3 ? [user1, user2, user3] : [];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: isWide ? "row" : "column",
                marginTop: 15,
            }}
        >
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
    );
}

const useStyles = makeStyles(theme => ({
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
    return [
        {
            userId: 21,
            name: "ざいぜんこうすけざいぜんこうすけあいうえ",
            level: 52,
            xp: 1200,
            avatarPath: "",
        },
        {
            userId: 9,
            name: "abcdefghijklmnopqrst",
            level: 50,
            xp: 930,
            avatarPath: "",
        },
        { userId: 11, name: "Jane", level: 49, xp: 800, avatarPath: "" },
        { userId: 15, name: "Kim", level: 47, xp: 700, avatarPath: "" },
        { userId: 22, name: "Kai", level: 46, xp: 610, avatarPath: "" },
        {
            userId: 45,
            name: "ざいぜんこうすけざいぜんこうすけあいうえ",
            level: 46,
            xp: 600,
            avatarPath: "",
        },
        {
            userId: 1,
            name: "abcdefghijklmnopqrst",
            level: 3,
            xp: 300,
            avatarPath: "",
        },
        { userId: 35, name: "AJ", level: 2, xp: 120, avatarPath: "" },
        { userId: 132, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 133, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 134, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 135, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 136, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 137, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 138, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 139, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 140, name: "Atom", level: 2, xp: 110, avatarPath: "" },
        { userId: 141, name: "Atom", level: 2, xp: 110, avatarPath: "" },
    ];
}
