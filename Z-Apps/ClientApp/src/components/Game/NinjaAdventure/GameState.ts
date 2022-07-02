import { allGenreStages } from "./Stages";

export interface GameState {
    controller: {
        isLeftButtonClicked: boolean;
        isRightButtonClicked: boolean;
        isJumpButtonClicked: boolean;
    };
    genre: string;
    stageNumber: number;
}

export const gameState: GameState = {
    controller: {
        isLeftButtonClicked: false,
        isRightButtonClicked: false,
        isJumpButtonClicked: false,
    },
    genre: "nature",
    stageNumber: 0,
};

export function getCurrentStageItems() {
    if (!allGenreStages) {
        return [];
    }
    const { genre, stageNumber } = gameState;
    console.log("genre", genre);
    console.log("allGenreStages", allGenreStages);
    const stages = allGenreStages[genre];
    return stages[stageNumber];
}
