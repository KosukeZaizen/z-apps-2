import { useEffect, useRef, useState } from "react";
import { changeAppState, useAppState } from "../../../../common/appState";
import { RightPanel } from "../../../shared/Panel/RightPanel";
import { MyPageTop } from "./MyPage/MyPageTop/MyPageTop";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp/SignUp";
import { SignInPanelState } from "./types";

export const signInPanelWidth = 500;

export default function SignInPanel() {
    const [panelState, setIsPanelOpen] = useAppState("signInPanelState");
    return (
        <RightPanel
            open={panelState.type !== "close"}
            onClose={() => {
                setIsPanelOpen({ type: "close" });
            }}
            panelWidth={signInPanelWidth}
        >
            <PanelContent panelState={panelState} />
        </RightPanel>
    );
}

function PanelContent({
    panelState: { type },
    panelState,
}: {
    panelState: SignInPanelState;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user] = useAppState("user");

    useEffect(() => {
        if (type === "signUp" || type === "signIn") {
            if (user) {
                // If already logged in, open my page
                changeAppState("signInPanelState", { type: "myPageTop" });
            }
        }
    }, [user, type]);

    const panelClosed = type === "close";

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        containerRef.current?.scrollIntoView(true);
    }, [type]);

    return (
        <div className={"relative"} ref={containerRef}>
            <SignUp
                chosen={type === "signUp"}
                panelClosed={panelClosed}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
            />
            <SignIn
                chosen={type === "signIn"}
                panelClosed={panelClosed}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
            />
            <MyPageTop
                chosen={type === "myPageTop"}
                panelClosed={panelClosed}
                panelState={panelState}
            />
        </div>
    );
}
