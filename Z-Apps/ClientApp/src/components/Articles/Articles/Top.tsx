import { makeStyles } from "@material-ui/core/styles";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Page } from ".";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import { LazyLoad } from "../../../common/util/LazyLoad";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import { AuthorCard } from "../../shared/Author/Author";
import { Author } from "../../shared/Author/types";
import { LinkOrA } from "../../shared/Link/LinkOrA";
import { ScrollBox } from "../../shared/ScrollBox";

const initialArticlesNumber = 50;

interface ArticlesListProps {
    articles: Page[];
    screenWidth: number;
    titleH: "h2" | "h3";
    allAuthors: Author[];
}
export function ArticlesList({
    articles,
    screenWidth,
    titleH,
    allAuthors,
}: ArticlesListProps) {
    if (articles.length <= 0) {
        return <ShurikenProgress size="20%" />;
    }

    const isWide = screenWidth > 767;

    const imgSize = isWide
        ? {
              width: "100%",
              height: "100%",
          }
        : { width: "100%" };

    return (
        <>
            {articles.map((page, index) => {
                const articleScroll = (
                    <ArticleScroll
                        page={page}
                        isWide={isWide}
                        imgSize={imgSize}
                        titleH={titleH}
                        allAuthors={allAuthors}
                        screenWidth={screenWidth}
                        key={page.url}
                    />
                );

                if (index < initialArticlesNumber) {
                    return articleScroll;
                }
                return <LazyLoad key={page.url}>{articleScroll}</LazyLoad>;
            })}
        </>
    );
}

const url = "https://articles.lingual-ninja.com/articles";

function ArticleScroll({
    page,
    isWide,
    imgSize,
    titleH,
    allAuthors,
    screenWidth,
}: {
    page: Page;
    isWide: boolean;
    imgSize: CSSProperties;
} & Omit<ArticlesListProps, "articles">) {
    const c = useStyles();

    return (
        <article key={page.title} className={c.article}>
            <ScrollBox style={isWide ? { padding: 15 } : { padding: 10 }}>
                <div
                    className={spaceBetween(
                        "cancelCenter",
                        isWide ? c.wideDivInScroll : c.divInScroll
                    )}
                >
                    {page.imgPath && (
                        <div className={c.imgContainer}>
                            <LinkOrA href={`${url}/${page.url}`}>
                                <ArticleImg page={page} imgSize={imgSize} />
                            </LinkOrA>
                        </div>
                    )}
                    <div
                        className={
                            isWide ? c.wideArticleInfoBlock : c.articleInfoBlock
                        }
                    >
                        <div>
                            <LinkOrA href={`${url}/${page.url}`}>
                                {titleH === "h3" ? (
                                    <h3
                                        className={
                                            isWide
                                                ? c.widePageTitle
                                                : c.pageTitle
                                        }
                                    >
                                        {page.title}
                                    </h3>
                                ) : (
                                    <h2
                                        className={
                                            isWide
                                                ? c.widePageTitle
                                                : c.pageTitle
                                        }
                                    >
                                        {page.title}
                                    </h2>
                                )}
                            </LinkOrA>
                            <p
                                className={
                                    isWide ? c.wideDescription : c.description
                                }
                            >
                                {page.description.length > 200
                                    ? page.description.slice(0, 200) + "..."
                                    : page.description}
                            </p>
                        </div>
                        <div
                            className={
                                isWide
                                    ? c.wideAuthorCardContainer
                                    : c.authorCardContainer
                            }
                        >
                            <AuthorCard
                                author={allAuthors.find(
                                    a => a.authorId === page.authorId
                                )}
                                style={{ borderRadius: 0 }}
                                screenWidth={screenWidth}
                            />
                        </div>
                    </div>
                </div>
            </ScrollBox>
        </article>
    );
}
const useStyles = makeStyles(() => ({
    article: {
        marginBottom: 45,
        textAlign: "left",
        maxWidth: 900,
    },
    divInScroll: {
        display: "flex",
        flexDirection: "column",
    },
    wideDivInScroll: {
        display: "flex",
        flexDirection: "row",
    },
    imgContainer: {
        display: "block",
        flex: 1,
        maxHeight: 250,
        overflow: "hidden",
    },
    articleInfoBlock: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "10px 5px",
        alignItems: "flex-start",
    },
    wideArticleInfoBlock: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "0 0 10px 20px",
        alignItems: "flex-end",
    },
    pageTitle: {
        fontSize: "x-large",
    },
    widePageTitle: {
        fontSize: 27,
    },
    description: {
        fontSize: "medium",
        margin: 0,
    },
    wideDescription: {
        margin: 0,
    },
    authorCardContainer: {
        position: "relative",
        top: 10,
        left: -5,
        display: "flex",
        justifyContent: "flex-start",
    },
    wideAuthorCardContainer: {
        position: "relative",
        top: 10,
        left: 0,
        display: "flex",
        justifyContent: "flex-start",
    },
}));

function ArticleImg({ page, imgSize }: { page: Page; imgSize: CSSProperties }) {
    if (
        page.imgPath?.endsWith("/hqdefault.jpg") ||
        page.imgPath?.endsWith("/0.jpg")
    ) {
        return <TrimmedImg page={page} imgSize={imgSize} />;
    }

    return (
        <img
            alt={page.title}
            src={page.imgPath}
            style={{
                objectFit: "cover",
                margin: 0,
                ...imgSize,
            }}
        />
    );
}

function TrimmedImg({ page, imgSize }: { page: Page; imgSize: CSSProperties }) {
    const ref = useRef<HTMLImageElement>(null);
    const [height, setHeight] = useState(120);

    const currentWidth = ref.current?.width;

    useEffect(() => {
        if (currentWidth) {
            setHeight((currentWidth * 9) / 16 - 2);
        }
    }, [currentWidth]);

    return (
        <img
            alt={page.title}
            src={page.imgPath}
            style={{
                objectFit: "cover",
                objectPosition: "50% 50%",
                margin: 0,
                ...imgSize,
                height,
            }}
            ref={ref}
        />
    );
}
