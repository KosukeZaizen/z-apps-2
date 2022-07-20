import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { ReactNode, useEffect, useRef, useState } from "react";
import { sleepAsync } from "../../../../../../common/functions";
import { spaceBetween } from "../../../../../../common/util/Array/spaceBetween";
import { OpenableCardId } from "../MyPageTop/types";

export function OpenableCard({
    children,
    buttonMessage = "Detail",
    title,
    icon,
    saveKey: _saveKey,
    open,
    setOpen,
    alwaysShowIcon,
    alwaysShowTitle,
    id,
    initiallyOpenedId,
}: {
    children: ReactNode;
    buttonMessage?: string;
    title: string;
    icon: ReactNode;
    saveKey: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    alwaysShowIcon?: boolean;
    alwaysShowTitle?: boolean;
    id: OpenableCardId;
    initiallyOpenedId?: OpenableCardId;
}) {
    const saveKey = "OpenableCard-status-" + _saveKey;
    const [isTitleShown, setTitleShown] = useState(!open);

    const c = useOpenableCardStyles({
        open,
        isTitleShown,
        alwaysShowIcon,
        alwaysShowTitle,
    });

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

    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!cardRef.current || id !== initiallyOpenedId) {
            return;
        }
        cardRef.current.scrollIntoView({ behavior: "smooth" });
        openCollapse();
    }, [id, initiallyOpenedId]);

    return (
        <Card className={c.card} onClick={openCollapse} ref={cardRef}>
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
                        color={"primary"}
                        className={spaceBetween(c.button, "hoverScale05")}
                        onClick={closeCollapse}
                    >
                        {open ? <CloseIcon /> : buttonMessage}
                    </Button>
                </div>
            </div>

            <Collapse in={open} timeout={500} className={c.collapse}>
                {children}
            </Collapse>
        </Card>
    );
}
const useOpenableCardStyles = makeStyles<
    Theme,
    {
        open: boolean;
        isTitleShown: boolean;
        alwaysShowIcon?: boolean;
        alwaysShowTitle?: boolean;
    }
>(({ palette }) => ({
    card: ({ open, isTitleShown }) => ({
        height: open || !isTitleShown ? undefined : 40,
        width: "100%",
        fontSize: "large",
        margin: "5px 0",
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
    title: ({ isTitleShown, alwaysShowTitle }) => ({
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "large",
        opacity: alwaysShowTitle || isTitleShown ? 1 : 0,
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
        backgroundColor: open ? palette.grey[800] : palette.primary.main,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: open ? 30 : undefined,
        minWidth: open ? 30 : undefined,
        maxHeight: 30,
        minHeight: 30,
        transition: "all 500ms",
        "&:hover": {
            backgroundColor: open ? palette.grey[800] : undefined, // To disable the smartphone's too long hover state
        },
    }),
    iconButton: ({ open, alwaysShowIcon }) => ({
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
        opacity: !alwaysShowIcon && open ? 0 : 1,
        lineHeight: 1,
    }),
    collapse: {
        paddingTop: 10,
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
}));
