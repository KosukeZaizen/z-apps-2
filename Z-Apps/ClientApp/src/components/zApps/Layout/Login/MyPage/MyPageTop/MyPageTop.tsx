import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import RunningIcon from "@material-ui/icons/DirectionsRun";
import { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeAppState } from "../../../../../../common/appState";
import { useScreenSize } from "../../../../../../common/hooks/useScreenSize";
import { User, useUser } from "../../../../../../common/hooks/useUser";
import { ApplicationState } from "../../../../../../store/configureStore";
import * as vocabStore from "../../../../../../store/VocabQuizStore";
import { FullScreenShurikenProgress } from "../../../../../shared/Animations/ShurikenProgress";
import { Link } from "../../../../../shared/Link/LinkWithYouTube";
import { useOpenState, useStyles } from "../../SignUp/SignUp";
import { SignInPanelState } from "../../types";
import { OpenableCard } from "../components/OpenableCard";
import { RankingAroundMe } from "../components/RankingAroundMe/RankingAroundMe";
import { XpProgressArea } from "../components/XpProgressBar";
import { AvatarField } from "../Fields/AvatarField";
import { BioField } from "../Fields/BioField";
import { UsernameField } from "../Fields/UsernameField";
import { clearLocalStorageData } from "../progressManager";
import "../style.css";
import { useProgress } from "../useProgress";
import { InitialView } from "./types";

export function MyPageTop({
    chosen,
    panelClosed,
    panelState,
}: {
    chosen: boolean;
    panelClosed: boolean;
    panelState: SignInPanelState;
}) {
    const { partiallyOpened, completelyOpened } = useOpenState(chosen);
    const c = useContainerStyles({ panelClosed, completelyOpened, chosen });
    if (!partiallyOpened) {
        return null;
    }

    return (
        <Container component="div" className={c.container} key="MyPageTop">
            <Content
                initialView={
                    panelState.type === "myPageTop"
                        ? panelState.initialView
                        : undefined
                }
            />
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

function Content({ initialView }: { initialView?: InitialView }) {
    const classes = useStyles();
    const contentClasses = contentStyles();
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

            <RankingAroundMe user={user} initialView={initialView} />
            <Progress initialView={initialView} />

            <Button
                onClick={logout}
                fullWidth
                className={contentClasses.logoutButton}
            >
                Logout
            </Button>
        </div>
    );
}
const contentStyles = makeStyles(({ palette }) => ({
    logoutButton: {
        marginTop: 25,
        backgroundColor: palette.grey[800],
        "&:hover": {
            backgroundColor: palette.grey[700],
        },
        color: "white",
    },
}));

function ProfileCard({ user }: { user: User }) {
    const c = useStatusCardStyles();

    return (
        <div className={c.card}>
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
        </div>
    );
}
const useStatusCardStyles = makeStyles({
    card: {
        width: "100%",
        fontSize: "large",
        margin: "0 0 5px",
        padding: "0 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
});

function logout() {
    if (!confirm("Do you really want to logout?")) {
        return;
    }

    changeAppState("signInPanelState", { type: "signIn" });

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

type CardsOuterProps = { initialView?: InitialView };
type CardsInnerProps = CardsOuterProps &
    vocabStore.IVocabQuizState &
    vocabStore.ActionCreators;

const Progress = connect(
    (state: ApplicationState) => state.vocabQuiz,
    dispatch => bindActionCreators(vocabStore.actionCreators, dispatch)
)(function ({ loadAllGenres, allGenres, initialView }: CardsInnerProps) {
    const {
        hiraganaProgress,
        katakanaProgress,
        vocabProgress,
        kanjiProgress,
        actionGameProgress,
    } = useProgress(loadAllGenres, allGenres);

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

    const [open, setOpen] = useState(false);

    return (
        <OpenableCard
            title={`Progress: ${totalProgress}%`}
            icon={<RunningIcon />}
            saveKey="MyPageProgressPercentageCard"
            id="MyPageProgressPercentageCard"
            open={open}
            setOpen={setOpen}
            initiallyOpenedId={initialView}
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
    changeAppState("signInPanelState", { type: "close" });
};
