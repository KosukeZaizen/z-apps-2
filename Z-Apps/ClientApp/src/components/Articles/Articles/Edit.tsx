import { Card, Tooltip } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import ArrowForward from "@material-ui/icons/ArrowForward";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ArticleContent, BreadCrumbs, getIndex } from ".";
import {
    articlesStorage,
    ARTICLES_URL,
    BLOB_URL,
} from "../../../common/consts";
import { checkThumbnailExistence } from "../../../common/util/checkThumbnailExistence";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import { Author } from "../../shared/Author";
import Head from "../../shared/Helmet";
import { Markdown } from "../../shared/Markdown";
import { checkImgExtension } from "../../shared/Markdown/ImageRender";
import { RightPanel } from "../../shared/Panel/RightPanel";
import { AuthorEditor } from "./AuthorEditor";
import "./style.css";

export interface Page {
    url?: string;
    title: string;
    description: string;
    articleContent: string;
    released?: boolean;
    isAboutFolktale?: boolean;
    authorId: number;
}

export const getImgNumber = (num: number = 0) => {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate() + num;
    const mod = todayNumber % 30;
    if (mod > 22) return 2;
    if (mod > 14) return 3;
    return 1;
};

const Articles = ({
    match: {
        params: { pageName },
    },
    history,
}: RouteComponentProps<{ pageName: string }>) => {
    const [title, setTitle] = useState<Page["title"]>("");
    const [description, setDescription] = useState<Page["description"]>("");
    const [content, setContent] = useState<Page["articleContent"]>("");
    const [released, setReleased] = useState<Page["released"]>(false);
    const [isAboutFolktale, setIsAboutFolktale] =
        useState<Page["isAboutFolktale"]>(false);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const [openAuthorEditor, setOpenAuthorEditor] = useState(false);
    const [authorImgVersion, setAuthorImgVersion] = useState(0);
    const [author, setAuthor] = useState<Author | undefined>(undefined);

    const [openSamplePanel, setOpenSamplePanel] = useState(false);

    const [indexLi, setIndexLi] = useState<JSX.Element[]>([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [imgNumber, setImgNumber] = useState(getImgNumber(pageName.length));
    const [token, setToken] = useState("");

    const getArticle = async () => {
        try {
            const lowerPageName = pageName.toLowerCase();
            if (pageName !== lowerPageName) {
                history.push(`/articlesEdit/${lowerPageName}`);
                return;
            }

            const response: Response = await fetch(
                `api/Articles/GetArticleForEdit?p=${pageName}`
            );
            const page: Page = await response.json();
            const {
                title,
                description,
                articleContent,
                released,
                isAboutFolktale,
                authorId,
            } = page;
            setTitle(title);
            setDescription(description);
            setContent(articleContent);
            setReleased(released);
            setIsAboutFolktale(isAboutFolktale);

            const authorResponse: Response = await fetch(
                "api/Articles/GetAllAuthors"
            );
            const authors: Author[] = await authorResponse.json();
            setAllAuthors(authors);
            setAuthor(authors.find(a => a.authorId === authorId));
            setAuthorImgVersion(authorImgVersion + 1);
        } catch (e) {
            alert("Something is wrong!");
        }
    };

    useEffect(() => {
        void getArticle();

        const onChangeScreenSize = () => {
            if (screenWidth !== window.innerWidth) {
                setScreenWidth(window.innerWidth);
            }
            if (height !== window.innerHeight) {
                setHeight(window.innerHeight);
            }
        };

        let timer: number;
        window.onresize = () => {
            if (timer > 0) {
                clearTimeout(timer);
            }
            timer = window.setTimeout(() => {
                onChangeScreenSize();
            }, 100);
        };

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                onChangeScreenSize();
            }, i * 1000);
        }

        setImgNumber(getImgNumber(pageName.length));

        const saveData = localStorage.getItem("folktales-register-token");
        const objSaveData = saveData && JSON.parse(saveData);
        setToken(objSaveData?.token || "");
    }, [pageName]);

    useEffect(() => {
        if (!content) return;
        setIndexLi(getIndex(content));
    }, [content]);

    const save = async () => {
        try {
            // convert h1 to h2
            const replacedContent = content.replace(
                /^(\s*)#(\s+\S+)$/m,
                "$1##$2"
            );

            const imgLine = replacedContent
                ?.split(/\r?\n/g)
                ?.find(
                    c =>
                        c.includes("![") &&
                        (checkImgExtension(c) || c.includes("](youtube)"))
                );

            const imgPath = await getImgPath(imgLine);

            const formData = new FormData();
            formData.append("url", pageName);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("articleContent", replacedContent);
            formData.append("imgPath", imgPath);
            formData.append(
                "isAboutFolktale",
                isAboutFolktale ? "true" : "false"
            );
            formData.append("token", token);

            const res = await fetch("/api/Articles/UpdateContents", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            getArticle();

            return result.result;
        } catch (e) {
            return "Failed to save...";
        }
    };

    return (
        <div
            style={{
                position: "relative",
            }}
        >
            <Head title={title} desc={description} noindex />
            <BreadCrumbs title={title} />
            <button
                style={{
                    position: "absolute",
                    top: 30,
                    left: 10,
                    zIndex: 5000,
                    width: "33%",
                }}
                className="btn btn-primary"
                onClick={() => {
                    (async () => {
                        await save();

                        window.open(
                            `${ARTICLES_URL}/preview/${pageName}`,
                            undefined,
                            `left=0, top=0, width=${window.screen.width}, height=${window.screen.height}`
                        );
                    })();
                }}
            >
                {"Full screen preview"}
            </button>
            <div
                style={{ width: "100%", height: height - 130, display: "flex" }}
            >
                <div
                    style={{
                        flex: 1,
                        padding: "60px 30px 30px",
                        height: height - 130,
                        overflowY: "scroll",
                        marginRight: 15,
                    }}
                >
                    <ArticleContent
                        pageName={pageName}
                        title={title}
                        description={description}
                        imgNumber={imgNumber}
                        width={screenWidth / 3}
                        indexLi={indexLi}
                        content={content}
                        adsense={false}
                        isAboutFolktale={isAboutFolktale}
                        allAuthors={allAuthors}
                        author={author}
                        screenWidth={screenWidth}
                        isForEdit
                    />
                </div>
                <div
                    style={{
                        flex: 2,
                        width: "100%",
                        overflowY: "scroll",
                    }}
                >
                    <div style={{ display: "flex" }}>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ width: "100%" }}
                        />
                        {author?.isAdmin && (
                            <button
                                onClick={() => {
                                    setTitle("folktale");
                                    setDescription(pageName);
                                }}
                            >
                                folktale
                            </button>
                        )}
                    </div>
                    {title != "folktale" && (
                        <textarea
                            style={{ width: "100%", height: 90 }}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    )}
                    <textarea
                        style={{
                            width: "100%",
                            height:
                                title != "folktale"
                                    ? height - 270
                                    : height - 170,
                            padding: 10,
                        }}
                        value={content}
                        onChange={e => {
                            setContent(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {released && (
                    <span style={{ color: "red", margin: "0 15px" }}>
                        {"released"}
                    </span>
                )}
                <input
                    type="text"
                    style={{ width: 150, margin: 15 }}
                    onChange={e => setToken(e.target.value)}
                    defaultValue={token}
                    placeholder="Access Token"
                />
                {author?.isAdmin && (
                    <span style={{ margin: 15 }}>
                        {"isAboutFolktale:"}
                        <input
                            type="checkbox"
                            checked={isAboutFolktale}
                            onChange={ev =>
                                setIsAboutFolktale(ev.target.checked)
                            }
                        />
                    </span>
                )}
                <button
                    className="btn btn-primary"
                    style={{ margin: 15 }}
                    onClick={async () => {
                        const confirmationResult = window.confirm(
                            "Do you really want to save?"
                        );
                        if (!confirmationResult) {
                            return;
                        }

                        localStorage.setItem(
                            "folktales-register-token",
                            JSON.stringify({ token })
                        );

                        alert(await save());
                    }}
                >
                    Save
                </button>
                <button
                    className="btn btn-primary"
                    style={{ margin: 15 }}
                    disabled={released}
                    onClick={async () => {
                        const confirmationResult = window.confirm(
                            "Do you really want to release?"
                        );
                        if (!confirmationResult) {
                            return;
                        }

                        const resultSave = await save();
                        if (resultSave !== "success") {
                            alert(resultSave);
                            return;
                        }

                        const formData = new FormData();
                        formData.append("url", pageName);
                        formData.append("token", token);

                        fetch("/api/Articles/Register", {
                            method: "POST",
                            body: formData,
                        })
                            .then(async response => {
                                const result: {
                                    result: string;
                                } = await response.json();
                                alert(result.result);

                                if (result.result === "success") {
                                    setTimeout(() => {
                                        window.open(
                                            `${ARTICLES_URL}/${pageName}`,
                                            "_blank"
                                        );
                                    }, 1000);
                                    void getArticle();
                                }
                            })
                            .catch(() => {
                                alert("Failed to release...");
                            });
                    }}
                >
                    Release
                </button>
                <button
                    className="btn btn-primary"
                    style={{ margin: 15 }}
                    disabled={!released}
                    onClick={() => {
                        const confirmationResult = window.confirm(
                            "Do you really want to hide?"
                        );
                        if (!confirmationResult) {
                            return;
                        }

                        localStorage.setItem(
                            "folktales-register-token",
                            JSON.stringify({ token })
                        );

                        const formData = new FormData();
                        formData.append("url", pageName);
                        formData.append("token", token);

                        fetch("/api/Articles/Hide", {
                            method: "POST",
                            body: formData,
                        })
                            .then(async response => {
                                const { result } = await response.json();
                                alert(result);

                                if (result === "success") {
                                    void getArticle();
                                }
                            })
                            .catch(() => {
                                alert("Failed to hide...");
                            });
                    }}
                >
                    Hide
                </button>
                <MultimediaButton token={token} folderName={pageName} />
                <button
                    className="btn btn-primary"
                    style={{ margin: 15 }}
                    onClick={() => {
                        setOpenSamplePanel(true);
                    }}
                >
                    Markdown Sample
                </button>
                {author && (
                    <Tooltip
                        title={
                            <span
                                style={{
                                    fontSize: "large",
                                }}
                            >
                                {"Edit Author Info"}
                            </span>
                        }
                        placement="top"
                    >
                        <img
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                objectPosition: "50% 50%",
                                borderRadius: "50%",
                                marginLeft: 15,
                                cursor: "pointer",
                            }}
                            src={`${articlesStorage}_authors/${author.authorId}${author.imgExtension}?v=${authorImgVersion}`}
                            onClick={() => {
                                setOpenAuthorEditor(true);
                            }}
                        />
                    </Tooltip>
                )}
            </div>
            <SamplePanel
                openSamplePanel={openSamplePanel}
                setOpenSamplePanel={setOpenSamplePanel}
                screenWidth={screenWidth}
            />
            <AuthorPanel
                author={author}
                openAuthorEditor={openAuthorEditor}
                setOpenAuthorEditor={setOpenAuthorEditor}
                screenWidth={screenWidth}
                getArticle={getArticle}
                token={token}
            />
        </div>
    );
};

async function getImgPath(imgLine?: string): Promise<string> {
    if (!imgLine) {
        return "";
    }

    if (!imgLine.includes("](youtube)")) {
        return imgLine.split("](")[1].replace(")", "");
    }

    const videoId = imgLine.replace("![", "").replace("](youtube)", "");

    if (await checkThumbnailExistence(videoId, "hq720.jpg")) {
        return `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
    }

    if (await checkThumbnailExistence(videoId, "hqdefault.jpg")) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

export default Articles;

const samples = [
    { title: "Bold", content: `It's **bold** here!` },
    { title: "Red", content: `It's \`red\` here!` },
    { title: "Yellow background", content: `It's *yellow* here!` },
    {
        title: "Table",
        content: `| header1 | header2 | header3 |\n|    -    |    -    |    -    |\n|   aaa   |   bbb   |   ccc   |\n|   ddd   |   eee   |   fff   |`,
    },
    { title: "H2 header", content: `## This is h2 header\nThis is a content.` },
    {
        title: "H3 header",
        content: `### This is h3 header\nThis is a content.`,
    },
    {
        title: "H4 header",
        content: `#### This is h4 header\nThis is a content.`,
    },
    {
        title: "Link",
        content: "[Jump to Lingual Ninja](https://www.lingual-ninja.com)",
    },
    {
        title: "Unordered list",
        content: `- Item1\n- Item2\n- Item3`,
    },
    {
        title: "Ordered list",
        content: `1. Item1\n2. Item2\n3. Item3`,
    },
    {
        title: "Blockquote",
        content: `> When we quote sentences from other website, we need to use this.  \n> To break lines in Blockquote, we need to put two spaces  \n> at the end of the line.`,
    },
    {
        title: "Green box",
        content: `\`\`\`This_is_the_title\nThis is a content.\n\`\`\``,
    },
    {
        title: "Green box (without title)",
        content: `\`\`\`box\nThis is a content.\n\`\`\``,
    },
    {
        title: "Hidden block",
        content: `\`\`\`button-Show_The_Answer-Close\nこれ は おちゃ です。\n\`\`\``,
    },
    {
        title: "Sample sentence",
        content: `\`\`\`e\n天気が良ければ公園に行こう。\nてんき が よけれ ば こうえん に いこ う。\nte n ki ga yo ke re ba ko u e n ni i ko u\nIf the weather is good, let's go to the park.\n{K:[3,7],H:[6,11],R:[11,22],E:[0,2,18,22]}\nhttps://lingualninja.blob.core.windows.net/lingual-storage/articles/japanese-i-adjectives-list-for-jlpt-n5/hypothetical_form.m4a\n["天気","てんき","weather","が","","が is a Japanese particle that is used right after the subject of a verb.","良ければ","よければ","If ... is good","公園","こうえん","park","に","","to","行こう","いこう","Let's go"]\n\`\`\``,
    },
    {
        title: "Sample sentence (with borders)",
        content: `\`\`\`Example-black\n\`\`\`e\n天気が良ければ公園に行こう。\nてんき が よけれ ば こうえん に いこ う。\nte n ki ga yo ke re ba ko u e n ni i ko u\nIf the weather is good, let's go to the park.\n{K:[3,7],H:[6,11],R:[11,22],E:[0,2,18,22]}\nhttps://lingualninja.blob.core.windows.net/lingual-storage/articles/japanese-i-adjectives-list-for-jlpt-n5/hypothetical_form.m4a\n["天気","てんき","weather","が","","が is a Japanese particle that is used right after the subject of a verb.","良ければ","よければ","If ... is good","公園","こうえん","park","に","","to","行こう","いこう","Let's go"]\n\`\`\``,
    },
] as const;

function SamplePanel({
    openSamplePanel,
    setOpenSamplePanel,
    screenWidth,
}: {
    openSamplePanel: boolean;
    setOpenSamplePanel: (open: boolean) => void;
    screenWidth: number;
}) {
    return (
        <RightPanel
            open={openSamplePanel}
            onClose={() => {
                setOpenSamplePanel(false);
            }}
            style={{ backgroundColor: "#F2F2F2" }}
            panelWidth={screenWidth - 30}
        >
            <div style={{ padding: 10 }}>
                <h2>Markdown Samples</h2>
                <p>Please copy to use them!</p>
                {samples.map(s => (
                    <SampleCard key={s.title} {...s} />
                ))}
            </div>
        </RightPanel>
    );
}

function SampleCard({ title, content }: { title: string; content: string }) {
    return (
        <Card style={{ padding: 10, margin: "10px 0" }}>
            <h3>{title}</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <code style={{ whiteSpace: "pre-wrap" }}>
                        {content.split("\n").map((c, i) => (
                            <div key={i}>{c}</div>
                        ))}
                    </code>
                </div>
                <ArrowForward
                    style={{
                        width: 35,
                        height: 35,
                        cursor: "pointer",
                    }}
                />
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Markdown source={content} isForEdit />
                </div>
            </div>
        </Card>
    );
}

function AuthorPanel({
    author,
    openAuthorEditor,
    setOpenAuthorEditor,
    screenWidth,
    getArticle,
    token,
}: {
    author?: Author;
    openAuthorEditor: boolean;
    setOpenAuthorEditor: (open: boolean) => void;
    screenWidth: number;
    getArticle: () => void;
    token: string;
}) {
    return (
        <RightPanel
            open={openAuthorEditor}
            onClose={() => {
                setOpenAuthorEditor(false);
            }}
            style={{ backgroundColor: "#F2F2F2" }}
            panelWidth={screenWidth - 30}
        >
            {author ? (
                <AuthorEditor
                    initialAuthor={author}
                    onClose={() => {
                        getArticle();
                        setOpenAuthorEditor(false);
                    }}
                    token={token}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ShurikenProgress size="20%" />
                </div>
            )}
        </RightPanel>
    );
}

const createMarkdown = "Create markdown";
function MultimediaButton({
    token,
    folderName,
}: {
    token: string;
    folderName: string;
}) {
    const multimediaRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File>();
    const [submitting, setSubmitting] = useState(false);

    const message = file
        ? `Please push the "${createMarkdown}" button`
        : "Please choose the file to embed in the article";

    return (
        <>
            <button
                className="btn btn-primary"
                style={{ margin: 15 }}
                onClick={() => {
                    setOpen(true);
                }}
            >
                <span ref={multimediaRef}>Multimedia</span>
            </button>
            <Popover open={open} anchorEl={multimediaRef.current}>
                {submitting ? (
                    <div
                        style={{
                            padding: 50,
                            width: 456,
                            height: 271,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ShurikenProgress size="20%" />
                    </div>
                ) : (
                    <div style={{ padding: 50, width: 456, height: 271 }}>
                        <p style={{ color: "red" }}>{message}</p>
                        <input
                            type="file"
                            name="file"
                            onChange={e => {
                                const target = e.target;
                                const file = target.files?.item(0);
                                if (file) {
                                    setFile(file);
                                }
                            }}
                        />
                        <div style={{ display: "flex", marginTop: 30 }}>
                            <button
                                className="btn btn-primary"
                                style={{ margin: 15 }}
                                onClick={() => {
                                    setFile(undefined);
                                    setOpen(false);
                                }}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ margin: 15 }}
                                onClick={() => {
                                    if (!file) {
                                        return;
                                    }
                                    setSubmitting(true);

                                    const formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("folderName", folderName);
                                    formData.append("token", token);

                                    (async () => {
                                        const res = await fetch(
                                            "/api/Articles/UploadMedia",
                                            {
                                                method: "POST",
                                                body: formData,
                                            }
                                        );
                                        const result = await res.json();
                                        if (result.result !== "ok") {
                                            alert(
                                                result.result ||
                                                    "File upload failed! Something is wrong!"
                                            );
                                            setSubmitting(false);
                                            return;
                                        }

                                        const copyResult = execCopy(
                                            `![${
                                                file.name.split(".")[0]
                                            }](${BLOB_URL}/articles/_multimedia/${folderName}/${file.name
                                                .split(" ")
                                                .join("_")})`
                                        );
                                        if (!copyResult) {
                                            alert(
                                                `Copy failed! Please try "${createMarkdown}" again!`
                                            );
                                            setSubmitting(false);
                                            return;
                                        }
                                        setFile(undefined);
                                        setOpen(false);
                                        setSubmitting(false);

                                        alert(
                                            "Markdown was successfully created and copied! Please just paste it by pushing [Ctrl + v]!"
                                        );
                                    })();
                                }}
                                disabled={!file}
                            >
                                {createMarkdown}
                            </button>
                        </div>
                    </div>
                )}
            </Popover>
        </>
    );
}

function execCopy(string?: string) {
    const tmp = document.createElement("div");
    const pre = document.createElement("pre");

    pre.style.webkitUserSelect = "auto";
    pre.style.userSelect = "auto";

    tmp.appendChild(pre).textContent = string || null;

    const s = tmp.style;
    s.position = "fixed";
    s.right = "200%";

    document.body.appendChild(tmp);
    void document.getSelection()?.selectAllChildren(tmp);

    const result = document.execCommand("copy");

    document.body.removeChild(tmp);

    return result;
}
