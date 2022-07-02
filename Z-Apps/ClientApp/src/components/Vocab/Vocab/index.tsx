import { Card } from "@material-ui/core";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { BLOB_URL } from "../../../common/consts";
import { reloadAndRedirect_OneTimeReload } from "../../../common/functions";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { cFetch } from "../../../common/util/cFetch";
import { getRomaji } from "../../../common/util/romajiConvert";
import { vocab, vocabGenre, vocabMergedGenre } from "../../../types/vocab";
import { SeasonAnimation } from "../../shared/Animations/SeasonAnimation";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { Helmet } from "../../shared/Helmet";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { VocabVideo } from "../../shared/YouTubeVideo/VocabVideo";
import { VocabWithRomaji } from "./Top";

interface VocabWithMergedGenre extends VocabWithRomaji {
    mergedGenreName: string;
    youtube: string;
}

const imgNumber = Math.random() > 0.1 ? 1 : 2;

export default function Vocab({
    match: {
        params: { hiragana },
    },
}: RouteComponentProps<{ hiragana: string }>) {
    const {
        targetVocabList,
        genres,
        vocabWithMergedGenre,
        strTitle,
        description,
        nodeTitle,
        capitalRomaji,
    } = useVocabData(hiragana);

    const { screenWidth } = useScreenSize();
    const flexDirection = screenWidth > 760 ? "row" : "column";

    return (
        <>
            <Helmet
                title={strTitle + " | Learn Japanese Vocab from Videos"}
                desc={description.join(" ")}
            />

            <BreadCrumbs title={strTitle} />

            <h1
                style={{ width: "100%", textAlign: "center", margin: "30px 0" }}
            >
                {nodeTitle}
            </h1>

            <CharacterComment
                comment={
                    <div
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: "large",
                        }}
                    >
                        {description.map((d, i) => (
                            <p key={i}>{d}</p>
                        ))}
                    </div>
                }
                screenWidth={screenWidth}
                imgNumber={imgNumber}
            />

            <div style={{ fontSize: "large", textAlign: "center" }}>
                {targetVocabList.length ? (
                    targetVocabList.map(v => {
                        const g = genres.find(g => g.genreId === v.genreId);
                        const genreNamesToShow = g
                            ? g.genreName
                                  .split("_")
                                  .map(
                                      t => t && t[0].toUpperCase() + t.substr(1)
                                  )
                                  .join(" ")
                            : "";
                        const key = `${v.genreId}-${v.vocabId}`;
                        const youtube = g?.youtube;

                        return (
                            <VideoCard
                                key={key}
                                flexDirection={flexDirection}
                                genreNamesToShow={genreNamesToShow}
                                capitalRomaji={capitalRomaji}
                                g={g}
                                v={v}
                                youtube={youtube}
                                screenWidth={screenWidth}
                                genreName={g?.genreName || ""}
                            />
                        );
                    })
                ) : (
                    <ShurikenProgress size="20%" />
                )}

                {vocabWithMergedGenre.map(v => {
                    const g = genres.find(g => g.genreId === v.genreId);
                    const genreNamesToShow = v.mergedGenreName
                        .split("_")
                        .map(t => t && t[0].toUpperCase() + t.substr(1))
                        .join(" ");
                    const key = `${v.mergedGenreName}-${v.genreId}-${v.vocabId}`;
                    const youtube = v.youtube;

                    return (
                        <VideoCard
                            key={key}
                            flexDirection={flexDirection}
                            genreNamesToShow={genreNamesToShow}
                            capitalRomaji={capitalRomaji}
                            g={g}
                            v={v}
                            youtube={youtube}
                            screenWidth={screenWidth}
                            genreName={v.mergedGenreName}
                        />
                    );
                })}
            </div>
            <FB />
            <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
        </>
    );
}

function VideoCard({
    flexDirection,
    genreNamesToShow,
    capitalRomaji,
    g,
    v,
    youtube,
    screenWidth,
    genreName,
}: {
    flexDirection: "column" | "row";
    genreNamesToShow: string;
    capitalRomaji: string;
    g: vocabGenre | undefined;
    v: VocabWithRomaji;
    youtube: string | undefined;
    screenWidth: number;
    genreName: string;
}) {
    return (
        <Card
            style={{
                display: "flex",
                flexDirection,
                alignItems: "center",
                margin: "30px 0",
            }}
        >
            <div
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    margin: 10,
                    padding: "10px 0",
                    display: "inline-flex",
                    flexDirection: "column",
                    textAlign: "left",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: 25,
                    }}
                >
                    {genreNamesToShow}
                </h2>
                <FlexDiv title={"Romaji: "} value={capitalRomaji} />
                <FlexDiv title={"Hiragana: "} value={v.hiragana} />
                <FlexDiv title={"Kanji: "} value={v.kanji} />
                <FlexDiv title={"English: "} value={v.english} />
                <FlexDiv
                    title={"Sound: "}
                    value={g && <Speaker v={v} g={g} />}
                />
            </div>
            <div style={{ flex: 1, width: "100%" }}>
                {youtube && (
                    <VocabVideo
                        youtube={youtube}
                        genreName={genreName}
                        screenWidth={
                            flexDirection === "row"
                                ? screenWidth / 2
                                : screenWidth
                        }
                        pageNameForLog={"LearnVocabFromVideo-" + v.romaji}
                    />
                )}
            </div>
        </Card>
    );
}

async function fetchAllVocabList(): Promise<vocab[]> {
    return await (await cFetch("api/VocabQuiz/GetAllVocabs")).json();
}

async function fetchAllGenres(): Promise<vocabGenre[]> {
    return await (await cFetch("api/VocabQuiz/GetAllGenres")).json();
}

async function fetchAllMergedGenres(): Promise<
    {
        mergedVocabList: vocab[];
        vocabMergedGenre: vocabMergedGenre;
    }[]
> {
    return await (
        await cFetch("api/VocabQuiz/GetAllMergedGenreAndVocab")
    ).json();
}

interface SpeakerProps {
    v: vocab;
    g: vocabGenre;
}
class Speaker extends React.Component<
    SpeakerProps,
    {
        showImg: boolean;
    }
> {
    vocabSound?: HTMLAudioElement;
    didUnmount: boolean;

    constructor(props: SpeakerProps) {
        super(props);

        this.state = {
            showImg: false,
        };

        this.didUnmount = false;
    }

    componentDidMount = () => {
        this.loadSound();
    };

    loadSound = () => {
        const { v, g } = this.props;

        this.vocabSound = new Audio();
        this.vocabSound.preload = "none";
        this.vocabSound.autoplay = false;
        this.vocabSound.src = `${BLOB_URL}/vocabulary-quiz/audio/${g.genreName}/Japanese-vocabulary${v.vocabId}.m4a`;

        this.vocabSound.oncanplaythrough = () => {
            if (!this.didUnmount) this.setState({ showImg: true });
        };
        this.vocabSound.load();
    };

    componentWillUnmount() {
        this.didUnmount = true;
    }

    render() {
        const { showImg } = this.state;
        const { vocabSound } = this;
        return showImg ? (
            <img
                alt="vocab speaker"
                src={BLOB_URL + "/vocabulary-quiz/img/speaker.png"}
                style={{ width: "60%", maxWidth: 30, cursor: "pointer" }}
                onClick={() => {
                    vocabSound && vocabSound.play();
                }}
            />
        ) : (
            <ShurikenProgress
                key="circle"
                size="100%"
                style={{ width: "60%", maxWidth: 30 }}
            />
        );
    }
}

function FlexDiv({ title, value }: { title: ReactNode; value: ReactNode }) {
    return (
        <div style={{ display: "flex", margin: "10px 20px 0" }}>
            <div
                style={{
                    flex: 1,
                    fontWeight: "bold",
                    textAlign: "right",
                    marginRight: 10,
                }}
            >
                {title}
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>{value}</div>
        </div>
    );
}

function getGenreOrder(v: vocab, genres: vocabGenre[]) {
    return genres.find(g => g.genreId === v.genreId)?.order || 0;
}

function BreadCrumbs({ title }: { title: string }) {
    return (
        <div
            className="breadcrumbs"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            style={{ textAlign: "center", fontSize: "large" }}
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
                    {title}
                </span>
                <meta itemProp="position" content="2" />
            </span>
        </div>
    );
}

function useVocabData(hiragana: string) {
    const [targetVocabList, setTargetVocabList] = useState<VocabWithRomaji[]>(
        []
    );
    const [genres, setGenres] = useState<vocabGenre[]>([]);
    const [vocabWithMergedGenre, setVocabWithMergedGenre] = useState<
        VocabWithMergedGenre[]
    >([]);

    useEffect(() => {
        (async () => {
            const pVl = fetchAllVocabList();
            const pGenres = fetchAllGenres();

            // vocab
            const vl = await pVl;
            const targetVl = vl
                .filter(v => v.hiragana === hiragana)
                .map(v => ({ ...v, romaji: getRomaji(v.hiragana) }));

            //genre
            const genres = await pGenres;

            //merged vocab
            const merged = await fetchAllMergedGenres();

            const targetVlToSet = targetVl
                .filter(v =>
                    genres.some(g => g.genreId === v.genreId && g.youtube)
                )
                .sort(
                    (a, b) =>
                        getGenreOrder(a, genres) - getGenreOrder(b, genres)
                );
            const genresToSet = genres.filter(
                g =>
                    g.youtube &&
                    targetVlToSet.some(v => v.genreId === g.genreId)
            );
            if (genresToSet.length <= 0) {
                reloadAndRedirect_OneTimeReload("vocab-video-" + hiragana);
            }

            setTargetVocabList(targetVlToSet);
            setGenres(genresToSet);

            const vmg = merged
                .map(m => {
                    if (!m.vocabMergedGenre.released) {
                        return null;
                    }

                    const mergedVocab = m.mergedVocabList.find(mv =>
                        targetVlToSet.some(
                            v =>
                                v.genreId === mv.genreId &&
                                v.vocabId === mv.vocabId
                        )
                    );
                    if (mergedVocab) {
                        return {
                            mergedGenreName: m.vocabMergedGenre.genreName,
                            youtube: m.vocabMergedGenre.youtube,
                            romaji: getRomaji(mergedVocab.hiragana),
                            ...mergedVocab,
                        };
                    }
                    return null;
                })
                .filter(m => m) as VocabWithMergedGenre[];
            setVocabWithMergedGenre(vmg);
        })();
    }, [hiragana]);

    const romaji = useMemo(() => getRomaji(hiragana), [hiragana]);

    const capitalRomaji = romaji[0].toUpperCase() + romaji.substr(1);
    const strTitle = targetVocabList.length
        ? `${capitalRomaji} (${targetVocabList[0].hiragana})`
        : capitalRomaji;
    const nodeTitle = targetVocabList.length ? (
        <>
            {capitalRomaji}
            <br />
            {`(${targetVocabList[0].hiragana})`}
        </>
    ) : (
        capitalRomaji
    );

    const isOneGenre =
        targetVocabList.length + vocabWithMergedGenre.length === 1;

    const englishWords = targetVocabList
        .map(v => v.english)
        .reduce<string[]>(
            (acc, val) => [
                ...acc,
                ...val
                    .split(", ")
                    .map(en => en.trim())
                    .filter(en => !acc.includes(en)),
            ],
            []
        )
        .map(en => `"${en}"`);

    const englishWordsWithComma =
        englishWords.length === 2
            ? englishWords.join(" and ")
            : englishWords.reduce<string>(
                  (acc, val, i) =>
                      !i
                          ? val // first
                          : i + 1 !== englishWords.length
                          ? `${acc}, ${val}` // middle
                          : `${acc}, and ${val}`, // last
                  ""
              );

    const description = [
        `${strTitle} means ${englishWordsWithComma}!`,
        `Let's use the ${
            isOneGenre ? "video" : "videos"
        } to remember the Japanese word, ${strTitle}!`,
        `Video Category: ${[
            ...genres.map(g => g.genreName),
            ...vocabWithMergedGenre.map(g => g.mergedGenreName),
        ]
            .map(genreName =>
                genreName
                    .split("_")
                    .map(t => t && t[0].toUpperCase() + t.substr(1))
                    .join(" ")
            )
            .join(" / ")}`,
    ].filter(d => d);

    return {
        targetVocabList,
        genres,
        vocabWithMergedGenre,
        strTitle,
        description,
        nodeTitle,
        capitalRomaji,
    };
}
