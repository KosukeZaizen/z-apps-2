import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import { EllipsisLabel } from "../../../../../shared/EllipsisLabel/EllipsisLabel";
import { UserAvatar } from "../../../../../shared/User/UserAvatar/UserAvatar";
import { UserForRanking } from "./types";

export function BasicRankingRecord({
    user,
    rank,
}: {
    user: UserForRanking;
    rank: number;
}) {
    const c = useStyles();

    return (
        <Card className={c.card}>
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

const useStyles = makeStyles(() => ({
    card: {
        margin: 5,
        display: "flex",
        padding: 5,
        height: 50,
    },
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
