import { Avatar, makeStyles, TooltipProps } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { appsPublicImg } from "../../../../../../common/consts";
import { Tooltip } from "../../../../../shared/Tooltip";
import { theme } from "../../../../Layout";
import { UserForRanking } from "./types";

export function LevelRanking({ screenWidth }: { screenWidth: number }) {
    const c = useStyles();
    const [users, setUsers] = useState<UserForRanking[]>([]);
    useEffect(() => {
        fetchUsersForRanking().then(u => {
            u.length = 9;
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
                marginTop: 5,
            }}
        >
            <Card className={c.card}>
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
            <Card className={c.card}>
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
        margin: 5,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        flex: 1,
        fontSize: "large",
    },
}));

function TopRankingRecord({
    user,
    rank,
    isWide,
    isVeryWide,
}: {
    user: UserForRanking;
    rank: number;
    isWide: boolean;
    isVeryWide: boolean;
}) {
    if (isWide) {
        return (
            <TopRankingRecordPc
                user={user}
                rank={rank}
                isVeryWide={isVeryWide}
            />
        );
    }
    return <TopRankingRecordSp user={user} rank={rank} />;
}

function TopRankingRecordPc({
    user,
    rank,
    isVeryWide,
}: {
    user: UserForRanking;
    rank: number;
    isVeryWide: boolean;
}) {
    return (
        <Card
            key={user.userId}
            style={{
                margin: 5,
                display: "flex",
                padding: 5,
                height: 105,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 20,
                }}
            >
                <Card
                    style={{
                        height: 95,
                        width: 95,
                        backgroundColor: theme.palette.grey[200],
                        marginLeft: 0,
                        marginRight: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={`${appsPublicImg}user_ranking/${rank}.png`}
                        style={{ width: 85, height: 85 }}
                    />
                </Card>
                <Avatar style={{ width: 60, height: 60 }}>
                    <img
                        src={
                            "https://lingualninja.blob.core.windows.net/lingual-storage/articles/_authors/1.jpg"
                        }
                        style={{
                            objectFit: "cover",
                            objectPosition: "50% 50%",
                            width: 60,
                            height: 60,
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
                    fontSize: "1.3rem",
                }}
            >
                <div
                    style={{
                        width: isVeryWide ? 200 : 160,
                        overflow: "hidden",
                        paddingRight: 10,
                    }}
                >
                    <EllipsisLabel title={user.name} placement="top" />
                </div>
                <div style={{ width: 80, overflow: "hidden" }}>
                    <EllipsisLabel
                        title={`Lv. ${user.level}`}
                        placement="top"
                        style={{ textAlign: "left" }}
                    />
                </div>
            </div>
        </Card>
    );
}

const EllipsisLabel = ({
    title,
    placement,
    style,
}: {
    title: string;
    placement?: TooltipProps["placement"];
    style?: CSSProperties;
}) => {
    const [isOverflowed, setIsOverflow] = useState(false);
    const textElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // check after every render
        if (textElementRef.current) {
            setIsOverflow(
                textElementRef.current.scrollWidth >
                    textElementRef.current.clientWidth
            );
        }
    });

    return (
        <Tooltip
            title={title}
            disableHoverListener={!isOverflowed}
            placement={placement}
        >
            <div
                ref={textElementRef}
                style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ...style,
                }}
            >
                {title}
            </div>
        </Tooltip>
    );
};

function TopRankingRecordSp({
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
                height: 105,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 20,
                }}
            >
                <Card
                    style={{
                        height: 95,
                        width: 95,
                        backgroundColor: theme.palette.grey[200],
                        marginLeft: 0,
                        marginRight: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={`${appsPublicImg}user_ranking/${rank}.png`}
                        style={{ width: 85, height: 85 }}
                    />
                </Card>
                <Avatar style={{ width: 50, height: 50 }}>
                    <img
                        src={
                            "https://lingualninja.blob.core.windows.net/lingual-storage/articles/_authors/1.jpg"
                        }
                        style={{
                            objectFit: "cover",
                            objectPosition: "50% 50%",
                            width: 50,
                            height: 50,
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
                    fontSize: "1.3rem",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        flex: 1,
                    }}
                >
                    {user.name}
                </div>
                <div style={{ flex: 1 }}>Lv. {user.level}</div>
            </div>
        </Card>
    );
}

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
        {
            userId: 21,
            name: "Taro1234567890123456789",
            level: 12,
            xp: 1200,
            avatarPath: "",
        },
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
