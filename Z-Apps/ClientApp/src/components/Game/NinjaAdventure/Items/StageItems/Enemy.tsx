import React, { CSSProperties, useMemo } from "react";
import { StageItem } from ".";
import { timeStep } from "../..";
import { css } from "../../../../../common/util/getAphroditeClassName";
import { gameOpenAnimationTime } from "../../../GameBase/GameFrame";
import { ImgSrc } from "../../../StorageItems";
import { Direction } from "../../../types/Direction";
import { Ninja } from "../Ninja";

const damageAnimationDuration = 500; //ms

const opacityKeyframes = {
    "0%": {
        opacity: 1,
    },
    "25%": {
        opacity: 0,
    },
    "50%": {
        opacity: 1,
    },
    "75%": {
        opacity: 0,
    },
    "100%": {
        opacity: 1,
    },
};

interface Props {
    key: string;
    x: number;
    y: number;
    width: number;
    zIndex?: number;
    imgSrc: ImgSrc;
    life: number;
}

export class Enemy extends StageItem {
    isGoingRight: boolean;
    currentLife: number;
    initialLife: number;
    isDamaged: boolean;
    speedY: number;
    isDead: boolean;
    imgSrc: Props["imgSrc"];

    constructor(props: Props) {
        const { imgSrc, ...rest } = props;
        super({ type: "enemy", ...rest });
        this.isGoingRight = false;
        this.isDamaged = false;
        this.speedY = 0;
        this.isDead = false;
        this.currentLife = props.life;
        this.initialLife = props.life;
        this.imgSrc = imgSrc;
    }

    onEachTime(ninja: Ninja) {
        if (this.y > 90) {
            return;
        }

        if (!this.isDead) {
            // 敵キャラ生存時の位置更新
            this.calcNextPosition(ninja);
        } else {
            // 速度から位置更新（死亡時の落下）
            this.speedY += 2;
            this.y += this.speedY;
        }
    }

    private calcNextPosition(ninja: Ninja) {
        // 忍者に向かって近づいてくる
        const ninjaCenter = [
            ninja.x + ninja.width / 2,
            ninja.y + ninja.width / 2,
        ];
        const enemyCenter = [this.x + this.width / 2, this.y + this.width / 2];

        const dX = ninjaCenter[0] - enemyCenter[0];
        const dY = ninjaCenter[1] - enemyCenter[1];

        const d = Math.sqrt(dX ** 2 + dY ** 2);

        this.x += dX / d;
        this.y += dY / d;

        // 左右の向きの判定
        this.isGoingRight = dX > 0;
    }

    onTouchNinja(ninja: Ninja) {
        const ninjaDirection = this.getTargetDirection(ninja);
        if (ninjaDirection === Direction.top) {
            ninja.speedY = -8;
            ninja.y = this.y - ninja.width;

            // ダメージ時の点滅制御
            this.isDamaged = true;
            setTimeout(() => {
                this.isDamaged = false;
            }, damageAnimationDuration);

            if (--this.currentLife <= 0) {
                this.isDead = true;
            }
        }
        console.log("touched!");
    }

    renderItem(UL: number) {
        return (
            <EnemyComponent
                key={this.key}
                alt={this.key}
                zIndex={this.zIndex}
                currentLife={this.currentLife}
                initialLife={this.initialLife}
                isGoingRight={this.isGoingRight}
                isDamaged={this.isDamaged}
                isDead={this.isDead}
                imgSrc={this.imgSrc}
                x={this.x}
                y={this.y}
                width={this.width}
                UL={UL}
            />
        );
    }
}

function EnemyComponent({
    alt,
    x,
    y,
    zIndex,
    currentLife,
    initialLife,
    imgSrc,
    isDamaged,
    isDead,
    width,
    isGoingRight,
    UL,
}: Pick<
    Enemy,
    | "x"
    | "y"
    | "zIndex"
    | "width"
    | "imgSrc"
    | "currentLife"
    | "initialLife"
    | "isDamaged"
    | "isDead"
    | "isGoingRight"
> & {
    alt: Enemy["key"];
    UL: number;
}) {
    const outsideDivStyle = useMemo<CSSProperties>(
        () => ({
            willChange: "top, left",
            opacity: UL ? 1 : 0,
            position: "absolute",
            top: y * UL,
            left: x * UL,
            transition:
                `top ${timeStep}ms, ` +
                `left ${timeStep}ms, ` +
                `opacity ${gameOpenAnimationTime}`,
            transitionTimingFunction: "linear",
            zIndex: zIndex || 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }),
        [UL, x, y, zIndex]
    );
    const meterStyle = useMemo<CSSProperties>(() => ({ margin: 2 * UL }), [UL]);
    const imgStyle = useMemo<CSSProperties>(
        () => ({
            width: width * UL,
            transform: `scale(${isGoingRight ? 1 : -1}, ${isDead ? -1 : 1})`,
        }),
        [UL, width, isGoingRight, isDead]
    );
    const imgClassName = useMemo<string | undefined>(
        () =>
            isDamaged
                ? css({
                      animationName: opacityKeyframes,
                      animationDuration: `${damageAnimationDuration}ms`,
                  })
                : undefined,
        [isDamaged]
    );

    return (
        <div style={outsideDivStyle}>
            <meter value={currentLife / initialLife} style={meterStyle} />
            <img
                alt={alt}
                src={imgSrc}
                style={imgStyle}
                className={imgClassName}
            />
        </div>
    );
}
