import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { ChangePage, Page } from ".";
import { StopAnimation } from "../../../../../common/animation";
import { BLOB_URL } from "../../../../../common/consts";
import { sound, vocab } from "../../../../../types/vocab";
import { restartFooterAnimation } from "../../../../shared/Animations/FooterAnimation";
import { getFallingImages } from "../../../../shared/Animations/SeasonAnimation";
import { FallingImageEdit } from "../../../../shared/Animations/SeasonAnimation/FallingImageEdit";
import { Video } from "../../parts/Video";

export function MenuPage({
    changePage,
    vocabSounds,
    music,
    startingVoice,
    setSeason,
    setVocabSeason,
    setVocabSeasons,
    vocabList,
    isOneSeason,
    setIsOneSeason,
    vocabSeasons,
    startRecording,
    prepareRecordingAsync,
    setIsAutoRecord,
}: {
    changePage: ChangePage;
    vocabSounds: sound[];
    music?: sound;
    startingVoice?: sound;
    setSeason: (season: string) => void;
    setVocabSeason: (vocabId: number, season: string) => void;
    setVocabSeasons: (vocabSeasons: string[]) => void;
    vocabList: vocab[];
    isOneSeason: boolean;
    setIsOneSeason: (isOneSeason: boolean) => void;
    vocabSeasons: string[];
    startRecording: () => void;
    prepareRecordingAsync: (videoName?: string) => Promise<void>;
    setIsAutoRecord: (isAutoRecord: boolean) => void;
}) {
    const [isButtonShown, setIsButtonShown] = useState(true);
    const [playableArray, setPlayableArray] = useState(
        vocabSounds.map(s => s.playable)
    );
    const [musicPlayable, setMusicPlayable] = useState(false);
    const [startingVoicePlayable, setStartingVoicePlayable] = useState(false);
    const [seasonNames, setSeasonNames] = useState<string[]>([]);
    const [isOpeningVideoShown, setOpeningVideoShown] = useState(false);

    const [isAnimationStopped, setIsAnimationStopped] = useState(true);

    const mountState = useMemo(() => {
        const mountState = { unmounted: false };
        return {
            setUnmounted: (unmounted: boolean) => {
                mountState.unmounted = unmounted;
            },
            checkUnmounted: () => mountState.unmounted,
        };
    }, []);

    useEffect(() => {
        mountState.setUnmounted(false);
        return () => {
            mountState.setUnmounted(true);
        };
    }, []);

    useEffect(restartFooterAnimation, []);

    const { checkUnmounted } = mountState;

    useEffect(() => {
        vocabSounds.forEach(vocabSound => {
            vocabSound.audio.oncanplaythrough = () => {
                vocabSound.playable = true;
                if (!checkUnmounted()) {
                    setPlayableArray(vocabSounds.map(s => s.playable));
                }
            };
            vocabSound.audio.load();
        });
    }, [vocabSounds, checkUnmounted]);

    useEffect(() => {
        if (!music) {
            return;
        }
        music.audio.oncanplaythrough = () => {
            music.playable = true;
            if (!checkUnmounted()) {
                setMusicPlayable(true);
            }
        };
        music.audio.load();
    }, [music, checkUnmounted]);

    useEffect(() => {
        if (!startingVoice) {
            return;
        }
        startingVoice.audio.oncanplaythrough = () => {
            startingVoice.playable = true;
            if (!checkUnmounted()) {
                setStartingVoicePlayable(true);
            }
        };
        startingVoice.audio.load();
    }, [startingVoice, checkUnmounted]);

    useEffect(() => {
        (async () => {
            const seasons = await getFallingImages();
            if (!checkUnmounted()) {
                setSeasonNames(seasons.map(s => s.name));
            }
        })();
    }, [checkUnmounted]);

    const playableCount = playableArray.filter(p => p).length;
    const totalCount = vocabSounds.filter(s => s).length;

    return (
        <>
            <Video
                src={`${BLOB_URL}/videoParts/introduction-small-sound.mp4`}
                afterVideo={() => {
                    changePage(Page.title);
                }}
                started={isOpeningVideoShown}
                style={{ width: "100%" }}
                freezingTimeBeforePlay={2000}
            />

            <StopAnimation />

            {isButtonShown ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{ margin: 10 }}
                    >{`Loaded Audio: ${playableCount} / ${totalCount}`}</p>

                    <p style={{ margin: 10 }}>{`Music: ${
                        musicPlayable && startingVoicePlayable
                            ? "OK!"
                            : "Loading..."
                    }`}</p>

                    {playableCount === totalCount &&
                        musicPlayable &&
                        startingVoicePlayable &&
                        seasonNames.length && (
                            <>
                                <button
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        setIsAutoRecord(true);
                                        prepareRecordingAsync().then(() => {
                                            setTimeout(() => {
                                                setOpeningVideoShown(true);
                                                setTimeout(() => {
                                                    setIsAnimationStopped(
                                                        false
                                                    );
                                                    startRecording();
                                                }, 2000);
                                            }, 1000);
                                            if (!checkUnmounted()) {
                                                setIsButtonShown(false);
                                            }
                                        });
                                    }}
                                >
                                    Video Start
                                </button>
                                <button
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        setIsAutoRecord(false);
                                        setTimeout(() => {
                                            setOpeningVideoShown(true);
                                            setTimeout(() => {
                                                setIsAnimationStopped(false);
                                            }, 2000);
                                        }, 1000);
                                        if (!checkUnmounted()) {
                                            setIsButtonShown(false);
                                        }
                                    }}
                                >
                                    Video Start without recording
                                </button>
                            </>
                        )}

                    <div style={{ display: "flex" }}>
                        <div
                            style={{ border: "solid", margin: 20, padding: 20 }}
                        >
                            <input
                                type="checkbox"
                                checked={isOneSeason}
                                style={{ marginRight: 10 }}
                                onChange={() => {
                                    setIsOneSeason(!isOneSeason);
                                    if (isOneSeason) {
                                        const vocabSeasons = vocabList.reduce<
                                            string[]
                                        >((acc, val) => {
                                            const seasons = [...acc];
                                            seasons[val.vocabId] = "none";
                                            return seasons;
                                        }, []);
                                        setVocabSeasons(vocabSeasons);
                                    }
                                }}
                            />
                            {"動画全体で単一のSeasonとする"}
                            <div style={{ display: "flex", margin: 20 }}>
                                <div>{"Base season:"}</div>
                                <select
                                    onChange={ev => {
                                        setSeason(ev.target.value);
                                    }}
                                >
                                    {seasonNames.map(s => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            {!isOneSeason && (
                                <table style={{ margin: "20px 40px 0" }}>
                                    <tbody>
                                        {vocabList.map(v => (
                                            <tr key={v.vocabId}>
                                                <td>{v.kanji}</td>
                                                <td>
                                                    <select
                                                        value={
                                                            vocabSeasons[
                                                                v.vocabId
                                                            ]
                                                        }
                                                        onChange={ev => {
                                                            setVocabSeason(
                                                                v.vocabId,
                                                                ev.target.value
                                                            );
                                                        }}
                                                    >
                                                        {seasonNames.map(s => (
                                                            <option key={s}>
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <div
                                style={{
                                    border: "solid",
                                    margin: 20,
                                    padding: 10,
                                }}
                            >
                                <p>途中から再生</p>
                                <button
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        changePage(Page.list);
                                    }}
                                >
                                    List Page
                                </button>
                                <button
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        changePage(Page.quiz);
                                    }}
                                >
                                    Quiz Page
                                </button>
                                <button
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        changePage(Page.last);
                                    }}
                                >
                                    Last Page
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    changePage(Page.thumbnail);
                                }}
                                style={{ margin: "0 20px" }}
                            >
                                {"サムネイル用画面"}
                            </button>
                        </div>
                    </div>
                    <FallingImageEdit />
                </div>
            ) : null}
        </>
    );
}
