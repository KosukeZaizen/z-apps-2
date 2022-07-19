import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ReactNode, useState } from "react";
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

function OpenableCard({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isTitleShown, setTitleShown] = useState(!open);

    const c = useOpenableCardStyles({ open, isTitleShown });

    return (
        <Card
            style={{
                width: "100%",
                position: "relative",
            }}
            className={c.card}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "absolute",
                    top: open || !isTitleShown ? 7 : undefined,
                    right: 0,
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "large",
                        opacity: isTitleShown ? 1 : 0,
                    }}
                >
                    Your Progress: 100%
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        position: "absolute",
                        right: 5,
                        width: "100%",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ padding: "3px 8px" }}
                        onClick={() => {
                            if (open) {
                                // To close the Collapse
                                setOpen(false);
                                sleepAsync(500).then(() => {
                                    setTitleShown(true);
                                });
                                return;
                            }
                            // To open the Collapse
                            setOpen(true);
                            setTitleShown(false);
                        }}
                    >
                        Detail
                    </Button>
                </div>
            </div>

            <Collapse in={open} timeout={500}>
                {children}
            </Collapse>
        </Card>
    );
}
const useOpenableCardStyles = makeStyles<
    Theme,
    { open: boolean; isTitleShown: boolean }
>({
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
    }),
});

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
        <OpenableCard>
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
