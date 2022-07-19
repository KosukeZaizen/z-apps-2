import { changeAppState } from "../../../../../../common/appState";

export function RankingRecordContainer({
    userId,
    children,
}: {
    userId: number;
    children: JSX.Element;
}) {
    return (
        <div
            onClick={() => {
                changeAppState("otherUserPanelState", {
                    targetUserId: userId,
                });
            }}
            className="hoverScale05 pointer"
        >
            {children}
        </div>
    );
}
