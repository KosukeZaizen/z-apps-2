import { useEffect, useState } from "react";
import { useUnitLength } from "../../hooks/useUnitLength";
import { GameState, GameStateManager } from "./GameStateManager";

export function useGameState<GS extends GameState<GS>>(
    gameStateManager: GameStateManager<GS>,
    eachTimeProc: (state: GS) => void
): GS {
    useUlInGame(gameStateManager);

    return useGameInterval(
        gameStateManager.getState().timeStep,
        gameStateManager,
        eachTimeProc
    );
}

function useUlInGame<GS extends GameState<GS>>(
    gameStateManager: GameStateManager<GS>
) {
    const UL = useUnitLength();
    useEffect(() => {
        gameStateManager.setUL(UL);
    }, [UL]);
}

function useGameInterval<GS extends GameState<GS>>(
    timeStep: number,
    gameStateManager: GameStateManager<GS>,
    eachTimeProc: (state: GS) => void
) {
    const [gameState, setGameState] = useState(gameStateManager.getState());
    useEffect(() => {
        setInterval(() => {
            eachTimeProc(gameStateManager.getState());
            setGameState(gameStateManager.renewState());
        }, timeStep);
    }, []);

    return gameState;
}
