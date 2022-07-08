import Card from "@material-ui/core/Card";
import { useEffect, useState } from "react";
import { UserForRanking } from "./types";

export function LevelRanking({ screenWidth }: { screenWidth: number }) {
    const [users, setUsers] = useState<UserForRanking[]>([]);
    useEffect(() => {
        fetchUsersForRanking().then(u => {
            setUsers(u);
        });
    }, []);

    const isWide = screenWidth > 767;

    return (
        <Card>
            <BasicRanking users={users} />
        </Card>
    );
}

function BasicRanking({ users }: { users: UserForRanking[] }) {
    return (
        <>
            {users.map(u => (
                <Card key={u.userId} style={{ margin: 10 }}>
                    {u.name}
                </Card>
            ))}
        </>
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
    ];
}

