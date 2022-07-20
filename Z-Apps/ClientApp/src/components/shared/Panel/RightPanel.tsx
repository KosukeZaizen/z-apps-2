import { Button, Card, makeStyles, Theme } from "@material-ui/core";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import CloseIcon from "@material-ui/icons/Close";
import { ReactNode, useEffect, useState } from "react";
import { useScreenSize } from "../../../common/hooks/useScreenSize";

export function RightPanel({
    open,
    onClose,
    children,
    style,
    panelWidth,
    transitionMilliseconds = 1000,
}: {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    style?: BaseCSSProperties;
    panelWidth: number;
    transitionMilliseconds?: number;
}) {
    const [isContentShown, setIsContentShown] = useState(false);
    const { screenWidth } = useScreenSize();

    useEffect(() => {
        const { style } = window.document.body;

        if (open && !isContentShown) {
            // when it opens
            style.overflowY = "hidden";
            setTimeout(() => {
                setIsContentShown(open);
            }, 10);
            return;
        }

        if (!open && isContentShown) {
            // when it closes
            style.overflowY = "auto";
            setTimeout(() => {
                setIsContentShown(false);
            }, transitionMilliseconds);
        }
    }, [open, transitionMilliseconds]);

    const isCompletelyOpened = open && isContentShown;
    const transitionDuration = `${transitionMilliseconds}ms`;
    const c = useStyles({
        isCompletelyOpened,
        transitionDuration,
        style,
        screenWidth,
        panelWidth,
    });

    if (!open && !isContentShown) {
        return null;
    }

    return (
        <>
            <div className={c.darkLayer} onClick={onClose} />
            <Card className={c.panel}>
                <Button
                    variant="contained"
                    className={c.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon className={c.closeIcon} />
                </Button>
                <div className={c.childrenContainer}>{children}</div>
            </Card>
        </>
    );
}
const useStyles = makeStyles<
    Theme,
    {
        isCompletelyOpened: boolean;
        transitionDuration: string;
        style?: BaseCSSProperties;
        screenWidth: number;
        panelWidth: number;
    }
>(({ palette }) => ({
    darkLayer: ({ isCompletelyOpened, transitionDuration }) => ({
        zIndex: 10000,
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "black",
        opacity: isCompletelyOpened ? 0.7 : 0,
        width: "100%",
        height: "100%",
        transitionDuration,
        transitionProperty: "opacity",
    }),
    panel: ({
        isCompletelyOpened,
        transitionDuration,
        style,
        screenWidth,
        panelWidth,
    }) => ({
        height: "calc(100% - 30px)",
        position: "fixed",
        bottom: 0,
        right: isCompletelyOpened ? 0 : -(screenWidth + 20),
        borderRadius: "20px 0 0 0",
        padding: "38px 0 0 5px",
        transitionDuration,
        transitionProperty: "right",
        zIndex: 10001,
        overflow: "hidden",
        ...style,
        width: Math.min(screenWidth, panelWidth),
    }),
    closeButton: {
        borderRadius: "50%",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 5,
        left: 5,
        backgroundColor: palette.success.main,
        "&:hover": {
            backgroundColor: palette.success.light,
        },
        color: "white",
    },
    closeIcon: { width: 20, height: 20 },
    childrenContainer: {
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: 5,
    },
}));
