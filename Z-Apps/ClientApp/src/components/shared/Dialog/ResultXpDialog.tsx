import { Card, makeStyles } from "@material-ui/core";
import { ReactNode } from "react";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import CharacterComment from "../CharacterComment";
import { CenterDialog } from "./CenterDialog";

export function ResultXpDialog({
    open,
    onClose,
    xp,
    topSmallMessage,
    characterComment,
    buttonLabel,
}: {
    open: boolean;
    onClose: () => void;
    score: number;
    maxChar: number;
    xp: number;
    topSmallMessage: ReactNode;
    characterComment: ReactNode;
    buttonLabel: string;
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
                    comment={<div className="large">{characterComment}</div>}
                    style={{ margin: 0 }}
                />

                <div>
                    <button className={"btn btn-primary btn-lg"}>
                        {buttonLabel}
                    </button>
                </div>

                <Card className={spaceBetween("small", c.expectedLevel)}>
                    {
                        "Now you have 120 XP, and you'll be Lv.2 if you make an account."
                    }
                </Card>
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
    expectedLevel: {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 10,
        padding: 5,
    },
    xp: { color: theme.palette.secondary.main },
}));
