import React from "react";
import { YouTubeVideo } from "../../YouTubeVideo";
import { Video } from "../../YouTubeVideo/StorageVideo";
import { Speaker } from "./Speaker";
import { VocabList } from "./VocabList";

const imgExtensions = [".png", ".jpg", ".gif"];
const soundExtensions = [".m4a"];
const videoExtensions = [".mp4"];

export function checkImgExtension(str: string) {
    return checkExtension(str, imgExtensions);
}

function checkExtension(str: string, extensions: string[]) {
    if (!str) {
        return false;
    }
    return extensions.some(e => str.toLowerCase().includes(e));
}

export const ImageRender = ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src || !alt) {
        return null;
    }

    if (src.startsWith("youtube")) {
        return (
            <YouTubeVideo
                screenWidth={window.innerWidth}
                pageNameForLog={"markDown embedded"}
                videoId={alt}
                buttonLabel={
                    src.includes("-")
                        ? src.split("-")[1].split("_").join(" ")
                        : ""
                }
            />
        );
    } else if (checkExtension(src, soundExtensions)) {
        return <Speaker src={src} alt={alt} />;
    } else if (checkExtension(src, videoExtensions)) {
        return (
            <div style={{ textShadow: "none" }}>
                <Video
                    path={src}
                    screenWidth={300}
                    pageNameForLog="MarkdownVideo"
                />
            </div>
        );
    } else if (src === "vocab") {
        return <VocabList genreName={alt} />;
    }
    return <img src={src} alt={alt} title={alt} className="renderedImg" />;
};
