import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Z_APPS_TOP_URL } from "../../../common/consts";
import { cFetch } from "../../../common/util/cFetch";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import { AuthorArea, AuthorCard } from "../../shared/Author/Author";
import { Author } from "../../shared/Author/types";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { AnchorLink, HashScroll } from "../../shared/HashScroll";
import Head from "../../shared/Helmet";
import { Markdown } from "../../shared/Markdown";
import { ScrollBox } from "../../shared/ScrollBox";
import { FBShareBtn, TwitterShareBtn } from "../../shared/SnsShareButton";
import "./style.css";
import { ArticlesList } from "./Top";

export interface Page {
    url?: string;
    title: string;
    description: string;
    articleContent: string;
    imgPath?: string;
    isAboutFolktale?: boolean;
    authorId: number;
}

export function getImgNumber(num: number = 0) {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate() + num;
    const mod = todayNumber % 30;
    if (mod > 22) return 2;
    if (mod > 14) return 3;
    return 1;
}

const Articles = ({
    match: {
        params: { pageName },
    },
    history,
    location,
}: RouteComponentProps<{ pageName: string }>) => {
    const [title, setTitle] = useState<Page["title"]>("");
    const [description, setDescription] = useState<Page["description"]>("");
    const [content, setContent] = useState<Page["articleContent"]>("");
    const [isAboutFolktale, setIsAboutFolktale] =
        useState<Page["isAboutFolktale"]>(false);
    const [indexLi, setIndexLi] = useState<JSX.Element[]>([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [imgNumber, setImgNumber] = useState(getImgNumber(pageName.length));
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const [author, setAuthor] = useState<Author | undefined>(undefined);

    useEffect(() => {
        setTitle("");
        setDescription("");
        setContent("");
        setIsAboutFolktale(false);

        const getArticle = async () => {
            try {
                const lowerPageName = pageName.toLowerCase();
                if (pageName !== lowerPageName) {
                    history.push(`/articles/${lowerPageName}`);
                    return;
                }

                const response: Response = await cFetch(
                    `api/Articles/GetArticle?p=${pageName}`
                );
                const page: Page = await response.json();
                const {
                    title,
                    description,
                    articleContent,
                    isAboutFolktale,
                    authorId,
                } = page;
                setTitle(title);
                setDescription(description);
                setContent(articleContent);
                setIsAboutFolktale(isAboutFolktale);

                const authors: Author[] = await (
                    await fetch("api/Articles/GetAllAuthors")
                ).json();
                setAllAuthors(authors);
                setAuthor(authors.find(a => a.authorId === authorId));
            } catch (e) {
                history.push(`/not-found?p=/articles/${pageName}`);
            }
        };
        void getArticle();

        let timer: number;
        window.onresize = () => {
            if (timer > 0) {
                clearTimeout(timer);
            }
            timer = window.setTimeout(() => {
                setScreenWidth(window.innerWidth);
            }, 100);
        };

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                setScreenWidth(window.innerWidth);
            }, i * 1000);
        }

        setImgNumber(getImgNumber(pageName.length));

        return () => {
            window.onresize = null;
        };
    }, [pageName]);

    useEffect(() => {
        setIndexLi(getIndex(content));
    }, [content]);

    return (
        <div style={{ width: "100%" }} className="center">
            <Head title={title} desc={description} />
            <ArticleContent
                pageName={pageName}
                title={title}
                description={description}
                imgNumber={imgNumber}
                width={screenWidth}
                indexLi={indexLi}
                content={content}
                adsense={true}
                isAboutFolktale={isAboutFolktale}
                allAuthors={allAuthors}
                author={author}
                screenWidth={screenWidth}
            />
            {/* <GoogleAd /> */}
            <HashScroll
                allLoadFinished={indexLi.length > 0}
                location={location}
            />
        </div>
    );
};

// export const excludedArticleTitles = ["Kamikaze"];
export const excludedArticleTitles = [];

// 0 から 4.9 まで 0.1 刻み
const textShadow = Array.from(Array(50).keys())
    .map(n => `0 0 ${n / 10}px white`)
    .join(",");

interface ArticleContentProps {
    pageName: string;
    title: string;
    description: string;
    isAboutFolktale?: boolean;
    imgNumber: number;
    width: number;
    indexLi: JSX.Element[];
    content: string;
    adsense: boolean;
    allAuthors: Author[];
    author?: Author;
    screenWidth: number;
    isForEdit?: boolean;
}
export function ArticleContent({
    pageName,
    title,
    description,
    imgNumber,
    width,
    indexLi,
    content,
    //adsense,
    isAboutFolktale,
    author,
    allAuthors,
    screenWidth,
    isForEdit,
}: ArticleContentProps) {
    const [otherArticles, setOtherArticles] = useState<Page[]>([]);

    useEffect(() => {
        if (title) {
            const getArticles = async () => {
                const url = "api/Articles/GetRandomArticles";

                const titlesToExclude = [title, ...excludedArticleTitles];
                const param = `?num=10&${titlesToExclude
                    .map(t => `wordsToExclude=${t}`)
                    .join("&")}${
                    isAboutFolktale ? "&isAboutFolktale=true" : ""
                }`;

                const response: Response = await cFetch(url + param);
                const pages: Page[] = await response.json();
                setOtherArticles(pages);
            };
            getArticles();
        }
    }, [title, isAboutFolktale]);

    const isWide = width > 991;

    return (
        <main style={{ maxWidth: 800 }}>
            <BreadCrumbs title={title} />
            <article style={{ textAlign: "left" }}>
                {title ? (
                    <h1
                        style={{
                            margin: "25px auto 30px",
                            textAlign: "center",
                        }}
                        className="whiteShadow"
                    >
                        {title}
                    </h1>
                ) : (
                    <ShurikenProgress size="10%" />
                )}
                <CharacterComment
                    imgNumber={imgNumber}
                    screenWidth={width}
                    comment={description || <ShurikenProgress size="20%" />}
                    style={{
                        marginBottom: 15,
                    }}
                    commentStyle={{ paddingLeft: 25, paddingRight: 20 }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: isWide ? "row" : "column",
                    }}
                >
                    <ScrollBox
                        style={{
                            display: "inline-block",
                            flex: 1,
                            marginRight: isWide ? 30 : undefined,
                        }}
                    >
                        <div
                            style={{
                                fontSize: "large",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                Index
                            </div>
                            {indexLi && indexLi.length > 0 ? (
                                <ol
                                    style={{
                                        display: "inline-block",
                                        margin: 0,
                                    }}
                                >
                                    {indexLi}
                                </ol>
                            ) : (
                                <ShurikenProgress size="20%" />
                            )}
                        </div>
                    </ScrollBox>
                </div>

                <AuthorCard
                    author={author}
                    style={{ marginTop: 30 }}
                    screenWidth={screenWidth}
                />

                {content ? (
                    <Markdown
                        source={content}
                        style={{ margin: "25px 0 40px", textShadow }}
                        isForEdit={isForEdit}
                    />
                ) : (
                    <ShurikenProgress size="20%" />
                )}
            </article>
            <CharacterComment
                comment={
                    <>
                        <p style={{ textAlign: "center" }}>
                            {"If you like this article, please share!"}
                        </p>
                        <FBShareBtn
                            key="fbShareButton"
                            urlToShare={`${Z_APPS_TOP_URL}/articles/${pageName}`}
                            style={{
                                width: "200px",
                                marginTop: "10px",
                            }}
                        />
                        <TwitterShareBtn
                            key="twitterShareButton"
                            urlToShare={`${Z_APPS_TOP_URL}/articles/${pageName}`}
                            textToShare={title}
                            style={{
                                width: "200px",
                                marginTop: "5px",
                            }}
                        />
                    </>
                }
                imgNumber={(imgNumber - 1 || 3) - 1 || 3}
                screenWidth={width}
            />
            <hr />
            <AuthorArea
                style={{ marginTop: 45 }}
                screenWidth={width}
                author={author}
            />
            <hr />
            <section>
                <h2 className="markdownH2" style={{ marginBottom: 55 }}>
                    More Articles
                </h2>
                <ArticlesList
                    titleH={"h3"}
                    articles={otherArticles}
                    screenWidth={width}
                    allAuthors={allAuthors}
                />
            </section>
            <hr />
            <FB />
        </main>
    );
}

export function BreadCrumbs({ title }: { title: string }) {
    return (
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
                <a
                    onClick={ev => {
                        ev.preventDefault();
                        if (
                            window.confirm(
                                "If you need to save your progress, please save it before jumping to the top page!\nDo you really want to jump to the top page?"
                            )
                        ) {
                            window.location.href = "/articlesEdit";
                        }
                    }}
                    itemProp="item"
                    style={{
                        marginRight: "5px",
                        marginLeft: "5px",
                    }}
                    href=""
                >
                    <span itemProp="name">{"Home"}</span>
                </a>
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
                    {title}
                </span>
                <meta itemProp="position" content="2" />
            </span>
        </div>
    );
}

export function getIndex(content: string) {
    return content
        .split("\n")
        .filter(c => c.includes("##") && !c.includes("###"))
        .map(c => {
            const linkText = c.split("#").join("").trim();
            const encodedUrl = encodeURIComponent(linkText);
            return (
                <li key={linkText} style={{ marginTop: 10, marginBottom: 5 }}>
                    <AnchorLink targetHash={`#${encodedUrl}`}>
                        {linkText}
                    </AnchorLink>
                </li>
            );
        });
}

export default Articles;
