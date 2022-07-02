import React, { useEffect } from "react";
import { ChangePage, Page } from ".";
import { sleepAsync } from "../../../../../common/functions";
import { sound } from "../../../../../types/vocab";
import CharacterComment from "../../../../shared/CharacterComment";

export function LastPage({
    screenWidth,
    changePage,
    music,
    stopRecording,
}: {
    screenWidth: number;
    changePage: ChangePage;
    music: sound;
    stopRecording: () => void;
}) {
    useEffect(() => {
        music.audio.onended = null;

        setTimeout(() => {
            const soundFadeOut = async () => {
                const { audio } = music;
                const reducedVolume = audio.volume / 10;

                while (audio.volume > 0) {
                    const tmpVolume = audio.volume;

                    if (tmpVolume - reducedVolume < 0) {
                        audio.volume = 0;
                    } else {
                        audio.volume -= reducedVolume;
                    }
                    await sleepAsync(500);
                }
            };
            soundFadeOut();
        }, 13000);

        setTimeout(() => {
            stopRecording();
            setTimeout(() => changePage(Page.menu), 600);
        }, 20000);
    }, []);

    return (
        <div>
            <h1
                id="h1title"
                style={{
                    marginBottom: 100,
                    fontWeight: "bold",
                    fontSize: 90,
                }}
            >
                {"Thank you for watching!"}
            </h1>
            <CharacterComment
                imgNumber={1}
                screenWidth={screenWidth}
                comment={[
                    <p>{"Don't forget to subscribe"}</p>,
                    <p>{"to this YouTube channel!"}</p>,
                ]}
                style={{ maxWidth: 1000, marginBottom: 40 }}
                commentStyle={{
                    fontSize: 50,
                    fontWeight: "bold",
                    maxWidth: 900,
                    marginLeft: 40,
                    textAlign: "center",
                }}
            />
        </div>
    );
}
