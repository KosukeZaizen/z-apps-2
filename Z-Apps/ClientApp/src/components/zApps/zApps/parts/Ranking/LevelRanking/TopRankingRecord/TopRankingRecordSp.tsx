import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import { appsPublicImg } from "../../../../../../../common/consts";
import { UserForRanking } from "../types";
import { UserAvatar } from "../UserAvatar";

export function TopRankingRecordSp({
    user,
    rank,
}: {
    user: UserForRanking;
    rank: number;
}) {
    const c = useStyles();

    return (
        <Card className={c.containerCard}>
            <div className={c.trophyAndAvatar}>
                <Card className={c.trophyContainer}>
                    <img
                        src={`${appsPublicImg}user_ranking/${rank}.png`}
                        className={c.trophyImg}
                    />
                </Card>
                <UserAvatar user={user} rank={rank} size={50} />
            </div>
            <div className={c.nameAndLevelContainer}>
                <div>
                    <div>{user.name}</div>
                    <div>Lv. {user.level}</div>
                </div>
            </div>
        </Card>
    );
}

const useStyles = makeStyles(theme => ({
    containerCard: {
        margin: 5,
        display: "flex",
        padding: 5,
        height: 105,
    },
    trophyAndAvatar: {
        display: "flex",
        alignItems: "center",
        marginRight: 10,
    },
    trophyContainer: {
        height: 95,
        width: 95,
        backgroundColor: theme.palette.grey[200],
        marginLeft: 0,
        marginRight: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    trophyImg: { width: 85, height: 85 },
    nameAndLevelContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        fontSize: "1.3rem",
        wordBreak: "break-all",
        marginRight: 5,
    },
}));
