import { Card, makeStyles } from "@material-ui/core";
import { ReactNode, useEffect, useState } from "react";
import { changeAppState, useAppState } from "../../../common/appState";
import { useAbTest } from "../../../common/hooks/useAbTest";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { useUser } from "../../../common/hooks/useUser";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../Animations/ShurikenProgress";
import CharacterComment from "../CharacterComment";
import { CenterDialog } from "./CenterDialog";

export function ResultXpDialog({
    open,
    onClose,
    xp,
    topSmallMessage,
    abTestName,
}: {
    open: boolean;
    onClose: () => void;
    xp: number;
    topSmallMessage: ReactNode;
    abTestName: string;
}) {
    const { user, isUserFetchDone } = useUser();

    if (isUserFetchDone && !user) {
        return (
            <ResultXpDialog_GuestUser
                open={open}
                onClose={onClose}
                xp={xp}
                topSmallMessage={topSmallMessage}
                abTestName={abTestName}
            />
        );
    }
    return null;
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
    xp,
    topSmallMessage,
    abTestName,
}: {
    open: boolean;
    onClose: () => void;
    xp: number;
    topSmallMessage: ReactNode;
    abTestName: string;
}) {
    const c = useResultDialogStyles();
    const { screenWidth } = useScreenSize();

    const { user } = useUser();

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

    const [xpBeforeSignUp, setXpBeforeSignUp] = useAppState("xpBeforeSignUp");
    const [expectedLevel, setExpectedLevel] = useState(0);
    useEffect(() => {
        if (open) {
            const nextXpBeforeSignUp = Math.min(xp + xpBeforeSignUp, 5000);

            setXpBeforeSignUp(nextXpBeforeSignUp);
            fetchLevelFromXp(nextXpBeforeSignUp).then(lvl => {
                setExpectedLevel(lvl);
            });
        }
    }, [open, xp]);

    return (
        <CenterDialog
            open={open}
            onClose={onClose}
            transitionMilliseconds={500}
        >
            <div className={c.container}>
                <div>
                    {topSmallMessage}
                    <h2 className="bold">
                        You got <span className={c.xp}>{xp}</span> XP!
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
                        onClick={() => {
                            changeAppState("signInPanelState", "signUp");
                            abTestSuccess();
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

                <ExpectedLevelCard
                    xpBeforeSignUp={xpBeforeSignUp}
                    expectedLevel={expectedLevel}
                />
            </div>
        </CenterDialog>
    );
}
const useResultDialogStyles = makeStyles(theme => ({
    container: {
        margin: "0 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 308,
    },
    xp: { color: theme.palette.secondary.main },
}));

function ExpectedLevelCard({
    xpBeforeSignUp,
    expectedLevel,
}: {
    xpBeforeSignUp: number;
    expectedLevel: number;
}) {
    const c = useExpectedLevelCardStyles();

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
