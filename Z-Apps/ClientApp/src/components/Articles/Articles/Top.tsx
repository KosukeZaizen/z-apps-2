import * as React from "react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Page } from ".";
import { LazyLoad } from "../../../common/util/LazyLoad";
import ShurikenProgress from "../../shared/Animations/ShurikenProgress";
import { Author, AuthorCard } from "../../shared/Author";
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
    return (
        <article
            key={page.title}
            style={{
                marginBottom: 45,
                textAlign: "left",
                maxWidth: 900,
            }}
        >
            <ScrollBox style={isWide ? { padding: 15 } : { padding: 10 }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: isWide ? "row" : "column",
                    }}
                    className="cancelCenter"
                >
                    {page.imgPath && (
                        <div
                            style={{
                                display: "block",
                                flex: 1,
                                maxHeight: 250,
                                overflow: "hidden",
                            }}
                        >
                            <LinkOrA href={`${url}/${page.url}`}>
                                <ArticleImg page={page} imgSize={imgSize} />
                            </LinkOrA>
                        </div>
                    )}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            margin: isWide ? "0 0 10px 20px" : "10px 5px",
                            alignItems: isWide ? "flex-end" : "flex-start",
                        }}
                    >
                        <div>
                            <LinkOrA href={`${url}/${page.url}`}>
                                {titleH === "h3" ? (
                                    <h3
                                        style={{
                                            fontSize: isWide
                                                ? "27px"
                                                : "x-large",
                                        }}
                                    >
                                        {page.title}
                                    </h3>
                                ) : (
                                    <h2
                                        style={{
                                            fontSize: isWide
                                                ? "27px"
                                                : "x-large",
                                        }}
                                    >
                                        {page.title}
                                    </h2>
                                )}
                            </LinkOrA>
                            <p
                                style={{
                                    fontSize: isWide ? undefined : "medium",
                                    margin: 0,
                                }}
                            >
                                {page.description.length > 200
                                    ? page.description.slice(0, 200) + "..."
                                    : page.description}
                            </p>
                        </div>
                        <div
                            style={{
                                position: "relative",
                                top: 10,
                                left: isWide ? 0 : -5,
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
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
