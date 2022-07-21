import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { useRef } from "react";
import { User } from "../../../../../../../common/hooks/useUser";
import { RankingRecordContainer } from "../RankingRecordContainer";
import { UserForRanking } from "../types";
import { BasicRankingRecord } from "./BasicRankingRecord";

export function BasicRanking({
    users,
    player,
    initialRank = 4,
    collapseOpen,
}: {
    users: UserForRanking[];
    player?: User;
    initialRank?: number;
    collapseOpen: boolean;
}) {
    const c = useStyles();
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    return (
        <Card className={c.basicRankingCard} ref={scrollableContainerRef}>
            {users.map((user, i) => (
                <RankingRecordContainer key={user.userId} userId={user.userId}>
                    <BasicRankingRecord
                        user={user}
                        rank={i + initialRank}
                        player={player}
                        scrollableContainer={scrollableContainerRef.current}
                        collapseOpen={collapseOpen}
                    />
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
        position: "relative",
    },
}));
