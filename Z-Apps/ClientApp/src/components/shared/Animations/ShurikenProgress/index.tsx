import * as React from "react";
import { appsPublicImg } from "../../../../common/consts";
import "./animation.css";

const shuriken = appsPublicImg + "shuriken.png";

interface Props {
    size?: string | number;
    style?: React.CSSProperties;
}
export default function ShurikenProgress({ size, style }: Props) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...style,
            }}
            className="center"
        >
            <img
                src={shuriken}
                alt="shuriken"
                className="ShurikenProgress"
                style={{ width: size, height: size }}
            />
        </div>
    );
}

export function FullScreenShurikenProgress({ style, size }: Props) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...style,
            }}
        >
            <ShurikenProgress size={size || "20%"} />
        </div>
    );
}
