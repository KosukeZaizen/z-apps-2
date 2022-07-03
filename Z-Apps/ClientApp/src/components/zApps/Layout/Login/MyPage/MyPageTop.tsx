import { Card, LinearProgress, makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeAppState } from "../../../../../common/appState";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { User, useUser } from "../../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../../common/util/Array/spaceBetween";
import { ApplicationState } from "../../../../../store/configureStore";
import * as vocabStore from "../../../../../store/VocabQuizStore";
import { FullScreenShurikenProgress } from "../../../../shared/Animations/ShurikenProgress";
import CharacterComment from "../../../../shared/CharacterComment";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { signInPanelWidth } from "../Panel";
import { useOpenState, useStyles } from "../SignUp/SignUp";
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
    if (!partiallyOpened) {
        return null;
    }

    return (
        <Container
            component="div"
            style={{
                position: "absolute",
                right:
                    panelClosed || completelyOpened ? 0 : chosen ? 600 : -600,
                transition: "all 500ms",
            }}
            key="MyPageTop"
        >
            <Content />
        </Container>
    );
}

function Content() {
    const classes = useStyles();
    const { screenWidth, screenHeight } = useScreenSize();
    const { user } = useUser();

    if (!user) {
        return (
            <FullScreenShurikenProgress
                style={{ height: screenHeight - 106 }}
            />
        );
    }

    const arrUserName = [...user.name];
    const lineNum = Math.ceil(arrUserName.length / 16);
    const charsInOneLine = Math.ceil(arrUserName.length / lineNum);

    return (
        <div className={classes.paper}>
            <CharacterComment
                imgNumber={2}
                screenWidth={Math.min(signInPanelWidth - 58, screenWidth)}
                comment={
                    <div
                        style={{
                            textAlign: "center",
                            padding: "0 8px",
                            fontSize:
                                screenWidth > signInPanelWidth
                                    ? "xx-large"
                                    : "x-large",
                            fontWeight: "bold",
                        }}
                    >
                        Hi{lineNum === 1 ? " " : <br />}
                        {arrUserName.map((c, i) => (
                            <span key={i}>
                                {i > 0 && i % charsInOneLine === 0 && <br />}
                                {c}
                            </span>
                        ))}
                        !
                    </div>
                }
            />
            <LevelCard user={user} />
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

function LevelCard({ user }: { user: User }) {
    const c = useStatusCardStyles();

    return (
        <Card className={spaceBetween("progressCard", c.card)}>
            <h2 className="progressTitle">{"Current Status"}</h2>

            <table className="progressTable">
                <tbody>
                    <tr>
                        <td className="bold x-large">{"Japanese Level:"}</td>
                        <td className="alignRight total">{user.level}</td>
                    </tr>
                </tbody>
            </table>

            <div className="small">Xp: 30/100</div>
            <LinearProgress
                variant="determinate"
                value={(30 / 100) * 100}
                className={c.linearProgress}
            />
        </Card>
    );
}
const useStatusCardStyles = makeStyles(() => ({
    card: {
        width: "100%",
        fontSize: "large",
        margin: "10px 0",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    linearProgress: { width: 210, marginBottom: 10 },
}));

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
        <Card className={spaceBetween("progressCard", c.card)}>
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
        </Card>
    );
});
const onClickProgressLink = () => {
    changeAppState("signInPanelState", "close");
};
