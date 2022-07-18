import Card from "@material-ui/core/Card";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { appsPublicImg } from "../../../../../../../common/consts";
import { EllipsisLabel } from "../../../../../../shared/EllipsisLabel/EllipsisLabel";
import { UserAvatar } from "../../../../../../shared/User/UserAvatar/UserAvatar";
import { UserForRanking } from "../types";

export function TopRankingRecordPc({
    user,
    rank,
    isVeryWide,
}: {
    user: UserForRanking;
    rank: number;
    isVeryWide: boolean;
}) {
    const c = useStyles({ isVeryWide });

    return (
        <Card className={c.containerCard}>
            <div className={c.trophyAndAvatar}>
                <Card className={c.trophyContainer}>
                    <img
                        src={`${appsPublicImg}user_ranking/${rank}.png`}
                        className={c.trophyImg}
                    />
                </Card>
                <UserAvatar user={user} colorNumber={rank} size={60} />
            </div>
            <div className={c.nameAndLevel}>
                <div className={c.name}>
                    <EllipsisLabel title={user.name} placement="top" />
                </div>
                <div className={c.level}>
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

const useStyles = makeStyles<Theme, { isVeryWide: boolean }>(theme => ({
    containerCard: {
        margin: 5,
        display: "flex",
        padding: 5,
        height: 105,
    },
    trophyAndAvatar: {
        display: "flex",
        alignItems: "center",
        marginRight: 20,
    },
    trophyContainer: {
        height: 95,
        width: 95,
        backgroundColor: theme.palette.grey[200],
        marginLeft: 0,
        marginRight: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    trophyImg: { width: 85, height: 85 },
    nameAndLevel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        fontSize: "1.3rem",
    },
    name: ({ isVeryWide }) => ({
        width: isVeryWide ? 200 : 160,
        overflow: "hidden",
        paddingRight: 10,
    }),
    level: { width: 80, overflow: "hidden" },
}));
