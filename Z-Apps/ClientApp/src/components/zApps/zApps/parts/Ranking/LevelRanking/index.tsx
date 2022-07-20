import { Collapse, makeStyles, Theme } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../../../../../common/hooks/useUser";
import { BasicRanking } from "./BasicRanking/BasicRanking";
import { TopRanking } from "./TopRanking/TopRanking";
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
    const users = useMemo(() => {
        if (!player) {
            return _users;
        }
        if (_users.some(u => u.userId === player.userId)) {
            return _users
                .map(u => (u.userId === player.userId ? player : u))
                .sort((a, b) => b.xp - a.xp);
        }
        return [..._users, player].sort((a, b) => b.xp - a.xp);
    }, [player, _users]);

    const [user1, user2, user3, ...normalUsers] = users;
    const topUsers = user3 ? [user1, user2, user3] : [];

    return (
        <Collapse in={users.length > 0} timeout={700}>
            <div className={c.container}>
                <TopRanking
                    users={topUsers}
                    isWide={isWide}
                    isVeryWide={isVeryWide}
                />
                <BasicRanking users={normalUsers} player={player} />
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
}));

async function fetchUsersForRanking(): Promise<UserForRanking[]> {
    const res = await fetch("api/User/GetUsersForRanking");
    return res.json();
}
