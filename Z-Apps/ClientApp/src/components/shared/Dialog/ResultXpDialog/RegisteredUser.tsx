import { Card, IconButton, makeStyles, Theme } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";
import { ReactNode, useEffect, useState } from "react";
import { changeAppState } from "../../../../common/appState";
import { sleepAsync } from "../../../../common/functions";
import { User, useUser } from "../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import { XpProgressArea } from "../../../zApps/Layout/Login/MyPage/components/XpProgressBar";
import { CenterDialog } from "../CenterDialog";
import { AddXpParams, RegisteredUserXpDialogState } from "./types";

let setRegisteredUserResultDialogState = (
    _state: RegisteredUserXpDialogState
) => {};

export async function addRegisteredUserXp(params: AddXpParams, user: User) {
    setRegisteredUserResultDialogState(params);

    // Check isLevelUp
    const {
        user: newUser,
        levelUp,
        myRank,
    } = await fetchAddXp(params.xpToAdd, user.userId);
    changeAppState("user", newUser);
    setRegisteredUserResultDialogState({
        ...params,
        isLevelUp: levelUp,
        myRank,
    });
}

const initialState = {
    onCloseCallBack: undefined,
    xpToAdd: 0,
    topSmallMessage: "",
    isLevelUp: false,
};

export default function ResultXpDialogWrapper() {
    const [_state, setState] = useState<RegisteredUserXpDialogState>("close");
    useEffect(() => {
        setRegisteredUserResultDialogState = setState;
    }, [setState]);

    const open = _state !== "close";

    const [lazyState, setLazyState] =
        useState<Exclude<RegisteredUserXpDialogState, "close">>(initialState);

    useEffect(() => {
        if (open) {
            setLazyState(_state);
            return;
        }
        sleepAsync(500).then(() => {
            // Wait until the animation finishes
            setLazyState(initialState);
        });
    }, [_state]);

    const { onCloseCallBack, xpToAdd, topSmallMessage, isLevelUp, myRank } =
        lazyState;

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
            myRank={myRank}
        />
    );
}

function ResultXpDialog_RegisteredUser({
    open,
    onClose,
    xpToAdd,
    topSmallMessage,
    isLevelUp,
    myRank,
}: {
    open: boolean;
    onClose: () => void;
    xpToAdd: number;
    topSmallMessage: ReactNode;
    isLevelUp?: boolean;
    myRank?: number;
}) {
    const c = useRegisteredUserResultDialogStyles({ loaded: !!myRank });
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

                <div className="center">
                    {topSmallMessage}
                    <h2 className="bold">
                        You got <span className={c.xp}>{xpToAdd}</span> XP!
                    </h2>
                </div>

                <Card className={c.progressCard}>
                    <h2 className={c.level}>Level: {user?.level}</h2>
                    <XpProgressArea />
                    <div
                        className={c.rakingContainer}
                        onClick={ev => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            changeAppState("signInPanelState", {
                                type: "myPageTop",
                                initialView: "MyPageUserRankingAroundMe",
                            });
                        }}
                    >
                        {`Your ranking is ${myRank || ""}`}
                        <IconButton className={c.arrowIconButton}>
                            <ArrowForwardIcon className={c.arrowIcon} />
                        </IconButton>
                    </div>
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
const useRegisteredUserResultDialogStyles = makeStyles<
    Theme,
    { loaded: boolean }
>(theme => ({
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
    progressCard: ({ loaded }) => ({
        paddingTop: 20,
        paddingBottom: 22,
        paddingLeft: loaded ? 30 : 0,
        paddingRight: loaded ? 30 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        position: "relative",
        bottom: 5,
        maxWidth: loaded ? 270 : 0,
        transition: "all 700ms",
        overflow: "hidden",
    }),
    level: {
        marginBottom: 10,
        whiteSpace: "nowrap",
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
    rakingContainer: {
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        fontSize: "medium",
        color: theme.palette.primary.main,
        fontWeight: "bold",
        cursor: "pointer",
        transition: "opacity 200ms",
        opacity: 1,
        "&:hover": {
            opacity: 0.7,
        },
        whiteSpace: "nowrap",
    },
    arrowIconButton: {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        width: 10,
        height: 10,
        marginLeft: 5,
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
        },
    },
    arrowIcon: { width: 10, height: 10 },
}));

async function fetchAddXp(
    xpToAdd: number,
    userId: number
): Promise<{ user: User; levelUp: boolean; myRank: number }> {
    const formData = new FormData();
    formData.append("xpToAdd", xpToAdd.toString());
    formData.append("userId", userId.toString());

    const res = await fetch("api/User/AddXp", {
        method: "POST",
        body: formData,
    });
    return res.json();
}
