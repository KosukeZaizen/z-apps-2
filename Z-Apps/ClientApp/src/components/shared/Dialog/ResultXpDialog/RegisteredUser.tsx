import { Card, makeStyles } from "@material-ui/core";
import { ReactNode, useEffect, useState } from "react";
import { changeAppState } from "../../../../common/appState";
import { User, useUser } from "../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import { XpProgressArea } from "../../../zApps/Layout/Login/MyPage/components/XpProgressBar";
import { CenterDialog } from "../CenterDialog";
import { AddXpParams, RegisteredUserXpDialogState } from "./types";

export let setRegisteredUserResultDialogState = (
    _state: RegisteredUserXpDialogState
) => {};

export async function addRegisteredUserXp(
    params: Exclude<AddXpParams, "close">,
    user: User
) {
    setRegisteredUserResultDialogState(params);

    // Check isLevelUp
    const { user: newUser, levelUp } = await fetchAddXp(
        params.xpToAdd,
        user.userId
    );
    changeAppState("user", newUser);
    setRegisteredUserResultDialogState({ ...params, isLevelUp: levelUp });
}

export default function ResultXpDialogWrapper() {
    const [_state, setState] = useState<RegisteredUserXpDialogState>("close");
    const open = _state !== "close";
    const { onCloseCallBack, xpToAdd, topSmallMessage, isLevelUp } = open
        ? _state
        : {
              onCloseCallBack: undefined,
              xpToAdd: 0,
              topSmallMessage: "",
              isLevelUp: false,
          };

    useEffect(() => {
        setRegisteredUserResultDialogState = setState;
    }, [setState]);

    return (
        <ResultXpDialog_RegisteredUser
            open={open}
            onClose={() => {
                setRegisteredUserResultDialogState("close");
                onCloseCallBack?.();
            }}
            xpToAdd={xpToAdd}
            topSmallMessage={topSmallMessage}
            isLevelUp={isLevelUp}
        />
    );
}

function ResultXpDialog_RegisteredUser({
    open,
    onClose,
    xpToAdd,
    topSmallMessage,
    isLevelUp,
}: {
    open: boolean;
    onClose: () => void;
    xpToAdd: number;
    topSmallMessage: ReactNode;
    isLevelUp?: boolean;
}) {
    const c = useRegisteredUserResultDialogStyles();
    const { user } = useUser();

    return (
        <CenterDialog
            open={open}
            onClose={onClose}
            transitionMilliseconds={300}
        >
            <div className={c.container}>
                {isLevelUp && (
                    <Card className={spaceBetween("bold nowrap", c.levelUp)}>
                        LEVEL UP!
                    </Card>
                )}

                <div>
                    {topSmallMessage}
                    <h2 className="bold">
                        You got <span className={c.xp}>{xpToAdd}</span> XP!
                    </h2>
                </div>

                <Card className={c.progressCard}>
                    <h2 className={c.level}>Level: {user?.level}</h2>
                    <XpProgressArea />
                </Card>

                <div>
                    <button
                        className={"btn btn-dark btn-lg"}
                        style={{ width: 270 }}
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </CenterDialog>
    );
}
const useRegisteredUserResultDialogStyles = makeStyles(theme => ({
    container: {
        margin: "0 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 288,
        position: "relative",
    },
    xp: { color: theme.palette.secondary.main, marginBottom: 0 },
    progressCard: {
        padding: "20px 30px 30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        position: "relative",
        bottom: 5,
    },
    level: {
        marginBottom: 10,
    },
    levelUp: {
        position: "absolute",
        top: -20,
        left: -5,
        backgroundColor: theme.palette.secondary.main,
        color: "white",
        padding: 5,
        transform: "rotate(-15deg)",
    },
}));

async function fetchAddXp(
    xpToAdd: number,
    userId: number
): Promise<{ user: User; levelUp: boolean }> {
    const formData = new FormData();
    formData.append("xpToAdd", xpToAdd.toString());
    formData.append("userId", userId.toString());

    const res = await fetch("api/User/AddXp", {
        method: "POST",
        body: formData,
    });
    return res.json();
}
