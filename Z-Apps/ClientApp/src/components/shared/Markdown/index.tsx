import React, { ReactChildren } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { ATargetBlankWithoutYouTube } from "../Link/ATargetBlank";
import { CodeRender } from "./CodeRender";
import { HeadingRenderer } from "./HeadingRenderer";
import { ImageRender } from "./ImageRender";
import "./index.css";
import { InlineCodeRender } from "./InlineCodeRender";
import { LinkRender, LinkWithoutShadowRender } from "./LinkBlockRender";
import { TableCellRender } from "./Table/TableCellRender";
import { TableRender } from "./Table/TableRender";

interface MarkdownProps {
    source: string;
    style?: React.CSSProperties;
    section?: boolean;
    noLinkShadow?: boolean;
    isForEdit?: boolean;
}
export function Markdown({
    source,
    style,
    section,
    noLinkShadow,
    isForEdit,
}: MarkdownProps) {
    const markdown = (
        <ReactMarkdown
            source={source}
            renderers={{
                link: isForEdit
                    ? ATargetBlankWithoutYouTube
                    : noLinkShadow
                    ? LinkWithoutShadowRender
                    : LinkRender,
                heading: HeadingRenderer,
                image: ImageRender,
                code: CodeRender,
                inlineCode: InlineCodeRender,
                paragraph: ParagraphRender,
                table: TableRender,
                tableCell: TableCellRender,
            }}
            plugins={[gfm]}
        />
    );

    return section ? (
        <section style={style} className="markdownArea">
            {markdown}
        </section>
    ) : (
        <div style={style} className="markdownArea">
            {markdown}
        </div>
    );
}

function ParagraphRender({ children }: { children: ReactChildren }) {
    return (
        <span
            style={{
                display: "block",
                marginBottom: 15,
            }}
        >
            {children}
        </span>
    );
}
