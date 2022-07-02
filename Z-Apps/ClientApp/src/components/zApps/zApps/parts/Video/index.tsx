import * as React from "react";
import { CSSProperties, useEffect, useMemo, useRef } from "react";

export function Video({
    style,
    afterVideo,
    src,
    started,
    freezingTimeBeforePlay,
}: {
    style?: CSSProperties;
    afterVideo: () => void;
    src: string;
    started: boolean;
    freezingTimeBeforePlay?: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef?.current;
        if (videoElement) {
            if (!started) {
                // When video ref was set
                videoElement.load();
                videoElement.onended = afterVideo;
            } else if (started) {
                setTimeout(() => videoElement.play(), freezingTimeBeforePlay);
            }
        } else if (started) {
            alert("cannot start the video before the Ref is set");
        }
    }, [videoRef, started, freezingTimeBeforePlay]);

    const styleMemo = useMemo(
        () => ({ ...style, display: started ? "block" : "none" }),
        [style, started]
    );

    return <video ref={videoRef} src={src} style={styleMemo} />;
}
