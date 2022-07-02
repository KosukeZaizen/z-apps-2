import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useRef } from "react";
import LazyLoad from "react-lazyload";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import Button from "reactstrap/lib/Button";
import { bindActionCreators } from "redux";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { ApplicationState } from "../../../../../store/configureStore";
import * as vocabStore from "../../../../../store/VocabQuizStore";
import { vocab, vocabGenre } from "../../../../../types/vocab";
import { SeasonAnimation } from "../../../../shared/Animations/SeasonAnimation";
import ShurikenProgress from "../../../../shared/Animations/ShurikenProgress";
import CharacterComment from "../../../../shared/CharacterComment";
import FB from "../../../../shared/FaceBook";
import { FolktaleMenu } from "../../../../shared/FolktaleMenu";
import { AnchorLink, HashScroll } from "../../../../shared/HashScroll";
import Head from "../../../../shared/Helmet";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { VList } from "../../../../shared/Markdown/ImageRender/VocabList/List";
import "../../../../shared/PleaseScrollDown.css";
import { VocabVideo } from "../../../../shared/YouTubeVideo/VocabVideo";

type Props = vocabStore.IVocabQuizState &
    vocabStore.ActionCreators &
    RouteComponentProps;

const getImgNumber = () => {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate();
    const mod = todayNumber % 27;
    if (mod > 13) return 1;
    if (mod > 5) return 3;
    return 2;
};
const imgNumber = getImgNumber();

function VocabList({
    allVocabs,
    allGenres,
    location,
    loadAllGenres,
    loadAllVocabs,
}: Props) {
    const { screenWidth } = useScreenSize();

    const refForScroll = useRef<HTMLHeadingElement>(null);
    const refForReturnToIndex = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        loadAllGenres();
        loadAllVocabs();
    }, [loadAllGenres, loadAllVocabs]);

    return (
        <div className="center">
            <Head
                title="Japanese Vocabulary List"
                desc={
                    "Free web app to learn Japanese vocabulary! Try to memorize all the vocabulary using the quizzes!"
                }
            />
            <div style={{ maxWidth: 700 }}>
                <Breadcrumbs />
                <h1
                    id="h1title"
                    style={{
                        margin: "25px",
                        lineHeight: screenWidth > 500 ? "45px" : "40px",
                        fontWeight: "bold",
                    }}
                    className="whiteShadow"
                >
                    {"Japanese Vocabulary List"}
                </h1>
                <br />
                <CharacterComment
                    imgNumber={imgNumber}
                    screenWidth={screenWidth}
                    comment={
                        <div
                            style={{
                                textAlign: "left",
                                padding: "0 8px",
                            }}
                        >
                            Free web app to learn Japanese vocabulary!
                            <br />
                            Try to get a perfect score on all the quizzes!
                        </div>
                    }
                />
                <span id="indexOfVocabLists"></span>
                <AllVocabList
                    allVocabs={allVocabs}
                    allGenres={allGenres}
                    criteriaRef={refForScroll}
                    refForReturnToIndex={refForReturnToIndex}
                    screenWidth={screenWidth}
                />
                <hr />
                <FolktaleMenu screenWidth={screenWidth} />
                <br />
                <FB />
                <ReturnToIndex
                    screenWidth={screenWidth}
                    refForReturnToIndex={refForReturnToIndex}
                />
                <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
            </div>
            <HashScroll
                location={location}
                allLoadFinished={allGenres?.length > 0 && allVocabs?.length > 0}
            />
        </div>
    );
}

type TReturnToIndexProps = {
    screenWidth: number;
    refForReturnToIndex: React.RefObject<HTMLElement>;
};
type TReturnToIndexState = {
    showReturnToIndex: boolean;
};
class ReturnToIndex extends React.Component<
    TReturnToIndexProps,
    TReturnToIndexState
> {
    constructor(props: TReturnToIndexProps) {
        super(props);
        this.state = {
            showReturnToIndex: false,
        };

        window.addEventListener("scroll", this.judge);
    }

    componentDidMount() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.judge();
            }, i * 1000);
        }
    }

    componentDidUpdate(previousProps: TReturnToIndexProps) {
        if (
            previousProps.refForReturnToIndex?.current !==
            this.props.refForReturnToIndex?.current
        ) {
            this.judge();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.judge);
    }

    judge = () => {
        const { refForReturnToIndex } = this.props;
        const elem = refForReturnToIndex?.current;
        if (!elem) return;

        const height = window.innerHeight;

        const offsetY = elem.getBoundingClientRect().top;
        const t_position = offsetY - height;

        if (t_position >= 0) {
            // 上側の時
            this.setState({
                showReturnToIndex: false,
            });
        } else {
            // 下側の時
            this.setState({
                showReturnToIndex: true,
            });
        }
    };

    render() {
        const { screenWidth } = this.props;
        const { showReturnToIndex } = this.state;
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    zIndex: showReturnToIndex ? 99999900 : 0,
                    width: `${screenWidth}px`,
                    height: "50px",
                    opacity: showReturnToIndex ? 1.0 : 0,
                    transition: "all 2s ease",
                    fontSize: "large",
                    backgroundColor: "#EEEEEE",
                }}
            >
                <AnchorLink targetHash={`#indexOfVocabLists`}>
                    {"▲ Return to the index ▲"}
                </AnchorLink>
            </div>
        );
    }
}

type TAllVocabListProps = {
    allGenres: vocabGenre[];
    allVocabs: vocab[];
    excludeGenreId?: number;
    criteriaRef?: React.RefObject<HTMLHeadingElement>;
    refForReturnToIndex?: React.RefObject<HTMLHeadingElement>;
    screenWidth: number;
};
function AllVocabList({
    allGenres: vocabGenres,
    allVocabs,
    criteriaRef,
    refForReturnToIndex,
    screenWidth,
}: TAllVocabListProps) {
    return (
        <>
            <hr />
            <div
                style={{
                    border: "5px double #333333",
                    margin: "10px",
                    padding: "10px",
                    backgroundColor: "white",
                }}
                ref={criteriaRef}
            >
                <b>{"Index"}</b>
                <br />
                {vocabGenres && vocabGenres.length > 0 ? (
                    vocabGenres.map((g, idx) => {
                        return (
                            <span key={g.genreId}>
                                <AnchorLink targetHash={`#${g.genreName}`}>
                                    {g.genreName
                                        .split("_")
                                        .map(
                                            t =>
                                                t &&
                                                t[0].toUpperCase() + t.substr(1)
                                        )
                                        .join(" ")}
                                </AnchorLink>
                                {idx !== vocabGenres.length - 1 && " / "}
                            </span>
                        );
                    })
                ) : (
                    <ShurikenProgress key="circle" size="10%" />
                )}
            </div>
            <hr />
            <span ref={refForReturnToIndex}></span>
            {vocabGenres && vocabGenres.length > 0 ? (
                vocabGenres.map(g => {
                    const vocabList = allVocabs?.filter(
                        vl => vl.genreId === g.genreId
                    );
                    return (
                        <EachGenre
                            key={g.genreId}
                            g={g}
                            vocabList={vocabList}
                            screenWidth={screenWidth}
                        />
                    );
                })
            ) : (
                <ShurikenProgress key="circle" size="20%" />
            )}
        </>
    );
}

type TEachGenreProps = {
    g: vocabGenre;
    vocabList: vocab[];
    screenWidth: number;
};
function EachGenre(props: TEachGenreProps) {
    const { g, vocabList, screenWidth } = props;

    const tableHeadStyle: React.CSSProperties = {
        fontSize: "medium",
        fontWeight: "bold",
    };
    const tableElementStyle: React.CSSProperties = {
        fontSize: "medium",
    };
    const vocabPercentage =
        Number(localStorage.getItem(`vocab-quiz-percentage-${g.genreId}`)) || 0;
    const kanjiPercentage =
        Number(localStorage.getItem(`kanji-quiz-percentage-${g.genreId}`)) || 0;

    const savedVocabIds = localStorage.getItem(
        `vocab-quiz-incorrectIds-${g.genreId}`
    );
    const vocabIncorrectIds: number[] | undefined =
        (savedVocabIds && JSON.parse(savedVocabIds)) || undefined;

    const savedKanjiIds = localStorage.getItem(
        `kanji-quiz-incorrectIds-${g.genreId}`
    );
    const kanjiIncorrectIds: number[] | undefined =
        (savedKanjiIds && JSON.parse(savedKanjiIds)) || undefined;

    return (
        <div>
            <h2
                id={g.genreName}
                style={{
                    fontWeight: "bold",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                {"Japanese Vocabulary List for " +
                    g.genreName
                        .split("_")
                        .map(t => t && t[0].toUpperCase() + t.substr(1))
                        .join(" ")}
            </h2>
            <TableContainer component={Paper}>
                <Table
                    aria-label="simple table"
                    style={{ tableLayout: "fixed" }}
                >
                    <TableHead>
                        <TableRow style={{ backgroundColor: "papayawhip" }}>
                            <TableCell style={tableHeadStyle} align="center">
                                Your Vocabulary Score
                            </TableCell>
                            <TableCell style={tableHeadStyle} align="center">
                                Your Kanji Score
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                style={
                                    vocabPercentage === 100
                                        ? {
                                              ...tableElementStyle,
                                              fontWeight: "bold",
                                              color: "green",
                                          }
                                        : tableElementStyle
                                }
                                align="center"
                            >
                                {vocabPercentage + " %"}
                            </TableCell>
                            <TableCell
                                style={
                                    kanjiPercentage === 100
                                        ? {
                                              ...tableElementStyle,
                                              fontWeight: "bold",
                                              color: "green",
                                          }
                                        : tableElementStyle
                                }
                                align="center"
                            >
                                {kanjiPercentage + " %"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={tableElementStyle} align="center">
                                <Link to={`/vocabulary-quiz/${g.genreName}`}>
                                    <Button
                                        color="primary"
                                        className="hoverScale05"
                                    >
                                        {"Try Vocab Quiz"}
                                    </Button>
                                </Link>
                            </TableCell>
                            <TableCell style={tableElementStyle} align="center">
                                <Link to={`/kanji-quiz/${g.genreName}`}>
                                    <Button
                                        color="primary"
                                        className="hoverScale05"
                                    >
                                        {"Try Kanji Quiz"}
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {g.youtube && (
                <LazyLoad>
                    <VocabVideo
                        youtube={g.youtube}
                        genreName={g.genreName}
                        screenWidth={screenWidth}
                        style={{ marginTop: 10, marginBottom: 15 }}
                        pageNameForLog={`vocabList ${g.genreName}`}
                    />
                </LazyLoad>
            )}
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <VList
                    g={g}
                    vocabList={vocabList}
                    vocabIncorrectIds={vocabIncorrectIds}
                    kanjiIncorrectIds={kanjiIncorrectIds}
                />
            </TableContainer>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell style={tableElementStyle} align="center">
                                <Link to={`/vocabulary-quiz/${g.genreName}`}>
                                    <Button color="primary">
                                        {"Try Vocab Quiz"}
                                    </Button>
                                </Link>
                            </TableCell>
                            <TableCell style={tableElementStyle} align="center">
                                <Link to={`/kanji-quiz/${g.genreName}`}>
                                    <Button color="primary">
                                        {"Try Kanji Quiz"}
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
        </div>
    );
}

function Breadcrumbs() {
    return (
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
                    {"Japanese Vocabulary List"}
                </span>
                <meta itemProp="position" content="2" />
            </span>
        </div>
    );
}

export default connect(
    (state: ApplicationState) => state.vocabQuiz,
    dispatch => bindActionCreators(vocabStore.actionCreators, dispatch)
)(VocabList);
