import * as React from "react";
import { useEffect, useMemo } from "react";
import { StopAnimation } from "../../../../common/animation";
import { absoluteStyle } from "../../../../common/util/Game/absoluteStyle";
import {
    GameState,
    GameStateManager,
    GetInitialStateType
} from "../../../../common/util/Game/GameStateManager";
import { useGameState } from "../../../../common/util/Game/useGameState";
import Helmet from "../../../shared/Helmet";
import { HideHeaderAndFooter } from "../../../shared/HideHeaderAndFooter";
import { Floor } from "./GameItems/Floor";
import { Ninja } from "./GameItems/Ninja";

export interface VocabExplorerState extends GameState<VocabExplorerState> {
    ninja: Ninja;
    ninjaAction: "none" | "left" | "right" | "jump";
}

const initialState: GetInitialStateType<VocabExplorerState> = {
    ninja: new Ninja({ x: 0, y: 0, width: 20 }),
    items: [new Floor({ id: "floor1", x: -20, y: 90, width: 200 })],
    ninjaAction: "none",
    timeStep: 100,
};

const stateManager = new GameStateManager(initialState);

function eachTimeProc(state: VocabExplorerState) {
    state.ninja.eachTime(state);
    state.items.forEach(item => item.eachTime(state));
}

const allItems = {
    Floor,
    Ninja,
};

type GameEvent =
    | {
          type: "ItemsEnter";
          items: { name: string; props: { [key: string]: any } }[];
      }
    | {
          type: "ItemsRemove";
          itemIds: number[];
      };

type TimeLine = {
    milliSecond: number;
    event: GameEvent;
}[];

const timeLine: TimeLine = [
    { milliSecond: 5000, event: { type: "ItemsEnter", items: [] } },
    { milliSecond: 8000, event: { type: "ItemsEnter", items: [] } },
    { milliSecond: 12000, event: { type: "ItemsRemove", itemIds: [] } },
];

function useEventExecuter<EventTypes>(
    timeLine: {
        milliSecond: number;
        event: { type: EventTypes; [key: string]: any };
    }[],
    eventActions: { type: EventTypes; action: () => void }[]
) {
    useEffect(() => {
        timeLine.forEach(t => {
            setTimeout(() => {
                const { type } = t.event;

                eventActions.find(b => b.type === type)?.action?.();
            }, t.milliSecond);
        });
    }, []);
}

const eventActions: { type: GameEvent["type"]; action: () => void }[] = [
    {
        type: "ItemsEnter",
        action: () => {
            alert("items enter!");
        },
    },
    {
        type: "ItemsRemove",
        action: () => {
            alert("items remove!");
        },
    },
];
export default function VocabExplorer() {
    const gameState = useGameState<VocabExplorerState>(
        stateManager,
        eachTimeProc
    );

    useEventExecuter(timeLine, eventActions);

    return (
        <>
            <Helmet title="VocabExplorer" desc="VocabExplorer" noindex />
            <HideHeaderAndFooter />
            <StopAnimation />
            <Game gameState={gameState} />
        </>
    );
}

function Game({ gameState }: { gameState: VocabExplorerState }) {
    const { UL, ninja, items } = gameState;

    const frameStyle = useMemo(
        () =>
            ({
                ...absoluteStyle,
                width: 160 * UL,
                height: 90 * UL,
                backgroundColor: "ivory",
            } as const),
        [UL]
    );

    return (
        <div style={frameStyle}>
            <ninja.renderItem gameState={gameState} />

            {items.map(item => (
                <item.renderItem key={item.id} gameState={gameState} />
            ))}
        </div>
    );
}
