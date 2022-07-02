import { useEffect, useState } from "react";
import { changeAppState, useAppState } from "../../../../common/appState";
import { RightPanel } from "../../../shared/Panel/RightPanel";
import { MyPageTop } from "./MyPage/MyPageTop";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp/SignUp";

export type SignInPanelState = "signIn" | "signUp" | "myPageTop" | "close";

export const signInPanelWidth = 500;

export default function SignInPanel() {
    const [panelState, setIsPanelOpen] = useAppState("signInPanelState");
    return (
        <RightPanel
            open={panelState !== "close"}
            onClose={() => {
                setIsPanelOpen("close");
            }}
            panelWidth={signInPanelWidth}
        >
            <PanelContent type={panelState} />
        </RightPanel>
    );
}

function PanelContent({ type }: { type: SignInPanelState }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user] = useAppState("user");

    useEffect(() => {
        if (type === "signUp" || type === "signIn") {
            if (user) {
                // If already logged in, open my page
                changeAppState("signInPanelState", "myPageTop");
            }
        }
    }, [user, type]);

    const panelClosed = type === "close";

    return (
        <div style={{ position: "relative" }}>
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
            />
        </div>
    );
}
