import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardTitle from "reactstrap/lib/CardTitle";
import { bindActionCreators } from "redux";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import { ApplicationState } from "../../../../store/configureStore";
import * as vocabStore from "../../../../store/VocabQuizStore";
import { SeasonAnimation } from "../../../shared/Animations/SeasonAnimation";
import { AuthorArea } from "../../../shared/Author";
import CharacterComment from "../../../shared/CharacterComment";
import FB from "../../../shared/FaceBook";
import { FolktaleMenu } from "../../../shared/FolktaleMenu";
import Head from "../../../shared/Helmet";
import { Link } from "../../../shared/Link/LinkWithYouTube";
import "../../../shared/PleaseScrollDown.css";
import AllKanjiList from "../parts/VocabQuiz/AllKanjiList";

type Props = vocabStore.IVocabQuizState &
    vocabStore.ActionCreators &
    RouteComponentProps;

const getImgNumber = () => {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate();
    const mod = todayNumber % 27;
    if (mod > 13) return 3;
    if (mod > 5) return 1;
    return 2;
};
const imgNumber = getImgNumber();

function VocabQuizTop({ allGenres, loadAllGenres }: Props) {
    const { screenWidth } = useScreenSize();

    useEffect(() => {
        loadAllGenres();
    }, [loadAllGenres]);

    return (
        <div className="center">
            <Head
                title="Japanese Kanji Quiz"
                desc={
                    "Free web app to learn Japanese Kanji! Try to get a perfect score on all the quizzes!"
                }
                noindex
            />
            <div style={{ maxWidth: 700 }}>
                <div
                    className="breadcrumbs"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                    style={{ textAlign: "left" }}
                >
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <Link
                            to="/"
                            itemProp="item"
                            style={{
                                marginRight: "5px",
                                marginLeft: "5px",
                            }}
                        >
                            <span itemProp="name">{"Home"}</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </span>
                    {" > "}
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <span
                            itemProp="name"
                            style={{
                                marginRight: "5px",
                                marginLeft: "5px",
                            }}
                        >
                            {"Japanese Kanji Quiz"}
                        </span>
                        <meta itemProp="position" content="2" />
                    </span>
                </div>
                <h1
                    id="h1title"
                    style={{
                        margin: "25px",
                        lineHeight: screenWidth > 500 ? "45px" : "40px",
                        fontWeight: "bold",
                    }}
                    className="whiteShadow"
                >
                    {"Japanese Kanji Quiz"}
                </h1>
                <br />
                <CharacterComment
                    imgNumber={imgNumber}
                    screenWidth={screenWidth}
                    comment={
                        <p>
                            Free web app to learn Japanese Kanji!
                            <br />
                            Try to get a perfect score on all the quizzes!
                        </p>
                    }
                />
                <br />
                <AllKanjiList allGenres={allGenres} />
                <hr />
                <AuthorArea
                    title="Developer"
                    screenWidth={Math.min(screenWidth, 600)}
                />
                <hr />
                <Link to="/vocabulary-list">
                    <button className="btn btn-primary btn-lg btn-block">
                        {"Check All Vocabulary Lists"}
                    </button>
                </Link>
                <hr />
                <Link to={`/vocabulary-quiz`}>
                    <Card
                        body
                        style={{
                            backgroundColor: "#333",
                            borderColor: "#333",
                            color: "white",
                        }}
                    >
                        <CardTitle>Japanese Vocabulary Quiz</CardTitle>
                        <p>
                            Free web app to learn Japanese vocabulary!
                            <br />
                            Try to get a perfect score on all the quizzes!
                        </p>
                        <Button color="secondary">Try Vocabulary Quiz</Button>
                    </Card>
                </Link>
                <hr />
                <FolktaleMenu screenWidth={screenWidth} />
                <br />
                <FB />
                <br />
                <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
            </div>
        </div>
    );
}

export default connect(
    (state: ApplicationState) => state.vocabQuiz,
    dispatch => bindActionCreators(vocabStore.actionCreators, dispatch)
)(VocabQuizTop);
