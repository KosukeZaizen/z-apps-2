import { Button, Card, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";

export function CenterDialog({
    open,
    transitionMilliseconds = 0,
    style,
    children,
    onClose,
    withoutCloseButton,
}: {
    open: boolean;
    transitionMilliseconds?: number;
    style?: CSSProperties;
    children: ReactNode;
    onClose?: () => void;
    withoutCloseButton?: boolean;
}) {
    const c = useResultDialogStyles();

    const [isContentShown, setIsContentShown] = useState(false);

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

    if (!open && !isContentShown) {
        return null;
    }
    const isCompletelyOpened = open && isContentShown;

    return (
        <div
            className={spaceBetween(
                c.darkLayer,
                isCompletelyOpened ? c.opacity1 : c.opacity0,
                "cancelCenter"
            )}
            style={{
                transitionDuration: `${transitionMilliseconds}ms`,
            }}
            onClick={onClose}
        >
            <Card className={c.card} style={style}>
                {!withoutCloseButton && (
                    <Button
                        variant="contained"
                        className={c.closeButton}
                        style={{
                            marginLeft: "auto",
                            marginTop: 3,
                            marginRight: 3,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon className={c.closeIcon} />
                    </Button>
                )}
                {children}
            </Card>
        </div>
    );
}

const useResultDialogStyles = makeStyles(({ palette }) => ({
    darkLayer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transitionProperty: "opacity",
    },
    opacity0: { opacity: 0 },
    opacity1: { opacity: 1 },
    card: {
        width: "100%",
        maxWidth: 350,
        height: "100%",
        maxHeight: 350,
        backgroundColor: "white",
        borderRadius: 16,
    },
    closeButton: {
        borderRadius: "50%",
        maxWidth: 28,
        maxHeight: 28,
        minWidth: 28,
        minHeight: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: palette.success.main,
        "&:hover": {
            backgroundColor: palette.success.light,
        },
        color: "white",
        lineHeight: 1,
        marginLeft: "auto",
        marginTop: 3,
        marginRight: 3,
        padding: 0,
    },
    closeIcon: { width: 20, height: 20 },
}));
