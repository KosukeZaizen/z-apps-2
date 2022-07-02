import { Avatar, Card } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useEffect, useState } from "react";
import { changeAppState, useAppState } from "../../common/appState";
import { appsPublicImg, articlesStorage } from "../../common/consts";
import { useScreenSize } from "../../common/hooks/useScreenSize";
import ShurikenProgress from "./Animations/ShurikenProgress";
import "./CharacterComment/CharacterComment.css";
import { Markdown } from "./Markdown";
import { RightPanel } from "./Panel/RightPanel";
import { ScrollBox } from "./ScrollBox";

export interface Author {
    authorId: number;
    authorName: string;
    initialGreeting: string;
    selfIntroduction: string;
    isAdmin: boolean;
    imgExtension: string;
}

function getAuthorImgPath({ authorId, imgExtension }: Author) {
    return `${articlesStorage}_authors/${authorId}${imgExtension}?v=${renderCounter()}`;
}

export function AuthorCard({
    author,
    screenWidth,
    style,
}: {
    author?: Author;
    screenWidth: number;
    style?: CSSProperties;
}) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    if (!author) {
        return null;
    }

    const panelWidth = screenWidth > 1000 ? 1000 : screenWidth;

    return (
        <>
            <Card
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: 5,
                    cursor: "pointer",
                    ...style,
                }}
                onClick={() => {
                    setIsPanelOpen(true);
                }}
            >
                <Avatar>
                    <img
                        src={getAuthorImgPath(author)}
                        style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            objectPosition: "50% 50%",
                        }}
                        alt={author.authorName}
                        title={author.authorName}
                    />
                </Avatar>
                <div style={{ marginLeft: 5, marginRight: 5 }}>
                    <span style={{ color: "#0d6efd" }}>
                        {"by "}
                        {author.authorName}
                    </span>
                </div>
            </Card>
            <RightPanel
                open={isPanelOpen}
                onClose={() => {
                    setIsPanelOpen(false);
                }}
                panelWidth={1000}
            >
                <AuthorArea author={author} screenWidth={panelWidth} />
            </RightPanel>
        </>
    );
}

export function AuthorName({ title }: { title?: string }) {
    return (
        <a
            href="#"
            onClick={ev => {
                ev.preventDefault();
                changeAppState("authorPanelState", { open: true, title });
            }}
        >
            Kosuke Zaizen
        </a>
    );
}

const panelWidth = 1000;
export const initialAuthorPanelState =
    window.location.hash === "#KosukeZaizen"
        ? { open: true, title: "Developer" }
        : { open: false };

export default function AuthorPanel() {
    const { screenWidth } = useScreenSize();
    const [authorPanelState, setAuthorPanelState] =
        useAppState("authorPanelState");

    return (
        <RightPanel
            open={authorPanelState.open}
            onClose={() => {
                setAuthorPanelState({ open: false });
            }}
            panelWidth={1000}
        >
            <AuthorArea
                title={
                    "title" in authorPanelState && authorPanelState.title
                        ? authorPanelState.title
                        : undefined
                }
                screenWidth={Math.min(panelWidth, screenWidth)}
                style={{ lineHeight: 1.5 }}
            />
        </RightPanel>
    );
}

const defaultImage = appsPublicImg + "KosukeZaizen.jpg";

function getRenderCounter() {
    let count = 1;
    return () => count++;
}
const renderCounter = getRenderCounter();

type AuthorProps = {
    screenWidth: number;
    style?: CSSProperties;
    author?: Author;
    filePath?: string;
    title?: string;
    hoverScale?: boolean;
};
export const AuthorArea = ({
    style,
    screenWidth,
    author: pAuthor,
    filePath,
    title,
    hoverScale,
}: AuthorProps) => {
    const author = useDefaultAuthor(pAuthor);
    if (!author) {
        return <ShurikenProgress size="20%" style={{ marginTop: 100 }} />;
    }

    const isCommentUsed = screenWidth > 767;
    const isVeryNarrow = screenWidth < 500;
    const imageSrc =
        filePath ||
        (author.imgExtension ? getAuthorImgPath(author) : defaultImage);

    return (
        <ScrollBox
            style={{ textAlign: "center", ...style }}
            hoverScale={hoverScale}
        >
            <h2 style={{ marginBottom: 25 }}>{title || "Author"}</h2>
            {isCommentUsed ? (
                <PersonComment
                    author={author}
                    imageSrc={imageSrc}
                    screenWidth={screenWidth}
                    comment={
                        <div>
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "x-large",
                                    margin: "15px 5px 25px",
                                }}
                            >
                                {author.initialGreeting}
                            </div>
                            <div style={{ margin: 10 }}>
                                <CommentMarkDown
                                    selfIntroduction={author.selfIntroduction}
                                />
                            </div>
                        </div>
                    }
                />
            ) : (
                <div>
                    <div style={{ margin: "0 auto 20px" }}>
                        <img
                            src={imageSrc}
                            alt={author.authorName}
                            title={author.authorName}
                            style={{
                                width: "100%",
                                maxWidth: 300,
                                objectFit: "contain",
                                margin: "auto",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            margin: isVeryNarrow ? "10px 0" : 10,
                            fontSize: "large",
                            textAlign: "left",
                            padding: isVeryNarrow ? 0 : 10,
                        }}
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "x-large",
                                margin: isVeryNarrow
                                    ? "0 0 25px"
                                    : "0 5px 25px",
                            }}
                        >
                            {author.initialGreeting}
                        </div>
                        <CommentMarkDown
                            style={{
                                margin: isVeryNarrow ? "5px 0" : 5,
                                fontSize: isVeryNarrow ? "medium" : undefined,
                            }}
                            selfIntroduction={author.selfIntroduction}
                        />
                    </div>
                </div>
            )}
        </ScrollBox>
    );
};

type CommentProps = {
    screenWidth: number;
    comment: string | React.ReactNode;
    style?: React.CSSProperties;
    commentStyle?: React.CSSProperties;
    author: Author;
    imageSrc: string;
};
export function PersonComment({
    comment,
    style,
    commentStyle,
    author,
    imageSrc,
}: CommentProps) {
    return (
        <div
            style={{
                display: "flex",
                ...style,
            }}
        >
            <div style={{ flex: 1, marginTop: 6, marginRight: 10 }}>
                <img
                    src={imageSrc}
                    alt={author.authorName}
                    title={author.authorName}
                    style={{
                        maxWidth: 300,
                        height: "auto",
                        verticalAlign: "top",
                    }}
                    className="ninjaPic"
                />
            </div>
            <div
                className="chatting"
                style={{
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                    flex: 2,
                }}
            >
                <div
                    className="says"
                    style={{
                        width: "100%",
                        ...commentStyle,
                    }}
                >
                    {comment}
                </div>
            </div>
        </div>
    );
}

const CommentMarkDown = ({
    style,
    selfIntroduction,
}: {
    style?: CSSProperties;
    selfIntroduction: string;
}) => (
    <Markdown
        style={{ margin: 5, textAlign: "left", fontSize: "large", ...style }}
        source={selfIntroduction}
    />
);

function useDefaultAuthor(pAuthor?: Author) {
    const [author, setAuthor] = useState<Author | undefined>(undefined);

    useEffect(() => {
        if (!pAuthor) {
            (async () => {
                const res = await fetch(
                    "/api/Articles/GetAuthorInfo?authorId=1"
                );
                const author = await res.json();
                setAuthor(author);
            })();
        }
    }, [pAuthor]);

    return pAuthor || author;
}
