import React, { useMemo } from "react";
import { VocabExplorerState } from "..";
import { appsPublicImg } from "../../../../../common/consts";
import { absoluteStyle } from "../../../../../common/util/Game/absoluteStyle";
import {
    GameItem,
    GameItemState,
} from "../../../../../common/util/Game/GameItem";

const id = "running_ninja";
const ninja_src = `${appsPublicImg}ninja_hashiru.png`;

export class Ninja extends GameItem<VocabExplorerState> {
    constructor(initialState: Omit<GameItemState<VocabExplorerState>, "id">) {
        super({ ...initialState, id });
    }

    eachTime = (gameState: VocabExplorerState) => {
        this.y++;
    };

    renderItem = ({ gameState }: { gameState: VocabExplorerState }) => {
        const { UL, timeStep } = gameState;
        const { x, y, width } = this;

        const ninjaStyle = useMemo(
            () =>
                ({
                    ...absoluteStyle,
                    width: width * UL,
                    transform: `translate3d(${x * UL}px,${y * UL}px,0px)`,
                    transitionProperty: "transform",
                    transitionDuration: `${timeStep}ms`,
                    transitionTimingFunction: "linear",
                } as const),
            [UL, x, y, width]
        );
        return <img alt="running ninja" src={ninja_src} style={ninjaStyle} />;
    };
}
