import { Direction } from "../../../components/Game/types/Direction";
import { GameState } from "./GameStateManager";

export type GameItemState<GS extends GameState<GS>> = Pick<
    GameItem<GS>,
    "id" | "x" | "y" | "width"
>;

export abstract class GameItem<GS extends GameState<GS>> {
    id: string;
    x: number;
    y: number;
    width: number;

    constructor(initialState: GameItemState<GS>) {
        this.id = initialState.id;
        this.x = initialState.x;
        this.y = initialState.y;
        this.width = initialState.width;
    }

    getCenter = () => ({
        x: this.x + this.width / 2,
        y: this.y + this.width / 2,
    });

    getTargetDirection = (targetItem: GameItem<GS>): Direction => {
        const targetCenter = targetItem.getCenter();
        const ownCenter = this.getCenter();

        const dX = targetCenter.x - ownCenter.x;
        const dY = targetCenter.y - ownCenter.y;

        const a = dY / dX;

        if (dX === 0) {
            return dY > 0 ? Direction.bottom : Direction.top;
        }

        if (1 > a && a > -1) {
            return dX > 0 ? Direction.right : Direction.left;
        } else {
            return dY > 0 ? Direction.bottom : Direction.top;
        }
    };

    checkIfTouched(target: { x: number; y: number; width: number }): boolean {
        if (target.x + target.width > this.x) {
            if (target.x < this.x + this.width) {
                if (target.y + target.width > this.y) {
                    if (target.y < this.y + this.width) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    abstract eachTime: (gameState: GS) => void;

    abstract renderItem: ({
        gameState,
    }: {
        gameState: GS;
    }) => JSX.Element | null;
}
