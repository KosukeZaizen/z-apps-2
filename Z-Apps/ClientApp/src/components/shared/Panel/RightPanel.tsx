import { Card } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
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
    style?: CSSProperties;
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

    if (!open && !isContentShown) {
        return null;
    }
    const isCompletelyOpened = open && isContentShown;

    const transitionDuration = `${transitionMilliseconds}ms`;

    return (
        <>
            <div
                style={{
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
                }}
                onClick={onClose}
            />
            <Card
                style={{
                    height: "calc(100% - 30px)",
                    position: "fixed",
                    bottom: 0,
                    right: isCompletelyOpened ? 0 : -(screenWidth + 20),
                    borderRadius: "20px 0 0 0",
                    padding: "38px 0 5px 5px",
                    transitionDuration,
                    transitionProperty: "right",
                    zIndex: 10001,
                    overflow: "hidden",
                    ...style,
                    width: Math.min(screenWidth, panelWidth),
                }}
            >
                <button
                    className="btn btn-success"
                    style={{
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: 5,
                        left: 5,
                    }}
                    onClick={onClose}
                >
                    <CloseIcon style={{ width: 20, height: 20 }} />
                </button>
                <div
                    style={{
                        height: "calc(100% + 5px)",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: 5,
                    }}
                >
                    {children}
                </div>
            </Card>
        </>
    );
}
