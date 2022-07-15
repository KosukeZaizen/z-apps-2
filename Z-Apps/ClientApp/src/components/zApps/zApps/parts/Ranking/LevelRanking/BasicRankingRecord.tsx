import { Avatar } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { EllipsisLabel } from "../../../../../shared/EllipsisLabel/EllipsisLabel";
import { UserForRanking } from "./types";

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
