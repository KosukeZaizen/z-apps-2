import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StopAnimation } from "../../../../../common/animation";
import { sendPost } from "../../../../../common/functions";
import { areSameObjects } from "../../../../../common/util/compareObjects";
import {
    vocabMergedGenre,
    VocabMergedGenreId,
} from "../../../../../types/vocab";
import Head from "../../../../shared/Helmet";
import { HideFooter } from "../../../../shared/HideHeaderAndFooter/HideFooter";
import {
    getCurrentToken,
    InputRegisterToken,
} from "../../../../shared/InputRegisterToken";

async function fetchAllGenres(
    setAllGenres: (genres: vocabMergedGenre[]) => void
) {
    const res = await fetch("api/VocabQuiz/GetAllMergedGenres");
    setAllGenres(await res.json());
}

function VocabMergeTop() {
    const [initGenres, setInitGenres] = useState<vocabMergedGenre[]>([]);
    const [allGenres, setAllGenres] = useState<vocabMergedGenre[]>([]);
    const [newGenreName, setNewGenreName] = useState("");

    const loadAllGenres = () => {
        fetchAllGenres(genres => {
            const g = genres.map(g => {
                g.order *= 10;
                return g;
            });
            setAllGenres(g);
            setInitGenres(g);
        });
    };

    useEffect(() => {
        loadAllGenres();
    }, []);

    const changeGenre = (
        originalGenre: vocabMergedGenre,
        targetKey: keyof vocabMergedGenre,
        newValue: vocabMergedGenre[keyof vocabMergedGenre]
    ) => {
        const newGenre = { ...originalGenre, [targetKey]: newValue };
        setAllGenres([
            ...allGenres.filter(g => g.genreId !== newGenre.genreId),
            newGenre,
        ]);
    };

    const checkGenreChanged = (g: vocabMergedGenre) =>
        !areSameObjects(
            g,
            initGenres.find(pg => pg.genreId === g.genreId)
        );

    return (
        <>
            <Head noindex />
            <HideFooter />
            <StopAnimation />
            <h1 style={{ marginBottom: 30 }}>{"Vocabulary Merge"}</h1>

            <div style={{ marginBottom: 30, backgroundColor: "lightyellow" }}>
                <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                    New Merged Genre Name:
                </p>
                <input
                    value={newGenreName}
                    onChange={ev => {
                        setNewGenreName(ev.target.value.split(" ").join("_"));
                    }}
                />
                <button
                    onClick={() => {
                        if (!newGenreName) {
                            return;
                        }
                        setAllGenres([
                            ...allGenres,
                            getNewGenre(newGenreName, allGenres),
                        ]);
                        setNewGenreName("");
                    }}
                >
                    Add new genre
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Genre Name</th>
                        <th>YouTube</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {[...allGenres]
                        .sort((a, b) => a.order - b.order)
                        .map(g => {
                            return (
                                <tr
                                    key={g.genreId}
                                    style={{
                                        backgroundColor: checkGenreChanged(g)
                                            ? "red"
                                            : undefined,
                                    }}
                                >
                                    <td>
                                        <input
                                            type="number"
                                            value={g.order
                                                .toString()
                                                .replace(/^0+/, "")}
                                            style={{ width: 70 }}
                                            onChange={ev => {
                                                changeGenre(
                                                    g,
                                                    "order",
                                                    Number(ev.target.value)
                                                );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={g.genreName}
                                            onChange={ev => {
                                                changeGenre(
                                                    g,
                                                    "genreName",
                                                    ev.target.value
                                                        .split(" ")
                                                        .join("_")
                                                );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={g.youtube}
                                            onChange={ev => {
                                                changeGenre(
                                                    g,
                                                    "youtube",
                                                    ev.target.value
                                                );
                                            }}
                                        />
                                    </td>
                                    <td style={{ backgroundColor: "white" }}>
                                        {"Release:"}
                                        <input
                                            type="checkbox"
                                            checked={g.released}
                                            onChange={() => {
                                                changeGenre(
                                                    g,
                                                    "released",
                                                    !g.released
                                                );
                                            }}
                                        />
                                    </td>
                                    <td
                                        style={{
                                            paddingLeft: 20,
                                            backgroundColor: "white",
                                        }}
                                    >
                                        {initGenres.some(
                                            pg => pg.genreId === g.genreId
                                        ) && (
                                            <span style={{ margin: "0 10px" }}>
                                                <Link
                                                    to={`/vocabularyMerge/${g.genreName}`}
                                                >
                                                    Edit
                                                </Link>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            <div style={{ height: 50 }} />
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
                            save(allGenres, () => {
                                loadAllGenres();
                            });
                        }}
                        style={{ width: "100%" }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}

async function save(allGenres: vocabMergedGenre[], fncAfterSaving: () => void) {
    if (!allGenres.every(g => g.order && g.genreName)) {
        alert("「order」か「genreName」が、空白もしくはゼロの行があります。");
        return;
    }

    const duplicatedGenre = allGenres.find(
        g =>
            allGenres.filter(
                ge =>
                    g.genreName === ge.genreName ||
                    (g.youtube &&
                        g.youtube !== "storage" &&
                        g.youtube === ge.youtube)
            ).length > 1
    );
    if (duplicatedGenre) {
        alert(
            `重複エラー：「${duplicatedGenre.genreName}」のgenreNameもしくはyoutubeIdが重複しています。`
        );
        return;
    }

    if (!window.confirm("Do you really want to save?")) {
        return;
    }

    try {
        const result = await sendPost(
            {
                genres: allGenres,
                token: getCurrentToken(),
            },
            "/api/VocabQuiz/SaveVocabMergedGenres"
        );

        if (result === true) {
            if (typeof fncAfterSaving === "function") {
                fncAfterSaving();
            }
            alert("success!");
            return;
        }
    } catch (ex) {}

    alert("failed...");
}

function getNewGenre(
    genreName: string,
    allGenres: vocabMergedGenre[]
): vocabMergedGenre {
    const maxGenreId = allGenres.reduce(
        (acc, val) => (acc > val.genreId ? acc : val.genreId),
        0
    );
    return {
        genreName,
        genreId: VocabMergedGenreId(maxGenreId + 1),
        youtube: "",
        order: 1,
        released: false,
    };
}

export default VocabMergeTop;
