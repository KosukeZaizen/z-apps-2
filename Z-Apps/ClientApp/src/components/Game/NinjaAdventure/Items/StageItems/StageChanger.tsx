import { StageItem } from ".";
import { gameState } from "../../GameState";
import { Ninja } from "../Ninja";

interface Props {
    key: string;
    x: number;
    y: number;
    width: number;
    nextStage: number;
    nextX?: number;
    nextY?: number;
}

export class StageChanger extends StageItem {
    nextStage: number;
    nextX?: number;
    nextY?: number;

    constructor({ nextStage, nextX, nextY, ...rest }: Props) {
        super({ type: "stageChanger", zIndex: 0, ...rest });
        this.nextStage = nextStage;
        this.nextX = nextX;
        this.nextY = nextY;
    }

    onEachTime() {}

    onTouchNinja(ninja: Ninja) {
        changeStage(ninja, this.nextStage, this.nextX, this.nextY);
    }
}

export function changeStage(
    ninja: Ninja,
    nextStage: number,
    nextX?: number,
    nextY?: number
) {
    ninja.cssAnimation = false;
    gameState.stageNumber = nextStage;

    if (typeof nextX === "number") {
        ninja.x = nextX;
    }
    if (typeof nextY === "number") {
        ninja.y = nextY;
    }
}
