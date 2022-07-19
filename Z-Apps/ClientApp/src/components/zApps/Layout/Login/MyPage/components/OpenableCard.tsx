import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { ReactNode, useEffect, useState } from "react";
import { sleepAsync } from "../../../../../../common/functions";
import "../style.css";

export function OpenableCard({
    children,
    buttonMessage = "Detail",
    title,
    icon,
    saveKey: _saveKey,
}: {
    children: ReactNode;
    buttonMessage?: string;
    title: string;
    icon: ReactNode;
    saveKey: string;
}) {
    const saveKey = "OpenableCard-status-" + _saveKey;
    const [open, setOpen] = useState(false);
    const [isTitleShown, setTitleShown] = useState(!open);

    const c = useOpenableCardStyles({ open, isTitleShown });

    const closeCollapse = () => {
        if (open) {
            // To close the Collapse
            setOpen(false);
            sleepAsync(500).then(() => {
                setTitleShown(true);
            });
        }
    };
    const openCollapse = () => {
        if (!open) {
            // To open the Collapse
            setOpen(true);
            setTitleShown(false);
        }
    };

    useEffect(() => {
        const previousStatus = localStorage.getItem(saveKey);
        if (!previousStatus) {
            return;
        }

        if (previousStatus === "open") {
            openCollapse();
            return;
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(saveKey, open ? "open" : "close");
    }, [open]);

    return (
        <Card className={c.card} onClick={openCollapse}>
            <div className={c.closedContainer}>
                <div className={c.title}>{title}</div>
                <div className={c.buttonsContainer}>
                    <Button
                        variant="contained"
                        className={c.iconButton}
                        onClick={closeCollapse}
                    >
                        {icon}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={c.button}
                        onClick={closeCollapse}
                    >
                        {open ? <CloseIcon /> : buttonMessage}
                    </Button>
                </div>
            </div>

            <Collapse in={open} timeout={500} style={{ paddingTop: 10 }}>
                {children}
            </Collapse>
        </Card>
    );
}
const useOpenableCardStyles = makeStyles<
    Theme,
    { open: boolean; isTitleShown: boolean }
>(({ palette }) => ({
    card: ({ open, isTitleShown }) => ({
        height: open || !isTitleShown ? undefined : 40,
        width: "100%",
        fontSize: "large",
        margin: "10px 0",
        padding: open ? 30 : 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 500ms",
        position: "relative",
        cursor: open ? undefined : "pointer",
    }),
    closedContainer: ({ open, isTitleShown }) => ({
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        top: open || !isTitleShown ? 7 : undefined,
        right: 0,
        width: "100%",
    }),
    title: ({ isTitleShown }) => ({
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "large",
        opacity: isTitleShown ? 1 : 0,
        transition: "all 300ms",
    }),
    buttonsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        right: 5,
        width: "calc(100% - 10px)",
    },
    button: ({ open }) => ({
        backgroundColor: open ? palette.grey[800] : undefined,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: open ? 30 : undefined,
        minWidth: open ? 30 : undefined,
        maxHeight: 30,
        minHeight: 30,
        transition: "all 500ms",
    }),
    iconButton: ({ open }) => ({
        backgroundColor: palette.grey[800],
        color: "white",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        transition: "background-color 200ms, opacity 500ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
        opacity: open ? 0 : 1,
        lineHeight: 1,
    }),
}));
