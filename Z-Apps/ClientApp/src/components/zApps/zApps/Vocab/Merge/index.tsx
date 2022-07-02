import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { StopAnimation } from "../../../../../common/animation";
import { BLOB_URL, Z_APPS_TOP_URL } from "../../../../../common/consts";
import { sendPost, shuffle } from "../../../../../common/functions";
import { areSameObjects } from "../../../../../common/util/compareObjects";
import {
    sound,
    vocab,
    vocabGenre,
    vocabMergedGenre,
} from "../../../../../types/vocab";
import Head from "../../../../shared/Helmet";
import { HideFooter } from "../../../../shared/HideHeaderAndFooter/HideFooter";
import {
    getCurrentToken,
    InputRegisterToken,
} from "../../../../shared/InputRegisterToken";

type Props = RouteComponentProps<{ genreName: string }>;
type State = {
    screenWidth: number;
    vocabList: vocab[];
    initialVocabList: vocab[]; // 初期状態との比較用
    vocabMergedGenre?: vocabMergedGenre;
    vocabSounds: { [key: string]: sound };
    allGenres: vocabGenre[];
    showGenrePicker: boolean;
};

class VocabMerge extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            screenWidth: window.innerWidth,
            vocabList: [],
            initialVocabList: [],
            vocabMergedGenre: undefined,
            vocabSounds: {},
            allGenres: [],
            showGenrePicker: false,
        };
    }

    componentDidUpdate(previousProps: Props, previousState: State) {
        const { vocabList, allGenres } = this.state;
        if (previousState.vocabList !== vocabList) {
            this.makeSound(vocabList, allGenres);
        }
    }

    loadVocab = async () => {
        const {
            match: { params },
        } = this.props;
        const genreName: string = params.genreName.toString().split("#")[0];

        const res1 = fetch(`api/VocabQuiz/GetMergedGenreAndVocab/${genreName}`);
        const res2 = fetch("api/VocabQuiz/GetAllGenresForEdit");

        const {
            mergedVocabList,
            vocabMergedGenre,
        }: {
            mergedVocabList: vocab[];
            vocabMergedGenre: vocabMergedGenre;
        } = await (await res1).json();

        const allGenres = await (await res2).json();

        this.makeSound(mergedVocabList, allGenres);

        if (mergedVocabList?.length) {
            const vocabList = mergedVocabList.map(v => {
                v.order *= 10;
                return v;
            });
            this.setState({
                vocabList,
                initialVocabList: [...vocabList],
                vocabMergedGenre,
                allGenres,
            });
        } else {
            const vocabList = [
                {
                    genreId: vocabMergedGenre?.genreId,
                    vocabId: 1,
                    hiragana: "",
                    kanji: "",
                    english: "",
                    order: 10,
                },
            ];
            this.setState({
                vocabList,
                initialVocabList: [...vocabList],
                vocabMergedGenre: vocabMergedGenre,
                allGenres,
            });
        }
    };

    makeSound = (vocabList: vocab[], allGenres: vocabGenre[]) => {
        const vocabSounds: { [key: string]: sound } = {};

        vocabList.length > 0 &&
            vocabList.forEach((v: vocab) => {
                const genreName = allGenres.find(
                    g => g.genreId === v.genreId
                )?.genreName;

                const audio = new window.Audio();
                audio.preload = "none";
                audio.autoplay = false;
                audio.src = `${BLOB_URL}/vocabulary-quiz/audio/${genreName}/Japanese-vocabulary${v.vocabId}.m4a`;
                vocabSounds[getGenreVocabKey(v)] = {
                    audio,
                    playable: false,
                };
            });

        this.setState({ vocabSounds });
    };

    componentDidMount() {
        this.loadVocab();
    }

    getNewVocabOrder = () => {
        const { vocabList } = this.state;
        return Math.max(...vocabList.map(v => v.order)) + 10;
    };

    changeVocab = (
        targetGenreId: number,
        targetVocabId: number,
        value: Partial<vocab>
    ) => {
        const { vocabList } = this.state;
        const targetVocab = vocabList.find(
            v => v.genreId === targetGenreId && v.vocabId === targetVocabId
        );
        if (!targetVocab) {
            return;
        }
        const restVocabList = vocabList.filter(
            v => v.genreId !== targetGenreId || v.vocabId !== targetVocabId
        );
        this.setState({
            vocabList: [...restVocabList, { ...targetVocab, ...value }],
        });
    };

    checkVocabChanged = (v: vocab) => {
        const { initialVocabList } = this.state;
        return !areSameObjects(
            v,
            initialVocabList?.find(vo => compareGenreVocab(vo, v))
        );
    };

    render() {
        const {
            vocabList,
            vocabMergedGenre,
            vocabSounds,
            allGenres,
            showGenrePicker,
        } = this.state;

        const mergedGenreName = vocabMergedGenre?.genreName || "";
        const titleToShowUpper = mergedGenreName
            .split("_")
            .map(t => t && t[0].toUpperCase() + t.substr(1))
            .join(" ");

        return (
            <div>
                <Head noindex />
                <StopAnimation />
                <HideFooter />
                <h1 style={{ marginBottom: 30 }}>{titleToShowUpper}</h1>
                <div
                    style={{
                        marginBottom: 20,
                        width: 500,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Link to={"/vocabularyEdit"}>一覧へ戻る</Link>
                    <Link to={`/vocabularyVideo/${mergedGenreName}`}>
                        Make Video
                    </Link>
                    <button
                        onClick={() => {
                            this.setState({
                                vocabList: shuffle(vocabList).map((v, i) => ({
                                    ...v,
                                    order: (i + 1) * 10,
                                })),
                            });
                        }}
                    >
                        Shuffle
                    </button>
                    <button
                        onClick={() => {
                            const filteredVocabList = vocabList.filter(
                                (v, i) => {
                                    const firstSameVocabIndex =
                                        vocabList.findIndex(
                                            vo =>
                                                v.kanji === vo.kanji &&
                                                v.hiragana === vo.hiragana
                                        );
                                    return firstSameVocabIndex === i;
                                }
                            );
                            this.setState({
                                vocabList: filteredVocabList,
                            });
                        }}
                    >
                        Remove Duplication
                    </button>
                </div>

                <div style={{ marginBottom: 30, fontSize: "large" }}>
                    Count: {vocabList.length}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>{"Source Genre"}</th>
                            <th>{"Order"}</th>
                            <th></th>
                            <th>{"Kanji"}</th>
                            <th>{"Hiragana"}</th>
                            <th>{"English"}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...vocabList]
                            ?.sort((a, b) => a.order - b.order)
                            ?.map(v => {
                                const genreVocabKey = getGenreVocabKey(v);
                                return (
                                    <tr
                                        key={genreVocabKey}
                                        style={{
                                            backgroundColor:
                                                this.checkVocabChanged(v)
                                                    ? "red"
                                                    : undefined,
                                        }}
                                    >
                                        <td>
                                            {
                                                allGenres.find(
                                                    g => g.genreId === v.genreId
                                                )?.genreName
                                            }
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={v.order
                                                    .toString()
                                                    .replace(/^0+/, "")}
                                                style={{ width: 70 }}
                                                onChange={ev => {
                                                    this.changeVocab(
                                                        v.genreId,
                                                        v.vocabId,
                                                        {
                                                            order: Number(
                                                                ev.target.value
                                                            ),
                                                        }
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {vocabSounds[genreVocabKey] && (
                                                <Speaker
                                                    vocabSound={
                                                        vocabSounds[
                                                            genreVocabKey
                                                        ]
                                                    }
                                                    vocabId={v.vocabId}
                                                />
                                            )}
                                        </td>
                                        <td
                                            style={{
                                                width: 200,
                                                border: "solid 1px gray",
                                            }}
                                        >
                                            {v.kanji}
                                        </td>
                                        <td
                                            style={{
                                                width: 200,
                                                border: "solid 1px gray",
                                            }}
                                        >
                                            {v.hiragana}
                                        </td>
                                        <td
                                            style={{
                                                width: 220,
                                                border: "solid 1px gray",
                                            }}
                                        >
                                            {v.english}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        !window.confirm(
                                                            "行削除しますか？"
                                                        )
                                                    ) {
                                                        return;
                                                    }
                                                    this.setState({
                                                        vocabList:
                                                            vocabList.filter(
                                                                vocab =>
                                                                    !compareGenreVocab(
                                                                        v,
                                                                        vocab
                                                                    )
                                                            ),
                                                    });
                                                }}
                                            >
                                                ー
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div style={{ margin: 30 }}>
                    <button
                        onClick={() => {
                            this.setState({
                                showGenrePicker: !showGenrePicker,
                            });
                        }}
                    >
                        {showGenrePicker ? "Close" : "＋"}
                    </button>

                    {showGenrePicker && (
                        <GenrePicker
                            addGenreNames={genreNames => {
                                (async () => {
                                    const vLists = await Promise.all(
                                        genreNames.map(async genreName => {
                                            const res = await fetch(
                                                `api/VocabQuiz/GetQuizDataWithoutCache/${genreName}`
                                            );
                                            const result: {
                                                vocabList: vocab[];
                                            } = await res.json();

                                            return result.vocabList.map(v => ({
                                                ...v,
                                                order:
                                                    1000 * v.genreId + v.order,
                                            }));
                                        })
                                    );

                                    this.setState({
                                        vocabList: [
                                            ...vocabList,
                                            ...vLists.flat(),
                                        ],
                                    });
                                })();
                            }}
                            allGenres={allGenres}
                            close={() => {
                                this.setState({ showGenrePicker: false });
                            }}
                        />
                    )}
                </div>
                <div style={{ border: "solid", padding: 20 }}>
                    <p style={{ fontWeight: "bold" }}>SNS Share</p>
                    <div>{`【${titleToShowUpper}】 Japanese Vocabulary Quiz`}</div>
                    <div>{vocabList.map(v => v.hiragana).join(", ")}</div>
                    <div>{`https://youtu.be/${vocabMergedGenre?.youtube}`}</div>
                </div>
                <YouTubeInfo titleToShowUpper={titleToShowUpper} />
                <div style={{ height: 70 }} />
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "lightyellow",
                        padding: 5,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                            alignItems: "center",
                        }}
                    >
                        <InputRegisterToken
                            style={{ marginBottom: 5, width: "25%" }}
                        />
                        <button
                            onClick={() => {
                                if (vocabMergedGenre?.genreId) {
                                    save(
                                        vocabMergedGenre?.genreId,
                                        vocabList,
                                        () => {
                                            this.loadVocab();
                                        }
                                    );
                                }
                            }}
                            style={{ width: "100%" }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

interface GenrePickerProps {
    addGenreNames: (genreNames: string[]) => void;
    allGenres: vocabGenre[];
    close: () => void;
}
function GenrePicker({ addGenreNames, allGenres, close }: GenrePickerProps) {
    const [checkedGenreNames, setCheckedGenreNames] = useState<string[]>([]);
    const addButton = (
        <button
            style={{ margin: "10px 0" }}
            onClick={() => {
                addGenreNames(checkedGenreNames);
                close();
            }}
        >
            Add checked genres
        </button>
    );
    return (
        <div style={{ border: "solid", padding: 20 }}>
            {addButton}
            <button
                style={{ margin: 10 }}
                onClick={() => {
                    setCheckedGenreNames(allGenres.map(g => g.genreName));
                }}
            >
                Check All
            </button>
            {allGenres.map(g => (
                <div key={g.genreId}>
                    <input
                        name={g.genreName}
                        type="checkbox"
                        checked={checkedGenreNames.includes(g.genreName)}
                        onChange={e => {
                            if (e.target.checked) {
                                if (!checkedGenreNames.includes(g.genreName)) {
                                    setCheckedGenreNames([
                                        ...checkedGenreNames,
                                        g.genreName,
                                    ]);
                                }
                            } else {
                                setCheckedGenreNames(
                                    checkedGenreNames.filter(
                                        name => name !== g.genreName
                                    )
                                );
                            }
                        }}
                        style={{ marginRight: 10 }}
                    />
                    {g.genreName}
                </div>
            ))}
            {addButton}
        </div>
    );
}

async function save(
    mergedGenreId: number,
    vocabList: vocab[],
    fncAfterSaving: () => void
) {
    if (
        !vocabList.every(
            v => v.order && v.kanji && v.hiragana && v.english && v.genreId
        )
    ) {
        alert("空白もしくはゼロを含む行があります。");
        return;
    }

    const duplicatedVocab = vocabList.find(
        v =>
            vocabList.filter(
                vo => v.kanji === vo.kanji && v.hiragana === vo.hiragana
            ).length > 1
    );
    if (duplicatedVocab) {
        alert(
            `重複エラー：「${duplicatedVocab.kanji}」の内容と重複したレコードがあります。`
        );
        return;
    }

    if (!window.confirm("Do you really want to save?")) {
        return;
    }

    try {
        const result = await sendPost(
            {
                vocabList,
                token: getCurrentToken(),
                mergedGenreId,
            },
            "/api/VocabQuiz/SaveVocabMergedList"
        );

        if (result === true) {
            alert("success!");
            if (typeof fncAfterSaving === "function") {
                fncAfterSaving();
            }
            return;
        }
    } catch {}

    alert("failed...");
}

interface SpeakerProps {
    vocabSound: sound;
    vocabId: number;
}
class Speaker extends React.Component<
    SpeakerProps,
    {
        showImg: boolean;
    }
> {
    didUnmount: boolean;

    constructor(props: SpeakerProps) {
        super(props);

        this.state = {
            showImg: props.vocabSound.playable,
        };
        this.didUnmount = false;
    }

    componentDidMount() {
        setTimeout(this.loadSound, this.props.vocabId);
    }

    componentDidUpdate(previous: SpeakerProps) {
        if (previous.vocabSound.audio !== this.props.vocabSound.audio) {
            this.setState({ showImg: false });
            setTimeout(this.loadSound);
        }
    }

    loadSound = () => {
        const { vocabSound } = this.props;
        vocabSound.audio.oncanplaythrough = () => {
            if (!this.didUnmount) this.setState({ showImg: true });
            vocabSound.playable = true;
        };
        vocabSound.audio.load();
    };

    componentWillUnmount() {
        this.didUnmount = true;
    }

    render() {
        const { showImg } = this.state;
        const { vocabSound } = this.props;
        return showImg ? (
            <img
                alt="vocabulary speaker"
                src={BLOB_URL + "/vocabulary-quiz/img/speaker.png"}
                style={{ width: "60%", maxWidth: 30, cursor: "pointer" }}
                onClick={() => {
                    void vocabSound?.audio?.play();
                }}
            />
        ) : null;
    }
}

function YouTubeInfo({ titleToShowUpper }: { titleToShowUpper: string }) {
    return (
        <div
            style={{
                whiteSpace: "pre-wrap",
                border: "solid",
                margin: "20px 0 50px",
                padding: 20,
            }}
        >
            <div
                style={{
                    marginBottom: 40,
                }}
            >
                <p style={{ fontWeight: "bold" }}>{"Title"}</p>
                {`【${titleToShowUpper}】 Japanese Vocabulary Quiz`}
            </div>
            <div>
                <p style={{ fontWeight: "bold" }}>{"Description"}</p>
                {`Japanese Vocabulary Quiz - ${titleToShowUpper}

【All vocab lists and quizzes】
${Z_APPS_TOP_URL}/vocabulary-list

【Subscribe to this YouTube channel】
http://www.youtube.com/channel/UCii35PcojqMUNkSRalUw35g?sub_confirmation=1

【Facebook Page】
https://www.facebook.com/LingualNinja

【Twitter】
https://twitter.com/LingualNinja

`}
            </div>
        </div>
    );
}

export function getGenreVocabKey(v: vocab) {
    return `${v.genreId}-${v.vocabId}`;
}

export function compareGenreVocab(v1: vocab, v2: vocab) {
    return v1.genreId === v2.genreId && v1.vocabId === v2.vocabId;
}

export default VocabMerge;
