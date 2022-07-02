import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React, { useMemo } from "react";
import { gameOpenAnimationTime } from "../../../GameBase/GameFrame";
import { Direction } from "../../../types/Direction";
import { Renderable } from "../StageItems";

// 画面からはみ出したコンポーネントを隠すための黒いフレーム
export class BlackFrame extends Renderable {
    renderItem(UL: number) {
        return <BlackFrameComponent UL={UL} key={"BlackFrame"} />;
    }
}

function BlackFrameComponent({ UL }: { UL: number }) {
    const styles = useMemo<{ [key in Direction]: CSSProperties }>(
        () => ({
            top: {
                backgroundColor: "black",
                zIndex: 10000,
                position: "absolute",
                top: -50 * UL,
                left: -50 * UL,
                height: 50 * UL,
                width: 260 * UL,
                transition: gameOpenAnimationTime,
            },
            right: {
                backgroundColor: "black",
                zIndex: 10000,
                position: "absolute",
                top: -50 * UL,
                left: 160 * UL,
                height: 190 * UL,
                width: 50 * UL,
                transition: gameOpenAnimationTime,
            },
            bottom: {
                backgroundColor: "black",
                zIndex: 10000,
                position: "absolute",
                top: 75 * UL,
                left: -50 * UL,
                height: 50 * UL,
                width: 260 * UL,
                transition: gameOpenAnimationTime,
            },
            left: {
                backgroundColor: "black",
                zIndex: 10000,
                position: "absolute",
                top: -50 * UL,
                left: -50 * UL,
                height: 190 * UL,
                width: 50 * UL,
                transition: gameOpenAnimationTime,
            },
        }),
        [UL]
    );

    return (
        <>
            <div key="topBlackFrame" style={styles.top} />,
            <div key="rightBlackFrame" style={styles.right} />,
            <div key="bottomBlackFrame" style={styles.bottom} />,
            <div key="leftBlackFrame" style={styles.left} />,
        </>
    );
}
