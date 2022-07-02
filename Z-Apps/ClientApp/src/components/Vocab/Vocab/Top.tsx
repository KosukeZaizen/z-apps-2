import { Card, Collapse, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { debounce } from "../../../common/functions";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { cFetch } from "../../../common/util/cFetch";
import { getRomaji } from "../../../common/util/romajiConvert";
import { vocab, vocabGenre } from "../../../types/vocab";
import { SeasonAnimation } from "../../shared/Animations/SeasonAnimation";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import CharacterComment from "../../shared/CharacterComment";
import Helmet from "../../shared/Helmet";
import { Link } from "../../shared/Link/LinkWithYouTube";

export interface VocabWithRomaji extends vocab {
    romaji: string;
}

type VocabListWithInitial = {
    initial: string;
    vocabList: VocabWithRomaji[];
}[];

const title = "Learn Japanese Vocab from Videos";
const description = [
    "Let's use videos to learn Japanese vocabulary!",
    "You can learn a lot of Japanese words from this website!",
];

const imgNumber = Math.random() > 0.1 ? 1 : 2;

export default function Top() {
    const { screenWidth } = useScreenSize();
    const { allVocabList } = useAllVocabList();
    const { searchWord, filteredVocabList, setSearchWord } =
        useSearchWord(allVocabList);

    return (
        <>
            <Helmet title={title} desc={description.join(" ")} />
            <h1
                style={{ width: "100%", textAlign: "center", margin: "30px 0" }}
            >
                {title}
            </h1>

            <CharacterComment
                comment={
                    <div style={{ marginLeft: 20, fontSize: "large" }}>
                        {[...description, "Please choose a word below!"].map(
                            (d, i) => (
                                <p key={i}>{d}</p>
                            )
                        )}
                    </div>
                }
                screenWidth={screenWidth}
                imgNumber={imgNumber}
            />

            <SearchBox
                searchWord={searchWord}
                setSearchWord={setSearchWord}
                filteredVocabList={filteredVocabList}
            />

            <Collapse in={!searchWord} timeout={700}>
                {allVocabList.length ? (
                    allVocabList.map(vocabWithInitial => {
                        const { initial, vocabList } = vocabWithInitial;
                        return (
                            <Card
                                key={initial}
                                style={{ margin: "20px 0", padding: 20 }}
                            >
                                <h2>
                                    {initial}
                                    {" - "}
                                    {getRomaji(initial)}
                                </h2>
                                <LinkList vocabList={vocabList} />
                            </Card>
                        );
                    })
                ) : (
                    <ShurikenProgress size="20%" style={{ margin: 50 }} />
                )}
            </Collapse>
            <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
        </>
    );
}

function LinkList({ vocabList }: { vocabList: VocabWithRomaji[] }) {
    return (
        <>
            {vocabList.map((v, i) => (
                <span key={`${v.genreId}-${v.vocabId}`}>
                    <Link
                        style={{
                            margin: 5,
                            display: "inline-block",
                            fontSize: "large",
                        }}
                        to={`/${v.hiragana}`}
                    >
                        {v.hiragana}
                        {`(${v.romaji})`}
                    </Link>
                    {i < vocabList.length - 1 && ", "}
                </span>
            ))}
        </>
    );
}

function getColoredWord(str: string, searchWord: string) {
    if (str.includes(searchWord)) {
        return str
            .split(searchWord)
            .join(`<SW>${searchWord}<SW>`)
            .split("<SW>")
            .map((w, i) => {
                if (w === searchWord) {
                    return (
                        <span
                            key={i}
                            style={{
                                backgroundColor: "yellow",
                                fontWeight: "bold",
                            }}
                        >
                            {w}
                        </span>
                    );
                }
                return w;
            });
    }
    return str;
}

function ColoredLinkList({
    vocabList,
    searchWord,
}: {
    vocabList: VocabWithRomaji[];
    searchWord: string;
}) {
    return (
        <>
            {vocabList.map((v, i) => {
                const coloredHiragana = getColoredWord(v.hiragana, searchWord);
                const coloredRomaji = getColoredWord(v.romaji, searchWord);
                return (
                    <span key={`${v.genreId}-${v.vocabId}`}>
                        <Link
                            style={{
                                margin: 5,
                                display: "inline-block",
                                fontSize: "large",
                            }}
                            to={`/${v.hiragana}`}
                        >
                            {coloredHiragana}
                            {"("}
                            {coloredRomaji}
                            {")"}
                        </Link>
                        {i < vocabList.length - 1 && ", "}
                    </span>
                );
            })}
        </>
    );
}

export async function fetchAllVocabList(): Promise<vocab[]> {
    return await (await cFetch("api/VocabQuiz/GetAllVocabs")).json();
}

async function fetchAllGenres(): Promise<vocabGenre[]> {
    return await (await cFetch("api/VocabQuiz/GetAllGenres")).json();
}

function useAllVocabList() {
    const [allVocabList, setAllVocabList] = useState<VocabListWithInitial>([]);

    useEffect(() => {
        (async () => {
            const [vl, allGenres] = await Promise.all([
                fetchAllVocabList(),
                fetchAllGenres(),
            ]);

            const releasedGenres = allGenres.filter(
                g => g.released && g.youtube
            );
            const vocabList = vl.filter(v =>
                releasedGenres.some(g => g.genreId === v.genreId)
            );

            const vocabListWithInitial = vocabList
                .map(v => ({ ...v, romaji: getRomaji(v.hiragana) }))
                .reduce<VocabListWithInitial>((acc, val) => {
                    const initial = val.hiragana.length > 0 && val.hiragana[0];
                    if (initial) {
                        const targetList = acc.find(a => a.initial === initial);
                        if (targetList) {
                            if (
                                targetList.vocabList.some(
                                    v => v.romaji === val.romaji
                                )
                            ) {
                                return acc;
                            } else {
                                return acc.map(a =>
                                    a.initial === initial
                                        ? {
                                              ...a,
                                              vocabList: [...a.vocabList, val],
                                          }
                                        : a
                                );
                            }
                        } else {
                            return [...acc, { initial, vocabList: [val] }];
                        }
                    }
                    return acc;
                }, []);

            vocabListWithInitial.sort((a, b) =>
                a.initial.localeCompare(b.initial, "ja")
            );

            vocabListWithInitial.forEach(v =>
                v.vocabList.sort((a, b) =>
                    a.hiragana.localeCompare(b.hiragana, "ja")
                )
            );

            setAllVocabList(vocabListWithInitial);
        })();
    }, []);

    return { allVocabList };
}

function useSearchWord(allVocabList: VocabListWithInitial) {
    const [searchWord, setSearchWord] = useState("");
    const [filteredVocabList, setFilteredVocabList] = useState<
        VocabWithRomaji[]
    >([]);
    useEffect(() => {
        if (searchWord) {
            setFilteredVocabList(
                allVocabList.reduce<VocabWithRomaji[]>(
                    (acc, vl) => [
                        ...acc,
                        ...vl.vocabList.filter(v =>
                            [v.romaji, v.hiragana, v.kanji].some(w =>
                                w.includes(searchWord)
                            )
                        ),
                    ],
                    []
                )
            );
        } else {
            // Wait until the opacity becomes zero
            setTimeout(() => {
                setFilteredVocabList(
                    allVocabList.map(vl => vl.vocabList).flat()
                );
            }, 300);
        }
    }, [allVocabList, searchWord]);

    return { searchWord, filteredVocabList, setSearchWord };
}

function SearchBox({
    setSearchWord,
    searchWord,
    filteredVocabList,
}: {
    setSearchWord: (word: string) => void;
    searchWord: string;
    filteredVocabList: VocabWithRomaji[];
}) {
    return (
        <Card
            style={{
                fontSize: "x-large",
                margin: "20px 0",
                display: "flex",
                flexDirection: "column",
                padding: 20,
            }}
        >
            <div
                style={{
                    width: "100%",
                    textAlign: "left",
                    marginBottom: 10,
                }}
            >
                <h2>Search for a word</h2>
                <Input
                    placeholder="Type keyword here!"
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        fontSize: "large",
                    }}
                    onChange={ev => {
                        debounce(() => {
                            setSearchWord(ev.target.value.toLowerCase() || "");
                        }, 500)();
                    }}
                />
            </div>
            <Collapse in={!!searchWord} timeout={700}>
                {filteredVocabList.length > 0 ? (
                    <div
                        style={{
                            opacity: searchWord ? 1 : 0,
                            transition: "300ms",
                        }}
                    >
                        <ColoredLinkList
                            searchWord={searchWord}
                            vocabList={filteredVocabList}
                        />
                    </div>
                ) : (
                    <p style={{ color: "red", marginTop: 15 }}>
                        Oops! No match!
                    </p>
                )}
            </Collapse>
        </Card>
    );
}
