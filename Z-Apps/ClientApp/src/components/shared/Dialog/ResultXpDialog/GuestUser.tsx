import { Card, makeStyles } from "@material-ui/core";
import { ReactNode, useEffect, useState } from "react";
import {
    changeAppState,
    getAppState,
    useAppState,
} from "../../../../common/appState";
import { useAbTest } from "../../../../common/hooks/useAbTest";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../../Animations/ShurikenProgress";
import CharacterComment from "../../CharacterComment";
import { CenterDialog } from "../CenterDialog";
import { AddXpParams, GuestUserXpDialogState } from "./types";

let setGuestResultDialogState = (_state: GuestUserXpDialogState) => {};

export async function addGuestXp(params: AddXpParams) {
    setGuestResultDialogState({
        ...params,
    });

    const { xpBeforeSignUp } = getAppState();

    const previousXp = xpBeforeSignUp;
    const nextXp = Math.min(params.xpToAdd + xpBeforeSignUp, 5000);

    changeAppState("xpBeforeSignUp", nextXp);

    const [previousLevel, expectedLevel] = await Promise.all([
        fetchLevelFromXp(previousXp),
        fetchLevelFromXp(xpBeforeSignUp),
    ]);

    setGuestResultDialogState({
        ...params,
        previousLevel,
        expectedLevel,
    });
}

export default function ResultXpDialogWrapper() {
    const [_state, setState] = useState<GuestUserXpDialogState>("close");
    const open = _state !== "close";
    const {
        onCloseCallBack,
        xpToAdd,
        topSmallMessage,
        abTestName,
        previousLevel,
        expectedLevel,
    } = open
        ? _state
        : {
              onCloseCallBack: undefined,
              xpToAdd: 0,
              topSmallMessage: "",
              abTestName: "",
              previousLevel: undefined,
              expectedLevel: undefined,
          };

    useEffect(() => {
        setGuestResultDialogState = setState;
    }, [setState]);

    return (
        <ResultXpDialog_GuestUser
            open={open}
            onClose={() => {
                setGuestResultDialogState("close");
                onCloseCallBack?.();
            }}
            xpToAdd={xpToAdd}
            topSmallMessage={topSmallMessage}
            abTestName={abTestName}
            previousLevel={previousLevel}
            expectedLevel={expectedLevel}
        />
    );
}

const btnLabelAbTestKeys = [
    "Create a free account",
    "Free lifetime account",
    "Save your progress",
    "Sign up",
    "Sign in",
    "Lingual Ninja Account",
    "Manage your progress",
    "Check your Japanese level",
    "Sign up free",
    "Sign up for a free account",
];
const charCommentAbTestKeys = [
    "Receive the XP by making a free lifetime account!",
    "Receive the XP by making a Lingual Ninja Account!",
];
const keysSeparator = "__";

function ResultXpDialog_GuestUser({
    open,
    onClose,
    xpToAdd,
    topSmallMessage,
    abTestName,
    previousLevel,
    expectedLevel,
}: {
    open: boolean;
    onClose: () => void;
    xpToAdd: number;
    topSmallMessage: ReactNode;
    abTestName: string;
    previousLevel?: number;
    expectedLevel?: number;
}) {
    const c = useGuestResultDialogStyles();
    const { screenWidth } = useScreenSize();

    const { abTestKey, abTestSuccess } = useAbTest({
        testName: `${abTestName}-ButtonLabel-and-CharacterComment`,
        keys: btnLabelAbTestKeys.flatMap(btnKey =>
            charCommentAbTestKeys.map(
                commentKey => `${btnKey}${keysSeparator}${commentKey}`
            )
        ),
        open,
    });

    const [buttonLabel, characterComment] = abTestKey
        ? abTestKey.split(keysSeparator)
        : [undefined, undefined];

    const isLevelUp =
        previousLevel != null &&
        expectedLevel != null &&
        previousLevel < expectedLevel;

    return (
        <CenterDialog
            open={open}
            onClose={onClose}
            transitionMilliseconds={500}
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

                <CharacterComment
                    imgNumber={1}
                    screenWidth={Math.min(300, screenWidth)}
                    comment={
                        <div className="large">
                            {characterComment || (
                                <ShurikenProgress size="15%" />
                            )}
                        </div>
                    }
                    style={{ margin: 0 }}
                />

                <div>
                    <button
                        className={"btn btn-primary btn-lg"}
                        onClick={ev => {
                            ev.stopPropagation();
                            changeAppState("signInPanelState", "signUp");
                            abTestSuccess();
                            onClose();
                        }}
                    >
                        {buttonLabel || (
                            <ShurikenProgress
                                size="25%"
                                style={{
                                    width: 70,
                                }}
                            />
                        )}
                    </button>
                </div>

                <ExpectedLevelCard expectedLevel={expectedLevel} />
            </div>
        </CenterDialog>
    );
}
const useGuestResultDialogStyles = makeStyles(theme => ({
    container: {
        margin: "0 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 308,
        position: "relative",
    },
    xp: { color: theme.palette.secondary.main },
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

function ExpectedLevelCard({ expectedLevel }: { expectedLevel?: number }) {
    const c = useExpectedLevelCardStyles();
    const [xpBeforeSignUp] = useAppState("xpBeforeSignUp");

    return (
        <Card
            className={spaceBetween(
                "small",
                c.card,
                expectedLevel ? "opacity1" : "opacity0"
            )}
        >
            Now you have {xpBeforeSignUp} XP, and you'll be Lv.{expectedLevel}{" "}
            if you make an account.
        </Card>
    );
}
const useExpectedLevelCardStyles = makeStyles(theme => ({
    card: {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 10,
        padding: 5,
        transition: "500ms",
    },
}));

async function fetchLevelFromXp(xp: number): Promise<number> {
    const res = await fetch(`api/User/GetLevelFromXp?xp=${xp}`);
    return res.json();
}
