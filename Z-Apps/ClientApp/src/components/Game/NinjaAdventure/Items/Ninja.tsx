import React, { CSSProperties, useMemo } from "react";
import { timeStep } from "..";
import { appsPublicImg } from "../../../../common/consts";
import { gameState } from "../GameState";
import { Renderable } from "./StageItems";

type NinjaProps = {
    x: number;
    y: number;
    speedY: number;
    speedX: number;
    width: number;
    isGoingRight: boolean;
    jumpable: boolean;
    cssAnimation: boolean;
};

export class Ninja extends Renderable {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    width: number;
    isGoingRight: boolean;
    jumpable: boolean;
    cssAnimation: boolean;

    constructor(props: NinjaProps) {
        super();

        this.x = props.x;
        this.y = props.y;
        this.speedX = props.speedX;
        this.speedY = props.speedY;
        this.width = props.width;
        this.isGoingRight = props.isGoingRight;
        this.jumpable = props.jumpable;
        this.cssAnimation = props.cssAnimation;
    }

    onEachTime() {
        const {
            isLeftButtonClicked,
            isRightButtonClicked,
            isJumpButtonClicked,
        } = gameState.controller;

        // Update the position of Ninja
        if (isLeftButtonClicked) {
            this.isGoingRight = false;
            this.x -= 2.5;
        }
        if (isRightButtonClicked) {
            this.isGoingRight = true;
            this.x += 2.5;
        }
        if (isJumpButtonClicked && this.jumpable) {
            this.speedY -= 6;
        }

        // Gravity
        this.speedY += 0.7;

        // Update speed from position
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset the influence from other Items on each time step
        this.jumpable = false; // Floor
        this.cssAnimation = true; // StageChanger
    }

    renderItem(UL: number) {
        return (
            <NinjaComponent
                key="Japanese running ninja"
                cssAnimation={this.cssAnimation}
                width={this.width}
                x={this.x}
                y={this.y}
                isGoingRight={this.isGoingRight}
                UL={UL}
            />
        );
    }
}

function NinjaComponent({
    cssAnimation,
    width,
    x,
    y,
    isGoingRight,
    UL,
}: Pick<Ninja, "cssAnimation" | "isGoingRight" | "width" | "x" | "y"> & {
    UL: number;
}) {
    const transitionStyle = useMemo(
        () =>
            cssAnimation
                ? {
                      transition: `${timeStep}ms`,
                      transitionProperty: "top, left",
                      transitionTimingFunction: "linear",
                  }
                : {},
        [cssAnimation]
    );

    const ninjaStyle = useMemo<CSSProperties>(
        () => ({
            willChange: "top, left",
            width: width * UL,
            position: "absolute",
            top: y * UL,
            left: x * UL,
            zIndex: 11,
            transform: isGoingRight ? "scale(-1, 1)" : undefined,
            ...transitionStyle,
        }),
        [transitionStyle, width, UL, x, y, isGoingRight]
    );

    return UL ? (
        <img
            alt="Japanese running ninja"
            src={`${appsPublicImg}ninja_hashiru.png`}
            style={ninjaStyle}
        />
    ) : null;
}

export const initialNinja = new Ninja({
    x: 140,
    y: -10,
    speedX: 0,
    speedY: 0,
    width: 12,
    isGoingRight: false,
    jumpable: false,
    cssAnimation: true,
});
