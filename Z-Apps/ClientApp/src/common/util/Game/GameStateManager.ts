import { GameItem } from "./GameItem";

export interface GameState<GS extends GameState<GS>> {
    readonly timeStep: number;
    UL: number;
    items: GameItem<GS>[];
}

export type GetInitialStateType<S> = Omit<S, "UL">;

export class GameStateManager<GS extends GameState<GS>> {
    private gameState: GS;
    private stateDifferences: Partial<GS>[] = [];

    constructor(initialState: GetInitialStateType<GS>) {
        this.gameState = {
            ...initialState,
            UL: 0,
        } as GS;
    }

    setState(partialState: Partial<GS>) {
        this.stateDifferences.push(partialState);
    }

    setUL(UL: number) {
        this.stateDifferences.push({ UL } as Partial<GS>);
    }

    renewState() {
        this.gameState = this.stateDifferences.reduce<GS>(
            (acc, val) => ({ ...acc, ...val }),
            this.gameState
        );
        return this.gameState;
    }

    getState() {
        return this.gameState;
    }
}
