import { CSSProperties } from "aphrodite";
import React from "react";
import { css } from "../../../../common/util/getAphroditeClassName";

export function PointBox({
    language,
    children,
    style,
}: {
    language: string;
    children: React.ReactNode;
    style?: CSSProperties;
}) {
    let content = "'NOTE'";
    let background = "#e3f5d8";
    let border = undefined;
    let titleBackgroundColor = "#22ac38";
    if (language) {
        const [title, color] = language.split("-");
        content = `'${title.split("_").join(" ")}'`;
        if (color) {
            background = "white";
            border = `solid 1px ${color}`;
            titleBackgroundColor = color;
        }
    }

    return (
        <div>
            <div
                className={css({
                    ":before": {
                        fontSize: 15,
                        position: "absolute",
                        top: -23,
                        left: 0,
                        height: 23,
                        padding: "0 1em",
                        content,
                        color: "#fff",
                        borderRadius: "10px 10px 0 0",
                        background: titleBackgroundColor,
                    },
                    position: "relative",
                    padding: "15px 20px 2px",
                    color: "black",
                    borderRadius: "2px 10px 10px 10px",
                    background: background,
                    margin: "45px 0 30px",
                    display: "inline-block",
                    border,
                    ...style,
                })}
            >
                {children}
            </div>
        </div>
    );
}
