import Card from "@material-ui/core/Card";
import { appsPublicImg } from "../../../../../../../common/consts";
import { EllipsisLabel } from "../../../../../../shared/EllipsisLabel/EllipsisLabel";
import { theme } from "../../../../../Layout";
import { UserForRanking } from "../types";
import { UserAvatar } from "../UserAvatar";

export function TopRankingRecordPc({
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
                <UserAvatar user={user} rank={rank} size={60} />
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