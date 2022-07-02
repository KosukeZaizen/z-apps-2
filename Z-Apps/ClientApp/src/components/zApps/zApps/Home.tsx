import { Location } from "history";
import { CSSProperties, useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardText from "reactstrap/lib/CardText";
import CardTitle from "reactstrap/lib/CardTitle";
import { bindActionCreators } from "redux";
import { ARTICLES_URL } from "../../../common/consts";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { cFetch } from "../../../common/util/cFetch";
import "../../../css/Home.css";
import { ApplicationState } from "../../../store/configureStore";
import * as vocabStore from "../../../store/VocabQuizStore";
import { Page } from "../../Articles/Articles";
import { ArticlesList } from "../../Articles/Articles/Top";
import { SeasonAnimation } from "../../shared/Animations/SeasonAnimation";
import { Author, AuthorArea, AuthorName } from "../../shared/Author";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { FolktaleMenu } from "../../shared/FolktaleMenu";
import Helmet from "../../shared/Helmet";
import { ATargetBlank } from "../../shared/Link/ATargetBlank";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { useProgress } from "../Layout/Login/MyPage/useProgress";

const cardTitleStyle: CSSProperties = {
    fontSize: "x-large",
};
const cardTextStyle: CSSProperties = { position: "relative", top: 5 };
const cardMargin = 5;

type Props = {
    location: Location;
};

const imgNumber = getImgNumber();

function Home({}: Props) {
    const { screenWidth } = useScreenSize();
    const [articles, setArticles] = useState<Page[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);

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
            <div style={{ textAlign: "center" }}>
                <h1 className="whiteShadow" style={{ lineHeight: 1.3 }}>
                    Welcome to{" "}
                    <span style={{ display: "inline-block" }}>
                        Lingual Ninja!
                    </span>
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
                        style={{
                            display: "flex",
                            flexDirection: isWide ? "row" : "column",
                        }}
                    >
                        <Link
                            to="/kanji-converter"
                            style={{
                                margin: cardMargin,
                                flex: 1,
                                textDecoration: "none",
                            }}
                        >
                            <Card
                                body
                                inverse
                                color="primary"
                                style={{ height: "100%" }}
                                className="hoverScale05"
                            >
                                <CardTitle style={cardTitleStyle}>
                                    Kanji Converter
                                </CardTitle>
                                <CardText style={cardTextStyle}>
                                    A converter to change Kanji to Hiragana and
                                    Romaji. Use to know how to read Kanji!
                                </CardText>
                                <Button
                                    color="secondary"
                                    style={{ marginTop: "auto" }}
                                >
                                    Try!
                                </Button>
                            </Card>
                        </Link>

                        <Link
                            to="/romaji-converter"
                            style={{
                                margin: cardMargin,
                                flex: 1,
                                textDecoration: "none",
                            }}
                        >
                            <Card
                                body
                                inverse
                                color="success"
                                style={{ height: "100%" }}
                                className="hoverScale05"
                            >
                                <CardTitle style={cardTitleStyle}>
                                    Romaji Converter
                                </CardTitle>
                                <CardText style={cardTextStyle}>
                                    A converter to change Hiragana and Katakana
                                    to Romaji. Use when you need to know Romaji!
                                </CardText>
                                <Button style={{ marginTop: "auto" }}>
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
            <section
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: 900,
                }}
            >
                <h2
                    className="markdownH2"
                    style={{ marginBottom: 55, textAlign: "center" }}
                >
                    Articles about Japan
                </h2>
                <ArticlesList
                    titleH={"h3"}
                    articles={articles}
                    screenWidth={screenWidth}
                    allAuthors={allAuthors}
                />
                <div style={{ textAlign: "center", marginBottom: 50 }}>
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

    return (
        <div
            style={{
                marginTop: 30,
                marginBottom: isWide ? 50 : 35,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: isWide ? "row" : "column",
                }}
            >
                <Link
                    to="/hiragana-katakana"
                    style={{
                        margin: cardMargin,
                        flex: 1,
                        textDecoration: "none",
                    }}
                >
                    <Card
                        body
                        style={{
                            backgroundColor: "#333",
                            borderColor: "#333",
                            color: "white",
                            height: "100%",
                        }}
                        className="hoverScale05"
                    >
                        <CardTitle style={cardTitleStyle}>
                            Hiragana / Katakana
                        </CardTitle>
                        <CardText style={cardTextStyle}>
                            A web app to remember Hiragana and Katakana! Let's
                            test your memory of Hiragana and Katakana!
                        </CardText>
                        <div
                            style={{
                                fontSize: "large",
                                marginBottom: 25,
                            }}
                        >
                            {"Your progress:"}
                            <wbr />
                            <span
                                style={{
                                    fontWeight: "bold",
                                    paddingLeft: 7,
                                    fontSize: "x-large",
                                }}
                            >
                                {kanaProgress}%
                            </span>
                        </div>
                        <Button color="secondary" style={{ marginTop: "auto" }}>
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link
                    to="/vocabulary-list"
                    style={{
                        margin: cardMargin,
                        flex: 1,
                        textDecoration: "none",
                    }}
                >
                    <Card
                        body
                        inverse
                        color="primary"
                        style={{ height: "100%" }}
                        className="hoverScale05"
                    >
                        <CardTitle style={cardTitleStyle}>
                            Japanese Vocab List
                        </CardTitle>
                        <CardText style={cardTextStyle}>
                            Basic Japanese Vocabulary List! Try to memorize all
                            the vocabulary by using the quizzes!
                        </CardText>
                        <div
                            style={{
                                fontSize: "large",
                                marginBottom: 25,
                            }}
                        >
                            {"Your progress:"}
                            <wbr />
                            <span
                                style={{
                                    fontWeight: "bold",
                                    paddingLeft: 7,
                                    fontSize: "x-large",
                                }}
                            >
                                {vocabAndKanjiProgress}%
                            </span>
                        </div>
                        <Button color="secondary" style={{ marginTop: "auto" }}>
                            Try!
                        </Button>
                    </Card>
                </Link>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: isWide ? "row" : "column",
                }}
            >
                <Link
                    to="/vocabulary-quiz"
                    style={{
                        margin: cardMargin,
                        flex: 1,
                        textDecoration: "none",
                    }}
                >
                    <Card
                        body
                        inverse
                        color="success"
                        style={{ height: "100%" }}
                        className="hoverScale05"
                    >
                        <CardTitle style={cardTitleStyle}>
                            Japanese Vocab Quiz
                        </CardTitle>
                        <CardText style={cardTextStyle}>
                            A web app to learn basic Japanese vocabulary!
                            {!isWide &&
                                " Try to get a perfect score on all the quizzes!"}
                        </CardText>
                        <div
                            style={{
                                fontSize: "large",
                                marginBottom: 25,
                            }}
                        >
                            {"Your progress:"}
                            <wbr />
                            <span
                                style={{
                                    fontWeight: "bold",
                                    paddingLeft: 7,
                                    fontSize: "x-large",
                                }}
                            >
                                {vocabProgress}%
                            </span>
                        </div>
                        <Button style={{ marginTop: "auto" }} color="secondary">
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link
                    to="/kanji-quiz"
                    style={{
                        margin: cardMargin,
                        flex: 1,
                        textDecoration: "none",
                    }}
                >
                    <Card
                        body
                        inverse
                        color="danger"
                        style={{ height: "100%" }}
                        className="hoverScale05"
                    >
                        <CardTitle style={cardTitleStyle}>
                            Japanese Kanji Quiz
                        </CardTitle>
                        <CardText style={cardTextStyle}>
                            A web app to learn Japanese Kanji characters!
                            {!isWide &&
                                " Try to get a perfect score on all the quizzes!"}
                        </CardText>
                        <div
                            style={{
                                fontSize: "large",
                                marginBottom: 25,
                            }}
                        >
                            {"Your progress:"}
                            <wbr />
                            <span
                                style={{
                                    fontWeight: "bold",
                                    paddingLeft: 7,
                                    fontSize: "x-large",
                                }}
                            >
                                {kanjiProgress}%
                            </span>
                        </div>
                        <Button color="secondary" style={{ marginTop: "auto" }}>
                            Try!
                        </Button>
                    </Card>
                </Link>

                <Link
                    to="/ninja"
                    style={{
                        margin: cardMargin,
                        flex: 1,
                        textDecoration: "none",
                    }}
                >
                    <Card
                        body
                        style={{
                            backgroundColor: "#333",
                            borderColor: "#333",
                            color: "white",
                            height: "100%",
                        }}
                        className="hoverScale05"
                    >
                        <CardTitle style={cardTitleStyle}>
                            Action Game
                        </CardTitle>
                        <CardText style={cardTextStyle}>
                            Action game! Be a Ninja, and collect the scrolls in
                            Japan!
                            {!isWide &&
                                " Save the village by defeating the enemies!"}
                        </CardText>
                        <div style={{ marginTop: "auto" }}>
                            <div
                                style={{
                                    fontSize: "large",
                                    marginBottom: 25,
                                }}
                            >
                                {"Your progress:"}
                                <wbr />
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        paddingLeft: 7,
                                        fontSize: "x-large",
                                    }}
                                >
                                    {`${actionGameProgress}/3`}
                                </span>
                            </div>
                            <Button color="secondary">Play!</Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
});

function getImgNumber() {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate();
    const mod = todayNumber % 27;
    if (mod > 25) return 2;
    return 1;
}

export default Home;
