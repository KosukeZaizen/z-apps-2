import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import RunningIcon from "@material-ui/icons/DirectionsRun";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeAppState } from "../../../../../common/appState";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { User, useUser } from "../../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../../common/util/Array/spaceBetween";
import { ApplicationState } from "../../../../../store/configureStore";
import * as vocabStore from "../../../../../store/VocabQuizStore";
import { FullScreenShurikenProgress } from "../../../../shared/Animations/ShurikenProgress";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { BasicRanking } from "../../../zApps/parts/Ranking/LevelRanking/BasicRanking/BasicRanking";
import { UserForRanking } from "../../../zApps/parts/Ranking/LevelRanking/types";
import { useOpenState, useStyles } from "../SignUp/SignUp";
import { OpenableCard } from "./components/OpenableCard";
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

            <RankingAroundMe user={user} />
            <Progress />

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
        marginTop: 15,
        backgroundColor: palette.grey[800],
        "&:hover": {
            backgroundColor: palette.grey[700],
        },
        color: "white",
    },
}));

function RankingAroundMe({ user: player }: { user: User }) {
    const [users, setUsers] = useState<UserForRanking[]>([]);
    const [myRank, setMyRank] = useState(0);
    const [open, setOpen] = useState(false);
    const { screenWidth } = useScreenSize();

    useEffect(() => {
        if (open) {
            fetchUsersAroundMyRank(player.userId).then(({ users, myRank }) => {
                setUsers(users);
                setMyRank(myRank);
            });
            return;
        }
        fetchMyRank(player.userId).then(myRank => {
            setMyRank(myRank);
        });
    }, [player, open]);

    return (
        <OpenableCard
            title={`Ranking: ${myRank}`}
            icon={<TrendingUpIcon />}
            saveKey="MypageUserRankingAroundMe"
            open={open}
            setOpen={setOpen}
            alwaysShowIcon
            alwaysShowTitle
        >
            {users.length > 0 && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            width: "calc(100% - 5px)",
                            marginBottom:
                                screenWidth > 480
                                    ? undefined
                                    : Math.max(-35, -(480 - screenWidth) / 2),
                        }}
                    >
                        <BasicRanking users={users} />
                    </div>
                </div>
            )}
        </OpenableCard>
    );
}

async function fetchUsersAroundMyRank(
    userId: number
): Promise<{ users: UserForRanking[]; myRank: number }> {
    const res = await fetch(`api/User/GetUsersAroundMyRank?userId=${userId}`);
    return res.json();
}

async function fetchMyRank(userId: number): Promise<number> {
    const res = await fetch(`api/User/GetMyRank?userId=${userId}`);
    return res.json();
}

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
            saveKey="MypageProgressPercentageCard"
            open={open}
            setOpen={setOpen}
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
