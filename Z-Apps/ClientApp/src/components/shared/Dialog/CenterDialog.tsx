import { Card, makeStyles } from "@material-ui/core";
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
                    <button
                        className="btn btn-success"
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "auto",
                            marginTop: 3,
                            marginRight: 3,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon className={c.closeIcon} />
                    </button>
                )}
                {children}
            </Card>
        </div>
    );
}

const useResultDialogStyles = makeStyles(() => ({
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
        maxWidth: 300,
        height: "100%",
        maxHeight: 300,
        backgroundColor: "white",
        borderRadius: 16,
    },
    closeIcon: { width: 20, height: 20 },
}));
