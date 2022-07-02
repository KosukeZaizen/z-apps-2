import * as React from "react";
import "./style.css";

interface Props {
    style?: React.CSSProperties;
    children: React.ReactNode;
    hoverScale?: boolean;
}
export const ScrollBox = ({ children, style, hoverScale }: Props) => {
    return (
        <div
            style={style}
            className={`style-scroll ${hoverScale ? "hoverScale05" : ""}`}
        >
            {children}
        </div>
    );
};
