import { useEffect, useState } from "react";
import { useAppState } from "../../../../common/appState";
import { sleepAsync } from "../../../../common/functions";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import ShurikenProgress from "../../Animations/ShurikenProgress";
import { RightPanel } from "../../Panel/RightPanel";

type OtherUser = {
    userId: number;
    name: string;
    level: number;
    avatarPath: string;
    bio: string;
};

export default function OtherUserPanel() {
    const [userPanelState, setUserPanelState] = useAppState(
        "otherUserPanelState"
    );

    const [targetUser, setTargetUser] = useState<OtherUser | null>(null);
    useEffect(() => {
        sleepAsync(1000).then(() => {
            setTargetUser({
                userId: 1,
                name: "Kosuke",
                level: 100,
                avatarPath: "",
                bio: "hello!",
            });
        });
    }, [useAppState]);

    return (
        <RightPanel
            open={userPanelState !== "closed"}
            onClose={() => {
                setUserPanelState("closed");
            }}
            panelWidth={1000}
        >
            <Content targetUser={targetUser} />
        </RightPanel>
    );
}

function Content({ targetUser }: { targetUser: OtherUser | null }) {
    const { screenWidth } = useScreenSize();

    if (!targetUser) {
        return <ShurikenProgress size="20%" style={{ marginTop: 100 }} />;
    }
    return <div>{targetUser.name}</div>;
}

