import { Collapse } from "@material-ui/core";
import React, { useState } from "react";
import { Markdown } from "..";
import { sentence } from "../../../../types/stories";
import { ExampleSentence } from "./ExampleSentence";
import { FolktaleExample } from "./ExampleSentence/Folktale";
import { PointBox } from "./PointBox";

function sliceByNumber<T>(array: T[], number: number) {
    const length = Math.ceil(array.length / number);
    return new Array(length)
        .fill(undefined)
        .map((_, i) => array.slice(i * number, (i + 1) * number));
}

export const CodeRender = ({
    language,
    value,
}: {
    language: string;
    value: string;
}) => {
    if (!value) {
        return null;
    }

    const params: { [key: number]: string } = value
        .split("\n")
        .reduce((acc: { [key: number]: string }, val: string, i: number) => {
            acc[i] = val;
            return acc;
        }, {});

    if (language === "ex") {
        return (
            <FolktaleExample
                storyName={params[0]}
                lineNumber={Number(params[1])}
                boldInfo={params[2]}
            />
        );
    }

    if (language === "e") {
        return <OriginalExample params={params} />;
    }

    if (language === "box") {
        return (
            <div>
                <div className="greenBox">
                    <Markdown source={value} noLinkShadow />
                </div>
            </div>
        );
    }

    if (language?.startsWith("button-")) {
        const [_button, openLabel, closeLabel] = language.split("-");
        return (
            <CollapseButton
                openLabel={openLabel || "Open"}
                closeLabel={closeLabel || "Close"}
                content={value}
            />
        );
    }

    return (
        <PointBox language={language} style={{ textShadow: "initial" }}>
            <Markdown source={value} noLinkShadow />
        </PointBox>
    );
};

function CollapseButton({
    openLabel,
    closeLabel,
    content,
}: {
    openLabel: string;
    closeLabel: string;
    content: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ margin: "20px 0" }}>
            <button
                onClick={() => {
                    setOpen(!open);
                }}
                className={`btn ${open ? "btn-dark" : "btn-primary"} btn-xs`}
                style={{ boxShadow: "none", margin: 0 }}
            >
                {open
                    ? closeLabel.replaceAll("_", " ")
                    : openLabel.replaceAll("_", " ")}
            </button>
            <Collapse in={open} timeout={1000} style={{ margin: 0 }}>
                <div className="answerBox">
                    <Markdown source={content} noLinkShadow />
                </div>
            </Collapse>
        </div>
    );
}

function OriginalExample({ params }: { params: { [key: number]: string } }) {
    const s: sentence = {
        storyId: 0,
        lineNumber: 0,
        kanji: params[0],
        hiragana: params[1],
        romaji: params[2],
        english: params[3],
    };

    const strWords = params[6];
    let threeItemsArrays: string[][] = [];
    if (strWords) {
        try {
            const arrWords: string[] = JSON.parse(strWords);
            threeItemsArrays = sliceByNumber<string>(arrWords, 3);
        } catch (e) {}
    }
    const words = threeItemsArrays.map((items, i) => ({
        lineNumber: 0,
        wordNumber: i,
        kanji: items[0],
        hiragana: items[1],
        english: items[2],
    }));

    return (
        <div style={{ marginBottom: 20, marginTop: 10, textShadow: "initial" }}>
            <ExampleSentence
                s={s}
                boldInfo={params[4]}
                audioPath={params[5]}
                words={words}
            />
        </div>
    );
}
