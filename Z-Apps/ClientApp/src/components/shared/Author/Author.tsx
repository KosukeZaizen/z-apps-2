import { Avatar, Card, makeStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useEffect, useState } from "react";
import {
    changeAppState,
    getAppState,
    useAppState,
} from "../../../common/appState";
import { appsPublicImg, articlesStorage } from "../../../common/consts";
import { sleepAsync } from "../../../common/functions";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../Animations/ShurikenProgress";
import "../CharacterComment/CharacterComment.css";
import { Markdown } from "../Markdown";
import { RightPanel } from "../Panel/RightPanel";
import { ScrollBox } from "../ScrollBox";
import { Author } from "./types";

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
    const c = useAuthorCardStyles();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    if (!author) {
        return null;
    }

    const panelWidth = screenWidth > 1000 ? 1000 : screenWidth;

    return (
        <>
            <Card
                style={style}
                onClick={() => {
                    setIsPanelOpen(true);
                }}
                className={c.card}
            >
                <Avatar>
                    <img
                        src={getAuthorImgPath(author)}
                        className={c.avatarImg}
                        alt={author.authorName}
                        title={author.authorName}
                    />
                </Avatar>
                <div className={c.nameArea}>
                    <span className={c.nameSpan}>
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
const useAuthorCardStyles = makeStyles(() => ({
    card: {
        display: "inline-flex",
        alignItems: "center",
        padding: 5,
        cursor: "pointer",
    },
    avatarImg: {
        width: 40,
        height: 40,
        objectFit: "cover",
        objectPosition: "50% 50%",
    },
    nameArea: { marginLeft: 5, marginRight: 5 },
    nameSpan: { color: "#0d6efd" },
}));

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

export default function AuthorPanel() {
    const { screenWidth } = useScreenSize();
    const [authorPanelState, setAuthorPanelState] =
        useAppState("authorPanelState");

    const getCurrentTitle = () => {
        const state = getAppState().authorPanelState;
        if ("title" in state && state.title) {
            return state.title;
        }
        return undefined;
    };

    const [title, setTitle] = useState(getCurrentTitle());

    useEffect(() => {
        if (authorPanelState.open) {
            setTitle(getCurrentTitle());
            return;
        }
        sleepAsync(700).then(() => {
            setTitle(getCurrentTitle());
        });
    }, [authorPanelState]);

    return (
        <RightPanel
            open={authorPanelState.open}
            onClose={() => {
                setAuthorPanelState({ open: false });
            }}
            panelWidth={1000}
        >
            <AuthorArea
                title={title}
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
    const c = useAuthorAreaStyles();
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
            <h2 className={c.title}>{title || "Author"}</h2>
            {isCommentUsed ? (
                <PersonComment
                    author={author}
                    imageSrc={imageSrc}
                    screenWidth={screenWidth}
                    comment={
                        <div>
                            <div className={c.greeting}>
                                {author.initialGreeting}
                            </div>
                            <div className={c.markdownContainer}>
                                <CommentMarkDown
                                    selfIntroduction={author.selfIntroduction}
                                />
                            </div>
                        </div>
                    }
                />
            ) : (
                <div>
                    <div className={c.imgContainer}>
                        <img
                            src={imageSrc}
                            alt={author.authorName}
                            title={author.authorName}
                            className={c.img}
                        />
                    </div>
                    <div
                        className={
                            isVeryNarrow
                                ? c.spNarrowMessageContainer
                                : c.spMessageContainer
                        }
                    >
                        <div
                            className={
                                isVeryNarrow ? c.spNarrowGreeting : c.spGreeting
                            }
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
const useAuthorAreaStyles = makeStyles(() => ({
    title: { marginBottom: 25 },
    greeting: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "15px 5px 25px",
    },
    markdownContainer: { margin: 10 },
    imgContainer: { margin: "0 auto 20px" },
    img: {
        width: "100%",
        maxWidth: 300,
        objectFit: "contain",
        margin: "auto",
    },
    spMessageContainer: {
        margin: 10,
        fontSize: "large",
        textAlign: "left",
        padding: 10,
    },
    spNarrowMessageContainer: {
        margin: "10px 0",
        fontSize: "large",
        textAlign: "left",
        padding: 0,
    },
    spGreeting: {
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "0 5px 25px",
    },
    spNarrowGreeting: {
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "0 0 25px",
    },
}));

type CommentProps = {
    screenWidth: number;
    comment: string | React.ReactNode;
    author: Author;
    imageSrc: string;
};
function PersonComment({ comment, author, imageSrc }: CommentProps) {
    const c = usePersonCommentStyles();

    return (
        <div className={c.container}>
            <div className={c.imgContainer}>
                <img
                    src={imageSrc}
                    alt={author.authorName}
                    title={author.authorName}
                    className={spaceBetween("ninjaPic", c.img)}
                />
            </div>
            <div className={spaceBetween("chatting", c.chatting)}>
                <div className={spaceBetween("says", c.says)}>{comment}</div>
            </div>
        </div>
    );
}
const usePersonCommentStyles = makeStyles(() => ({
    container: {
        display: "flex",
    },
    imgContainer: { flex: 1, marginTop: 6, marginRight: 10 },
    img: {
        maxWidth: 300,
        height: "auto",
        verticalAlign: "top",
    },
    chatting: {
        flex: 2,
    },
    says: {
        width: "100%",
    },
}));

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
