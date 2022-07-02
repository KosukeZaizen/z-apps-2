import React, { CSSProperties } from "react";
import { YouTubeVideo } from ".";
import { StorageVideo } from "./StorageVideo";

export type VocabVideoProps = {
    screenWidth: number;
    style?: CSSProperties;
    buttonLabel?: string;
    youtube: string;
    genreName: string;
    pageNameForLog: string;
};

export function VocabVideo({
    youtube,
    screenWidth,
    style,
    buttonLabel,
    genreName,
    pageNameForLog,
}: VocabVideoProps) {
    if (youtube === "storage") {
        return (
            <StorageVideo
                path={`vocabulary-quiz/video/backup/${genreName}.mp4`}
                screenWidth={screenWidth}
                style={style}
                buttonLabel={buttonLabel}
                pageNameForLog={pageNameForLog}
            />
        );
    }
    return (
        <YouTubeVideo
            videoId={youtube}
            screenWidth={screenWidth}
            style={style}
            buttonLabel={buttonLabel}
            pageNameForLog={pageNameForLog}
        />
    );
}
