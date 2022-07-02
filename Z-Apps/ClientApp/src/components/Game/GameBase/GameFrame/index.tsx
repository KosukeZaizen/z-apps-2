import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { GameMenu } from "../Menu";
import "./style.css";

export const gameOpenAnimationTime = "500ms";

export function GameFrame({
    UL,
    children,
}: {
    UL: number;
    children: JSX.Element;
}) {
    const isBackgroundBlack = useIsBackgroundBlack();

    const outsideDivStyle = useMemo<CSSProperties>(
        () => ({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            userSelect: "none",
            // touchCallout: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }),
        []
    );
    const insideDivStyle = useMemo<CSSProperties>(
        () => ({
            position: "absolute",
            backgroundColor: isBackgroundBlack ? "black" : "white",
            width: 160 * UL,
            height: 90 * UL,
            transition: gameOpenAnimationTime,
        }),
        [isBackgroundBlack, UL]
    );

    return (
        <div style={outsideDivStyle}>
            <div id={"game-screen"} style={insideDivStyle}>
                <GameMenu UL={UL} />
                {children}
            </div>
        </div>
    );
}

function useIsBackgroundBlack() {
    const [isBackgroundBlack, setIsBackgroundBlack] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            // make background color white on initial loading, otherwise black
            setIsBackgroundBlack(true);
        }, 4000);
    }, []);

    return isBackgroundBlack;
}
