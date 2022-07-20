import { makeStyles } from "@material-ui/core/styles";
import { Location } from "history";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardText from "reactstrap/lib/CardText";
import CardTitle from "reactstrap/lib/CardTitle";
import { bindActionCreators } from "redux";
import { ARTICLES_URL } from "../../../common/consts";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import { cFetch } from "../../../common/util/cFetch";
import "../../../css/Home.css";
import { ApplicationState } from "../../../store/configureStore";
import * as vocabStore from "../../../store/VocabQuizStore";
import { Page } from "../../Articles/Articles";
import { ArticlesList } from "../../Articles/Articles/Top";
import { SeasonAnimation } from "../../shared/Animations/SeasonAnimation";
import { AuthorArea, AuthorName } from "../../shared/Author/Author";
import { Author } from "../../shared/Author/types";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { FolktaleMenu } from "../../shared/FolktaleMenu";
import Helmet from "../../shared/Helmet";
import { ATargetBlank } from "../../shared/Link/ATargetBlank";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { useProgress } from "../Layout/Login/MyPage/useProgress";
import { LevelRanking } from "./parts/Ranking/LevelRanking";

type Props = {
    location: Location;
};

const imgNumber = getImgNumber();

function Home({}: Props) {
    const { screenWidth } = useScreenSize();
    const [articles, setArticles] = useState<Page[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const c = useCardsStyles();
    const hc = useHomeStyles();

    const isWide = screenWidth > 991;

    useEffect(() => {
        fetchArticles(setArticles, setAllAuthors);
    }, []);

    return (
        <div className="home">
            <Helmet
                title="Lingual Ninja - Learn Japanese Online"
                desc="Free applications to learn Japanese, made by Kosuke Zaizen! I hope you enjoy!"
                isHome={true}
            />
            <div className={hc.alignCenter}>
                <h1 className={spaceBetween("whiteShadow", hc.lineHeight1_3)}>
                    Welcome to{" "}
                    <span className="inline-block">Lingual Ninja!</span>
                </h1>

                <CharacterComment
                    screenWidth={screenWidth}
                    imgNumber={imgNumber}
                    comment={
                        <span>
                            Free web app to learn Japanese,
                            <br />
                            made by <AuthorName title="Developer" />.
                            <br />I hope you enjoy!
                        </span>
                    }
                />

                <LevelRanking screenWidth={screenWidth} />

                <div>
                    <Cards isWide={isWide} />

                    <FolktaleMenu screenWidth={screenWidth} />

                    <CharacterComment
                        style={{
                            marginTop: isWide ? -10 : undefined,
                            marginBottom: 20,
                        }}
                        screenWidth={screenWidth}
                        imgNumber={imgNumber - 1 || 3}
                        comment={"Enjoy studying Japanese!"}
                    />

                    <div
                        className={
                            isWide
                                ? hc.wideConvertersContainer
                                : hc.convertersContainer
                        }
                    >
                        <Link to="/kanji-converter" className={c.cardLink}>
                            <Card
                                body
                                inverse
                                color="primary"
                                className="hoverScale05 fullHeight"
                            >
                                <CardTitle className={c.cardTitle}>
                                    Kanji Converter
                                </CardTitle>
                                <CardText className={c.cardText}>
                                    A converter to change Kanji to Hiragana and
                                    Romaji. Use to know how to read Kanji!
                                </CardText>
                                <Button
                                    color="secondary"
                                    className={c.marginTopAuto}
                                >
                                    Try!
                                </Button>
                            </Card>
                        </Link>

                        <Link to="/romaji-converter" className={c.cardLink}>
                            <Card
                                body
                                inverse
                                color="success"
                                className="hoverScale05 fullHeight"
                            >
                                <CardTitle className={c.cardTitle}>
                                    Romaji Converter
                                </CardTitle>
                                <CardText className={c.cardText}>
                                    A converter to change Hiragana and Katakana
                                    to Romaji. Use when you need to know Romaji!
                                </CardText>
                                <Button className={c.marginTopAuto}>
                                    Try!
                                </Button>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
            <AuthorArea
                title="Developer"
                screenWidth={screenWidth}
                hoverScale
            />
            <hr />
            <section className={hc.articlesSection}>
                <h2
                    className={spaceBetween(
                        "markdownH2",
                        hc.articlesAboutJapanTitle
                    )}
                >
                    Articles about Japan
                </h2>
                <ArticlesList
                    titleH={"h3"}
                    articles={articles}
                    screenWidth={screenWidth}
                    allAuthors={allAuthors}
                />
                <div className={hc.moreArticlesContainer}>
                    <ATargetBlank
                        href={ARTICLES_URL}
                        style={{
                            fontSize: "xx-large",
                        }}
                    >
                        {"More articles about Japan >>"}
                    </ATargetBlank>
                </div>
            </section>
            <FB />
            <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
        </div>
    );
}
const useHomeStyles = makeStyles(() => ({
    alignCenter: { textAlign: "center" },
    lineHeight1_3: { lineHeight: "1.3 !important" },
    convertersContainer: {
        display: "flex",
        flexDirection: "column",
    },
    wideConvertersContainer: {
        display: "flex",
        flexDirection: "row",
    },
    articlesSection: {
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 900,
    },
    articlesAboutJapanTitle: { marginBottom: 55, textAlign: "center" },
    moreArticlesContainer: { textAlign: "center", marginBottom: 50 },
}));

async function fetchArticles(
    setArticles: (articles: Page[]) => void,
    setAuthors: (authors: Author[]) => void
) {
    const url = "api/Articles/GetRandomArticles?num=100";
    const response: Response = await cFetch(url);
    const articles: Page[] = await response.json();

    setArticles(articles);

    const authorResponse: Response = await fetch("api/Articles/GetAllAuthors");
    const allAuthors: Author[] = await authorResponse.json();
    setAuthors(allAuthors);
}

type CardsOuterProps = { isWide: boolean };
type CardsInnerProps = CardsOuterProps &
    vocabStore.IVocabQuizState &
    vocabStore.ActionCreators;

const Cards = connect(
    (state: ApplicationState) => state.vocabQuiz,
    dispatch => bindActionCreators(vocabStore.actionCreators, dispatch)
)(function ({ isWide, loadAllGenres, allGenres }: CardsInnerProps) {
    const {
        kanaProgress,
        vocabAndKanjiProgress,
        vocabProgress,
        kanjiProgress,
        actionGameProgress,
    } = useProgress(loadAllGenres, allGenres);

    const c = useCardsStyles();

    return (
        <div className={isWide ? c.wideContainer : c.container}>
            <div className={isWide ? c.wideCardsGroup : c.cardsGroup}>
                <Link to="/hiragana-katakana" className={c.cardLink}>
                    <Card
                        body
                        className={spaceBetween("hoverScale05", c.kanaCard)}
                    >
                        <CardTitle className={c.cardTitle}>
                            Hiragana / Katakana
                        </CardTitle>
                        <CardText className={c.cardText}>
                            A web app to remember Hiragana and Katakana! Let's
                            test your memory of Hiragana and Katakana!
                        </CardText>
                        <div className={c.progressContainer}>
                            {"Your progress:"}
                            <wbr />
                            <span className={c.progressNumber}>
                                {kanaProgress}%
                            </span>
                        </div>
                        <Button color="secondary" className={c.marginTopAuto}>
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link to="/vocabulary-list" className={c.cardLink}>
                    <Card
                        body
                        inverse
                        color="primary"
                        className="hoverScale05 fullHeight"
                    >
                        <CardTitle className={c.cardTitle}>
                            Japanese Vocab List
                        </CardTitle>
                        <CardText className={c.cardText}>
                            Basic Japanese Vocabulary List! Try to memorize all
                            the vocabulary by using the quizzes!
                        </CardText>
                        <div className={c.progressContainer}>
                            {"Your progress:"}
                            <wbr />
                            <span className={c.progressNumber}>
                                {vocabAndKanjiProgress}%
                            </span>
                        </div>
                        <Button color="secondary" className={c.marginTopAuto}>
                            Try!
                        </Button>
                    </Card>
                </Link>
            </div>
            <div className={isWide ? c.wideCardsGroup : c.cardsGroup}>
                <Link to="/vocabulary-quiz" className={c.cardLink}>
                    <Card
                        body
                        inverse
                        color="success"
                        className="hoverScale05 fullHeight"
                    >
                        <CardTitle className={c.cardTitle}>
                            Japanese Vocab Quiz
                        </CardTitle>
                        <CardText className={c.cardText}>
                            A web app to learn basic Japanese vocabulary!
                            {!isWide &&
                                " Try to get a perfect score on all the quizzes!"}
                        </CardText>
                        <div className={c.progressContainer}>
                            {"Your progress:"}
                            <wbr />
                            <span className={c.progressNumber}>
                                {vocabProgress}%
                            </span>
                        </div>
                        <Button className={c.marginTopAuto} color="secondary">
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link to="/kanji-quiz" className={c.cardLink}>
                    <Card
                        body
                        inverse
                        color="danger"
                        className="hoverScale05 fullHeight"
                    >
                        <CardTitle className={c.cardTitle}>
                            Japanese Kanji Quiz
                        </CardTitle>
                        <CardText className={c.cardText}>
                            A web app to learn Japanese Kanji characters!
                            {!isWide &&
                                " Try to get a perfect score on all the quizzes!"}
                        </CardText>
                        <div className={c.progressContainer}>
                            {"Your progress:"}
                            <wbr />
                            <span className={c.progressNumber}>
                                {kanjiProgress}%
                            </span>
                        </div>
                        <Button color="secondary" className={c.marginTopAuto}>
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link to="/ninja" className={c.cardLink}>
                    <Card
                        body
                        className={spaceBetween(
                            "hoverScale05",
                            c.actionGameCard
                        )}
                    >
                        <CardTitle className={c.cardTitle}>
                            Action Game
                        </CardTitle>
                        <CardText className={c.cardText}>
                            Action game! Be a Ninja, and collect the scrolls in
                            Japan!
                            {!isWide &&
                                " Save the village by defeating the enemies!"}
                        </CardText>
                        <div className={c.marginTopAuto}>
                            <div className={c.progressContainer}>
                                {"Your progress:"}
                                <wbr />
                                <span className={c.progressNumber}>
                                    {`${actionGameProgress}/3`}
                                </span>
                            </div>
                            <Button color="secondary fullWidth">Play!</Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
});

const useCardsStyles = makeStyles(() => ({
    container: {
        marginTop: 30,
        marginBottom: 35,
    },
    wideContainer: {
        marginTop: 30,
        marginBottom: 50,
    },
    cardsGroup: {
        display: "flex",
        flexDirection: "column",
    },
    wideCardsGroup: {
        display: "flex",
        flexDirection: "row",
    },
    cardLink: {
        margin: 5,
        flex: 1,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none",
        },
    },
    kanaCard: {
        backgroundColor: "#333",
        borderColor: "#333",
        color: "white",
        height: "100%",
    },
    cardTitle: {
        fontSize: "x-large",
    },
    actionGameCard: {
        backgroundColor: "#333",
        borderColor: "#333",
        color: "white",
        height: "100%",
    },
    cardText: { position: "relative", top: 5 },
    marginTopAuto: { marginTop: "auto" },
    progressNumber: {
        fontWeight: "bold",
        paddingLeft: 7,
        fontSize: "x-large",
    },
    progressContainer: {
        fontSize: "large",
        marginBottom: 25,
    },
}));

function getImgNumber() {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate();
    const mod = todayNumber % 27;
    if (mod > 25) return 2;
    return 1;
}

export default Home;
