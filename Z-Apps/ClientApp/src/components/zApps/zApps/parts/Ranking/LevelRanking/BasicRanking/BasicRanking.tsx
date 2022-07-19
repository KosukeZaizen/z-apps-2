import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { RankingRecordContainer } from "../RankingRecordContainer";
import { UserForRanking } from "../types";
import { BasicRankingRecord } from "./BasicRankingRecord";

export function BasicRanking({ users }: { users: UserForRanking[] }) {
    const c = useStyles();
    return (
        <Card className={c.basicRankingCard}>
            {users.map((user, i) => (
                <RankingRecordContainer key={user.userId} userId={user.userId}>
                    <BasicRankingRecord user={user} rank={i + 4} />
                </RankingRecordContainer>
            ))}
        </Card>
    );
}
const useStyles = makeStyles(theme => ({
    basicRankingCard: {
        margin: 5,
        backgroundColor: theme.palette.grey[100],
        height: 335,
        maxHeight: 335,
        flex: 1,
        fontSize: "large",
        overflowY: "scroll",
    },
}));
