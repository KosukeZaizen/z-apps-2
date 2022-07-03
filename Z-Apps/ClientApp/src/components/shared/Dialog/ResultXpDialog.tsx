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

    return (
        <CenterDialog open={open} onClose={onClose}>
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

                <ExpectedLevelCard />
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

function ExpectedLevelCard() {
    const c = useExpectedLevelCard();

    const [xpBeforeSignUp] = useAppState("xpBeforeSignUp");

    const [expectedLevel, setExpectedLevel] = useState(1);
    useEffect(() => {
        fetchLevelFromXp(xpBeforeSignUp).then(lvl => {
            setExpectedLevel(lvl);
        });
    }, [xpBeforeSignUp]);

    return (
        <Card className={spaceBetween("small", c.card)}>
            Now you have {xpBeforeSignUp} XP, and you'll be Lv.{expectedLevel}{" "}
            if you make an account.
        </Card>
    );
}
const useExpectedLevelCard = makeStyles(theme => ({
    card: {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 10,
        padding: 5,
    },
}));

async function fetchLevelFromXp(xp: number): Promise<number> {
    const res = await fetch(`api/User/GetLevelFromXp?xp=${xp}`);
    return res.json();
}
