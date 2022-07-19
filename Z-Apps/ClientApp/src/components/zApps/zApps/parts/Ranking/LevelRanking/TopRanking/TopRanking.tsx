import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { RankingRecordContainer } from "../RankingRecordContainer";
import { UserForRanking } from "../types";
import { TopRankingRecord } from "./TopRankingRecord";

export function TopRanking({
    users,
    isWide,
    isVeryWide,
}: {
    users: UserForRanking[];
    isWide: boolean;
    isVeryWide: boolean;
}) {
    const c = useStyles();
    return (
        <Card className={c.topRankingCard}>
            {users.map((user, i) => (
                <RankingRecordContainer key={user.userId} userId={user.userId}>
                    <TopRankingRecord
                        user={user}
                        rank={i + 1}
                        isWide={isWide}
                        isVeryWide={isVeryWide}
                    />
                </RankingRecordContainer>
            ))}
        </Card>
    );
}
const useStyles = makeStyles(theme => ({
    topRankingCard: {
        margin: 5,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        flex: 1,
        fontSize: "large",
        fontWeight: "bold",
    },
}));
