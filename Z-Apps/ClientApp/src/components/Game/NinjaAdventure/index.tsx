import React, { useEffect, useState } from "react";
import { useUnmounted } from "../../../common/hooks/useUnmounted";
import { menuStateManager } from "../GameBase/Menu";
import { getCurrentStageItems } from "./GameState";
import { fixedItems } from "./Items/FixedItems";
import { initialNinja, Ninja } from "./Items/Ninja";
import { Items } from "./Items/StageItems";

export const timeStep = 50;

export default function Game({ UL }: { UL: number }) {
    const ninja = useNinja();

    return (
        <Items
            UL={UL}
            items={[ninja, ...fixedItems, ...getCurrentStageItems()]}
        />
    );
}

function useNinja() {
    const [ninja, setNinja] = useState<Ninja>(initialNinja);
    const { getIsUnmounted } = useUnmounted();

    useEffect(() => {
        const stageItems = getCurrentStageItems();
        const { isMenuOpen } = menuStateManager.getState();

        if (!isMenuOpen) {
            // The case where animation is not stopped

            ninja.onEachTime();

            stageItems.forEach(item => {
                item.onEachTime(ninja);

                if (item.checkIfTouched(ninja)) {
                    item.onTouchNinja(ninja);
                }
            });
        }

        // Proceed to the next time step
        setTimeout(() => {
            if (!getIsUnmounted()) {
                setNinja(new Ninja(ninja));
            }
        }, timeStep);
    }, [ninja]); // Dependency should be only ninja

    return ninja;
}
