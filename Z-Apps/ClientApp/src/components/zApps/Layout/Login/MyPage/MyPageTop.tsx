import { Button, Card, makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import PencilIcon from "@material-ui/icons/Create";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeAppState } from "../../../../../common/appState";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { User, useUser } from "../../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../../common/util/Array/spaceBetween";
import { ApplicationState } from "../../../../../store/configureStore";
import * as vocabStore from "../../../../../store/VocabQuizStore";
import { FullScreenShurikenProgress } from "../../../../shared/Animations/ShurikenProgress";
import { UserAvatar } from "../../../../shared/Avatar/UserAvatar";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { Markdown } from "../../../../shared/Markdown";
import { useOpenState, useStyles } from "../SignUp/SignUp";
import { XpProgressArea } from "./components/XpProgressBar";
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

function ProfileCard({ user }: { user: User }) {
    const c = useStatusCardStyles();

    return (
        <Card className={spaceBetween("progressCard", c.card)}>
            <UserAvatar user={user} colorNumber={"noColor"} size={80} />

            <h2 className="progressTitle">{user.name}</h2>

            <table className="progressTable">
                <tbody>
                    <tr>
                        <td className="bold x-large">{"Japanese Level:"}</td>
                        <td className="alignRight total">{user.level}</td>
                    </tr>
                </tbody>
            </table>

            <XpProgressArea />

            <BioArea />
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
}));

function BioArea() {
    const c = useBioAreaStyles();
    const bio = `Hello! I'm **Kosuke**! Nice to meet you!

I hope we can be friends!`;

    return (
        <div style={{ width: "100%", marginTop: 25, position: "relative" }}>
            <Card style={{ padding: 15 }}>
                <Markdown source={bio} />
            </Card>
            <Button variant="contained" className={c.editButton}>
                <PencilIcon style={{ width: 20, height: 20 }} />
            </Button>
        </div>
    );
}
const useBioAreaStyles = makeStyles(({ palette }) => ({
    editButton: {
        backgroundColor: palette.grey[800],
        color: "white",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        position: "absolute",
        bottom: 5,
        right: 5,
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
    },
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
