import { Input, Tooltip } from "@material-ui/core";
import PencilIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImgNumber } from ".";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import { Author } from "../../shared/Author";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { FolktaleMenu } from "../../shared/FolktaleMenu";
import Head from "../../shared/Helmet";
import { ScrollBox } from "../../shared/ScrollBox";
import { Page } from "./Edit";
import "./style.css";

const imgNumber = getImgNumber();

const ArticlesTop = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [articles, setArticles] = useState<Page[]>([]);
    const [newUrl, setNewUrl] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [urlEditTarget, setUrlEditTarget] = useState("");
    const [authors, setAuthors] = useState<Author[]>([]);

    const getArticles = async () => {
        const pagePromise = fetch("api/Articles/GetAllArticlesForEdit");
        const authorPromise = fetch("api/Articles/GetAllAuthors");

        setArticles(await (await pagePromise).json());
        setAuthors(await (await authorPromise).json());
    };

    useEffect(() => {
        void getArticles();

        const onChangeScreenSize = () => {
            if (width !== window.innerWidth) {
                setWidth(window.innerWidth);
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

        const saveData = localStorage.getItem("folktales-register-token");
        const objSaveData = saveData && JSON.parse(saveData);
        setToken(objSaveData?.token || "");
    }, []);

    const title = "Lingual Ninja Articles";
    const description =
        "Articles about studying Japanese language and culture! I hope these articles help you to learn about Japan!";

    return (
        <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
            <Head title={title} desc={description} noindex />
            <main style={{ maxWidth: 900, textAlign: "left" }}>
                <div
                    className="breadcrumbs"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                    style={{ textAlign: "left" }}
                >
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <Link
                            to="/"
                            itemProp="item"
                            style={{
                                marginRight: "5px",
                                marginLeft: "5px",
                            }}
                        >
                            <span itemProp="name">Home</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </span>
                    {" > "}
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <span
                            itemProp="name"
                            style={{
                                marginRight: "5px",
                                marginLeft: "5px",
                            }}
                        >
                            Articles
                        </span>
                        <meta itemProp="position" content="2" />
                    </span>
                </div>
                <h1
                    style={{
                        margin: "25px 0 40px",
                        fontWeight: "bolder",
                        textAlign: "center",
                    }}
                >
                    {title}
                </h1>
                <CharacterComment
                    imgNumber={imgNumber}
                    screenWidth={width}
                    comment={description.split("! ").map((d, i, arr) => (
                        <span key={i}>
                            {d + (i < arr.length - 1 ? "! " : "")}
                        </span>
                    ))}
                />
                {articles.some(page => page.url === newUrl) && (
                    <p style={{ color: "red" }}>
                        The url has already been registered!
                    </p>
                )}
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <span style={{ fontSize: "x-large" }}>{"New URL:"}</span>
                    <input
                        type="text"
                        value={newUrl}
                        onChange={e => setNewUrl(convertToUrl(e.target.value))}
                        style={{ width: "100%" }}
                    />
                    <Tooltip
                        title={
                            <span
                                style={{
                                    fontSize: "large",
                                }}
                            >
                                {!newUrl
                                    ? "Url is empty! Please type the new url first!"
                                    : "Add a new article"}
                            </span>
                        }
                        placement="top"
                    >
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (!newUrl) {
                                    alert(
                                        "Url is empty! Please type the new url first!"
                                    );
                                    return;
                                }

                                const confirmationResult = window.confirm(
                                    "Do you really want to add?"
                                );
                                if (!confirmationResult) {
                                    return;
                                }

                                localStorage.setItem(
                                    "folktales-register-token",
                                    JSON.stringify({ token })
                                );

                                const formData = new FormData();
                                formData.append("url", newUrl);
                                formData.append("token", token);

                                fetch("/api/Articles/AddNewUrl", {
                                    method: "POST",
                                    body: formData,
                                })
                                    .then(async response => {
                                        const {
                                            result,
                                        }: {
                                            result: string;
                                        } = await response.json();
                                        alert(result);
                                        setNewUrl("");
                                        void getArticles();
                                    })
                                    .catch(() => {
                                        alert("Failed to add...");
                                    });
                            }}
                            style={{
                                cursor: !newUrl ? "not-allowed" : "pointer",
                            }}
                        >
                            Add
                        </button>
                    </Tooltip>
                </div>
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <span style={{ fontSize: "x-large" }}>{"Token:"}</span>
                    <input
                        type="text"
                        defaultValue={token}
                        onChange={e => setToken(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ margin: "20px 0" }}>
                    {articles.length > 0 ? (
                        articles.map(page => (
                            <article
                                key={page.url}
                                style={{ marginBottom: 45 }}
                            >
                                <ScrollBox>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 10,
                                        }}
                                    >
                                        {urlEditTarget === page.url ? (
                                            <UrlEditor
                                                url={page.url}
                                                onSave={url => {
                                                    (async () => {
                                                        if (
                                                            !window.confirm(
                                                                "Do you really want to change the URL of this article?"
                                                            )
                                                        ) {
                                                            return;
                                                        }

                                                        if (!page.url) {
                                                            alert(
                                                                "The URL is empty! Please type new URL!"
                                                            );
                                                            return;
                                                        }

                                                        localStorage.setItem(
                                                            "folktales-register-token",
                                                            JSON.stringify({
                                                                token,
                                                            })
                                                        );

                                                        const formData =
                                                            new FormData();
                                                        formData.append(
                                                            "oldUrl",
                                                            page.url
                                                        );
                                                        formData.append(
                                                            "newUrl",
                                                            url
                                                        );
                                                        formData.append(
                                                            "token",
                                                            token
                                                        );

                                                        fetch(
                                                            "/api/Articles/UpdateUrl",
                                                            {
                                                                method: "POST",
                                                                body: formData,
                                                            }
                                                        )
                                                            .then(
                                                                async response => {
                                                                    const {
                                                                        result,
                                                                    }: {
                                                                        result: string;
                                                                    } = await response.json();
                                                                    alert(
                                                                        result
                                                                    );
                                                                    void getArticles();
                                                                    setUrlEditTarget(
                                                                        ""
                                                                    );
                                                                }
                                                            )
                                                            .catch(() => {
                                                                alert(
                                                                    "Failed to delete..."
                                                                );
                                                            });
                                                    })();
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <UrlTextWithPencil
                                                    url={page.url}
                                                    setUrlEditTarget={
                                                        setUrlEditTarget
                                                    }
                                                    released={page.released}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <Link to={`/articlesEdit/${page.url}`}>
                                        <h2>
                                            {page.title || "Add contents >>"}
                                        </h2>
                                    </Link>
                                    <p>
                                        {"Author: "}
                                        <span style={{ fontWeight: "bolder" }}>
                                            {
                                                authors.find(
                                                    a =>
                                                        a.authorId ===
                                                        page.authorId
                                                )?.authorName
                                            }
                                        </span>
                                    </p>
                                    <p style={{ margin: "0 0 20px" }}>
                                        {page.description}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}
                                        >
                                            {page.released && (
                                                <span
                                                    style={{
                                                        backgroundColor: "pink",
                                                        margin: 10,
                                                        padding: 10,
                                                    }}
                                                >
                                                    {"released"}
                                                </span>
                                            )}
                                            {page.isAboutFolktale && (
                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            "yellow",
                                                        margin: 10,
                                                        padding: 10,
                                                    }}
                                                >
                                                    {"folktale"}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip
                                                title={
                                                    <span
                                                        style={{
                                                            fontSize: "large",
                                                        }}
                                                    >
                                                        {"Delete this article"}
                                                    </span>
                                                }
                                                placement="top"
                                            >
                                                <DeleteIcon
                                                    style={{
                                                        width: 35,
                                                        height: 35,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        (async () => {
                                                            if (
                                                                !window.confirm(
                                                                    "Do you really want to delete this article?"
                                                                )
                                                            ) {
                                                                return;
                                                            }

                                                            if (
                                                                !window.confirm(
                                                                    "Do you really really really want to delete this article!?"
                                                                )
                                                            ) {
                                                                return;
                                                            }

                                                            if (
                                                                !page.url ||
                                                                typeof page.url !==
                                                                    "string"
                                                            ) {
                                                                alert(
                                                                    "The url of this article is invalid!"
                                                                );
                                                                return;
                                                            }

                                                            localStorage.setItem(
                                                                "folktales-register-token",
                                                                JSON.stringify({
                                                                    token,
                                                                })
                                                            );

                                                            const formData =
                                                                new FormData();
                                                            formData.append(
                                                                "url",
                                                                page.url
                                                            );
                                                            formData.append(
                                                                "token",
                                                                token
                                                            );

                                                            fetch(
                                                                "/api/Articles/Delete",
                                                                {
                                                                    method: "POST",
                                                                    body: formData,
                                                                }
                                                            )
                                                                .then(
                                                                    async response => {
                                                                        const {
                                                                            result,
                                                                        }: {
                                                                            result: string;
                                                                        } = await response.json();
                                                                        alert(
                                                                            result
                                                                        );
                                                                        void getArticles();
                                                                    }
                                                                )
                                                                .catch(() => {
                                                                    alert(
                                                                        "Failed to delete..."
                                                                    );
                                                                });
                                                        })();
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </ScrollBox>
                            </article>
                        ))
                    ) : (
                        <ShurikenProgress size="20%" />
                    )}
                    <FolktaleMenu screenWidth={width} />
                </div>
                <FB style={{ marginTop: 20 }} />
            </main>
        </div>
    );
};

function UrlTextWithPencil({
    url,
    setUrlEditTarget,
    released,
}: {
    url?: string;
    setUrlEditTarget: (url: string) => void;
    released?: boolean;
}) {
    return (
        <>
            <span
                style={{
                    marginRight: 10,
                    fontSize: "large",
                }}
            >
                {url}
            </span>
            <Tooltip
                title={
                    <span
                        style={{
                            fontSize: released ? "medium" : "large",
                        }}
                    >
                        {released
                            ? "This article was already released! Changing the URL after releasing is prohibited!"
                            : "Edit the URL of this article"}
                    </span>
                }
                placement="top"
            >
                <PencilIcon
                    style={{
                        cursor: released ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                        if (!url || released) {
                            return;
                        }
                        setUrlEditTarget(url);
                    }}
                />
            </Tooltip>
        </>
    );
}

function UrlEditor({
    url,
    onSave,
}: {
    url: string;
    onSave: (newUrl: string) => void;
}) {
    const [value, setValue] = useState(url);
    return (
        <>
            <Input
                type="text"
                value={value}
                onChange={ev => {
                    setValue(convertToUrl(ev.target.value));
                }}
                autoFocus
                style={{ height: 31, width: "50%", fontSize: "large" }}
            />
            <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                    onSave(value);
                }}
            >
                {"Save"}
            </button>
        </>
    );
}

function convertToUrl(str: string) {
    return str
        .split(" ")
        .join("-")
        .split("?")
        .join("-")
        .split("#")
        .join("-")
        .split("&")
        .join("-")
        .split(".")
        .join("-")
        .split(",")
        .join("-")
        .split("'")
        .join("")
        .split("`")
        .join("")
        .split(`"`)
        .join("")
        .split("_")
        .join("-")
        .split("/")
        .join("-")
        .split("\\")
        .join("-")
        .split("|")
        .join("-")
        .split("=")
        .join("-")
        .split("@")
        .join("-")
        .split(";")
        .join("-")
        .split(":")
        .join("-")
        .split("%")
        .join("-")
        .split("+")
        .join("-")
        .split("!")
        .join("-")
        .split("$")
        .join("-")
        .split("[")
        .join("-")
        .split("]")
        .join("-")
        .split("(")
        .join("-")
        .split(")")
        .join("-")
        .split("{")
        .join("-")
        .split("}")
        .join("-")
        .toLowerCase();
}

export default ArticlesTop;
