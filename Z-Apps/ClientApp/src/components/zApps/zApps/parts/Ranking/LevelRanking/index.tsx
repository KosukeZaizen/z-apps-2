import { Avatar, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { useEffect, useState } from "react";
import { spaceBetween } from "../../../../../../common/util/Array/spaceBetween";
import { UserForRanking } from "./types";

export function LevelRanking({ screenWidth }: { screenWidth: number }) {
    const c = useStyles();
    const [users, setUsers] = useState<UserForRanking[]>([]);
    useEffect(() => {
        fetchUsersForRanking().then(u => {
            setUsers(u);
        });
    }, []);

    const isWide = screenWidth > 767;

    const { topUsers, normalUsers } = users.reduce(
        ({ topUsers, normalUsers }, user, i) => {
            if (i < 3) {
                return { topUsers: [...topUsers, user], normalUsers };
            }
            return { topUsers, normalUsers: [...normalUsers, user] };
        },
        {
            topUsers: [] as UserForRanking[],
            normalUsers: [] as UserForRanking[],
        }
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: isWide ? "row" : "column",
            }}
        >
            <Card className={spaceBetween("large", c.card)}>
                {topUsers.map((user, i) => (
                    <BasicRankingRecord
                        user={user}
                        rank={i + 1}
                        key={user.userId}
                    />
                ))}
            </Card>
            <Card
                className={spaceBetween(
                    "large",
                    c.card,
                    isWide ? c.marginLeft5 : null
                )}
            >
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
    card: {
        marginTop: 10,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        overflow: "hidden",
        flex: 1,
    },
    marginLeft5: { marginLeft: 5 },
}));

function BasicRankingRecord({
    user,
    rank,
}: {
    user: UserForRanking;
    rank: number;
}) {
    return (
        <Card
            key={user.userId}
            style={{
                margin: 5,
                display: "flex",
                padding: 5,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 10,
                    marginRight: 20,
                }}
            >
                <div style={{ marginRight: 10 }}>{rank}.</div>
                <Avatar>
                    <img
                        src={
                            "https://lingualninja.blob.core.windows.net/lingual-storage/articles/_authors/1.jpg"
                        }
                        style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            objectPosition: "50% 50%",
                        }}
                        alt={user.name}
                        title={user.name}
                    />
                </Avatar>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                }}
            >
                <div style={{ flex: 1 }}>{user.name}</div>
                <div style={{ flex: 1 }}>Lv. {user.level}</div>
            </div>
        </Card>
    );
}

async function fetchUsersForRanking(): Promise<UserForRanking[]> {
    return [
        { userId: 21, name: "taro", level: 12, xp: 1200, avatarPath: "" },
        { userId: 9, name: "Tom", level: 10, xp: 930, avatarPath: "" },
        { userId: 11, name: "Jane", level: 9, xp: 800, avatarPath: "" },
        { userId: 15, name: "Kim", level: 7, xp: 700, avatarPath: "" },
        { userId: 22, name: "Kai", level: 6, xp: 610, avatarPath: "" },
        {
            userId: 45,
            name: "kosuke.zaizen",
            level: 6,
            xp: 600,
            avatarPath: "",
        },
        { userId: 1, name: "TJ", level: 3, xp: 300, avatarPath: "" },
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
