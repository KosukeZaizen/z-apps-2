import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import RunningIcon from "@material-ui/icons/DirectionsRun";
import { ReactNode, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeAppState } from "../../../../../common/appState";
import { sleepAsync } from "../../../../../common/functions";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { User, useUser } from "../../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../../common/util/Array/spaceBetween";
import { ApplicationState } from "../../../../../store/configureStore";
import * as vocabStore from "../../../../../store/VocabQuizStore";
import { FullScreenShurikenProgress } from "../../../../shared/Animations/ShurikenProgress";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { useOpenState, useStyles } from "../SignUp/SignUp";
import { XpProgressArea } from "./components/XpProgressBar";
import { AvatarField } from "./Fields/AvatarField";
import { BioField } from "./Fields/BioField";
import { UsernameField } from "./Fields/UsernameField";
import { clearLocalStorageData } from "./progressManager";
import "./style.css";
import { useProgress } from "./useProgress";

export function MyPageTop({
    chosen,
    panelClosed,
}: {
    chosen: boolean;
    panelClosed: boolean;
}) {
    const { partiallyOpened, completelyOpened } = useOpenState(chosen);
    const c = useContainerStyles({ panelClosed, completelyOpened, chosen });
    if (!partiallyOpened) {
        return null;
    }

    return (
        <Container component="div" className={c.container} key="MyPageTop">
            <Content />
        </Container>
    );
}
const useContainerStyles = makeStyles<
    Theme,
    { panelClosed: boolean; completelyOpened: boolean; chosen: boolean }
>({
    container: ({ panelClosed, completelyOpened, chosen }) => ({
        position: "absolute",
        right: panelClosed || completelyOpened ? 0 : chosen ? 600 : -600,
        transition: "all 500ms",
    }),
});

function Content() {
    const classes = useStyles();
    const { screenHeight } = useScreenSize();
    const { user } = useUser();

    if (!user) {
        return (
            <FullScreenShurikenProgress
                style={{ height: screenHeight - 106 }}
            />
        );
    }

    return (
        <div className={classes.paper}>
            <ProfileCard user={user} />
            <Progress />
            <button
                className="btn btn-dark btn-block logoutButton"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
}

function OpenableCard({
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
                        size="small"
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
    }),
}));

function ProfileCard({ user }: { user: User }) {
    const c = useStatusCardStyles();

    return (
        <Card className={spaceBetween("progressCard", c.card)}>
            <AvatarField user={user} />

            <UsernameField user={user} />

            <table className="progressTable">
                <tbody>
                    <tr>
                        <td className="bold x-large">{"Japanese Level:"}</td>
                        <td className="alignRight total">{user.level}</td>
                    </tr>
                </tbody>
            </table>
            <XpProgressArea />

            <BioField user={user} />
        </Card>
    );
}
const useStatusCardStyles = makeStyles({
    card: {
        width: "100%",
        fontSize: "large",
        margin: "10px 0",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
});

function logout() {
    changeAppState("signInPanelState", "signIn");

    fetch("api/Auth/Logout", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    changeAppState("user", undefined);
    clearLocalStorageData();
}

type CardsOuterProps = {};
type CardsInnerProps = CardsOuterProps &
    vocabStore.IVocabQuizState &
    vocabStore.ActionCreators;

const Progress = connect(
    (state: ApplicationState) => state.vocabQuiz,
    dispatch => bindActionCreators(vocabStore.actionCreators, dispatch)
)(function ({ loadAllGenres, allGenres }: CardsInnerProps) {
    const {
        hiraganaProgress,
        katakanaProgress,
        vocabProgress,
        kanjiProgress,
        actionGameProgress,
    } = useProgress(loadAllGenres, allGenres);

    const c = useStatusCardStyles();

    const tableContents: {
        name: string;
        link: string;
        progress: string;
    }[] = [
        {
            name: "Hiragana Quiz:",
            link: "/hiragana-quiz",
            progress: `${hiraganaProgress}%`,
        },
        {
            name: "Katakana Quiz:",
            link: "/katakana-quiz",
            progress: `${katakanaProgress}%`,
        },
        {
            name: "Vocab Quiz:",
            link: "/vocabulary-quiz",
            progress: `${vocabProgress}%`,
        },
        {
            name: "Kanji Quiz:",
            link: "/kanji-quiz",
            progress: `${kanjiProgress}%`,
        },
        {
            name: "Action Game:",
            link: "/ninja",
            progress: `${actionGameProgress}/3`,
        },
    ];

    const totalProgress = Math.floor(
        (hiraganaProgress + katakanaProgress + vocabProgress + kanjiProgress) /
            4
    );

    return (
        <OpenableCard
            title={`Progress: ${totalProgress}%`}
            icon={<RunningIcon />}
            saveKey="MypageProgressCard"
        >
            <h2 className="progressTitle">{"Your Progress"}</h2>

            <table className="progressTable">
                <tbody>
                    <tr className="totalTr">
                        <td className="bold x-large">{"Total:"}</td>
                        <td className="alignRight total">{totalProgress}%</td>
                    </tr>
                    {tableContents.map(c => (
                        <tr key={c.name}>
                            <td>{c.name}</td>
                            <td className="alignRight">
                                <Link to={c.link} onClick={onClickProgressLink}>
                                    {c.progress}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </OpenableCard>
    );
});
const onClickProgressLink = () => {
    changeAppState("signInPanelState", "close");
};
