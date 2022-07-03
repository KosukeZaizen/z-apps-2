import { Card, makeStyles } from "@material-ui/core";
import { ReactNode, useEffect, useState } from "react";
import { changeAppState, useAppState } from "../../../common/appState";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../Animations/ShurikenProgress";
import CharacterComment from "../CharacterComment";
import { CenterDialog } from "./CenterDialog";

export function ResultXpDialog({
    open,
    onClose,
    xp,
    topSmallMessage,
    characterComment,
    buttonLabel,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    score: number;
    maxChar: number;
    xp: number;
    topSmallMessage: ReactNode;
    characterComment?: ReactNode;
    buttonLabel?: string;
    onSuccess: () => void;
}) {
    const c = useResultDialogStyles();
    const { screenWidth } = useScreenSize();

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
                            onSuccess();
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
