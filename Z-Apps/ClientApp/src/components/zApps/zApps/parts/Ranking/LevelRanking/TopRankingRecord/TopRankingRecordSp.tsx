import { Avatar } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { appsPublicImg } from "../../../../../../../common/consts";
import { theme } from "../../../../../Layout";
import { UserForRanking } from "../types";

export function TopRankingRecordSp({
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
                    marginRight: 10,
                }}
            >
                <Card
                    style={{
                        height: 95,
                        width: 95,
                        backgroundColor: theme.palette.grey[200],
                        marginLeft: 0,
                        marginRight: 15,
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
                    justifyContent: "center",
                    width: "100%",
                    fontSize: "1.3rem",
                    wordBreak: "break-all",
                    marginRight: 5,
                }}
            >
                <div>
                    <div>{user.name}</div>
                    <div>Lv. {user.level}</div>
                </div>
            </div>
        </Card>
    );
}
