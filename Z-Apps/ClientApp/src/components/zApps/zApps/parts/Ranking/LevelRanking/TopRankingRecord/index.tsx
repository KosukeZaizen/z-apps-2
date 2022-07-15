import { UserForRanking } from "../types";
import { TopRankingRecordPc } from "./TopRankingRecordPc";
import { TopRankingRecordSp } from "./TopRankingRecordSp";

export function TopRankingRecord({
    user,
    rank,
    isWide,
    isVeryWide,
}: {
    user: UserForRanking;
    rank: number;
    isWide: boolean;
    isVeryWide: boolean;
}) {
    if (isWide) {
        return (
            <TopRankingRecordPc
                user={user}
                rank={rank}
                isVeryWide={isVeryWide}
            />
        );
    }
    return <TopRankingRecordSp user={user} rank={rank} />;
}
