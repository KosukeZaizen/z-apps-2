import Card from "@material-ui/core/Card";
import { EllipsisLabel } from "../../../../../shared/EllipsisLabel/EllipsisLabel";
import { UserForRanking } from "./types";
import { UserAvatar } from "./UserAvatar";

export function BasicRankingRecord({
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
                height: 50,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: 10,
                    marginRight: 20,
                    minWidth: 73,
                }}
            >
                <div style={{ marginRight: 10 }}>{rank}.</div>
                <UserAvatar user={user} rank={rank} size={40} />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                }}
            >
                <div style={{ flex: 3, overflow: "hidden", paddingRight: 20 }}>
                    <EllipsisLabel title={user.name} placement="top" />
                </div>
                <div style={{ flex: 1, textAlign: "left", marginRight: 10 }}>
                    Lv. {user.level}
                </div>
            </div>
        </Card>
    );
}
