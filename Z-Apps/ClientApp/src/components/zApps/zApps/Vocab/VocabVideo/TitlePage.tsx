import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChangePage, Page } from ".";
import { StopAnimation } from "../../../../../common/animation";
import { sleepAsync } from "../../../../../common/functions";
import { sound, vocab } from "../../../../../types/vocab";
import CharacterComment from "../../../../shared/CharacterComment";
import { ScrollBox } from "../../../../shared/ScrollBox";

export function TitlePage({
    titleToShowUpper,
    screenWidth,
    changePage,
    vocabList,
    music,
    startingVoice,
    isAutoRecord,
}: {
    titleToShowUpper: string;
    screenWidth: number;
    changePage: ChangePage;
    vocabList: vocab[];
    music: sound;
    startingVoice: sound;
    isAutoRecord: boolean;
}) {
    const scrollTextRef = useRef<HTMLSpanElement>(null);
    const characterCommentRef = useRef<HTMLDivElement>(null);

    const [isInitial, setIsInitial] = useState(true);

    const [isOmitted, setIsOmitted] = useState(false);
    const initialHiraganaList = useMemo(
        () =>
            vocabList.reduce((acc, val) => {
                const nextArr = [...acc, val.hiragana];
                if (nextArr.join("").length > 18) {
                    setIsOmitted(true);
                    return acc;
                }
                return nextArr;
            }, [] as string[]),
        []
    );
    const [hiraganaList, setHiraganaList] = useState<string[]>(
        initialHiraganaList
    );
    const [isCommentTwoLines, setIsCommentTwoLines] = useState(false);
    const [isAnimationStopped, setIsAnimationStopped] = useState(true);

    useEffect(() => {
        const musicPlay = async () => {
            const { audio } = music;
            music.audio.volume = 0;
            audio.onended = musicPlay;
            audio.play();
            while (music.audio.volume < 0.002) {
                music.audio.volume += 0.0002;
                await sleepAsync(30);
            }
        };
        musicPlay();

        startingVoice.audio.play();

        setTimeout(() => {
            setIsAnimationStopped(false);
        }, 2000);

        setTimeout(() => {
            setIsInitial(false);
        }, 5000);
        setTimeout(() => {
            changePage(Page.list);
        }, 10000);
    }, []);

    useEffect(() => {
        const l = [...hiraganaList];
        const rect = scrollTextRef.current?.getBoundingClientRect();
        if (rect && rect.height > 100) {
            l.length = l.length - 1;
        }

        if (l.length !== hiraganaList.length) {
            setIsOmitted(true);
            setHiraganaList(l);
        }
    }, [hiraganaList, vocabList, scrollTextRef.current]);

    useEffect(() => {
        const rect = characterCommentRef.current?.getBoundingClientRect();
        const isTwoLines = !!rect && rect.height > 230;
        setIsCommentTwoLines(isTwoLines);
    }, [titleToShowUpper]);

    let comment: React.ReactNode;
    if (isInitial) {
        comment = titleToShowUpper.split(" ").map((t, i) => {
            const str = i ? " " + t : t;
            return t.includes("-") ? (
                <span style={{ display: "inline-block" }}>{str}</span>
            ) : (
                str
            );
        });
    } else {
        comment = (
            <p style={{ fontSize: 60 }}>
                {"Let's check all the words"}
                <br />
                {"before starting the quiz!"}
            </p>
        );
    }

    return (
        <div
            style={
                isInitial
                    ? {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-around",
                          height: "100%",
                          padding: isCommentTwoLines ? undefined : 20,
                      }
                    : {}
            }
        >
            {isAnimationStopped && <StopAnimation />}
            {isInitial && (
                <h1
                    id="h1title"
                    style={{
                        marginTop: 10,
                        marginBottom: isInitial ? 20 : 100,
                        fontWeight: "bold",
                        fontSize: 100,
                    }}
                >
                    {"Japanese Vocabulary Quiz"}
                </h1>
            )}
            <CharacterComment
                containerRef={characterCommentRef}
                imgNumber={1}
                screenWidth={screenWidth}
                comment={comment}
                style={{
                    maxWidth: 1000,
                    position: "relative",
                    left: -40,
                }}
                commentStyle={{
                    fontSize: 100,
                    fontWeight: "bold",
                    maxWidth: 1000,
                    marginLeft: 40,
                    textAlign: "center",
                    marginBottom: -20,
                    lineHeight: 1.3,
                    paddingBottom: 30,
                }}
                imgStyle={{ maxWidth: 150 }}
            />
            {isInitial && (
                <ScrollBox>
                    <div
                        style={{
                            fontSize: 50,
                            textOverflow: "hidden",
                            width: 1100,
                            fontWeight: "bold",
                        }}
                    >
                        <span ref={scrollTextRef}>
                            {hiraganaList.join(", ")}
                            {isOmitted && "..., etc"}
                        </span>
                    </div>
                </ScrollBox>
            )}
        </div>
    );
}
