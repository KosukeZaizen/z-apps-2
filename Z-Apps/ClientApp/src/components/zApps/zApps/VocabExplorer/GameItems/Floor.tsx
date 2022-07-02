import { VocabExplorerState } from "..";
import {
    GameItem,
    GameItemState,
} from "../../../../../common/util/Game/GameItem";

interface FloorState extends GameItemState<VocabExplorerState> {}

export class Floor extends GameItem<VocabExplorerState> {
    constructor(initialState: FloorState) {
        super(initialState);
    }

    eachTime = (gameState: VocabExplorerState) => {
        const { ninja } = gameState;
        if (
            this.checkIfTouched(ninja) &&
            this.getTargetDirection(ninja) === "top"
        ) {
            ninja.y = this.y - ninja.width;
        }
    };

    renderItem = ({ gameState }: { gameState: VocabExplorerState }) => {
        return null;
    };
}
