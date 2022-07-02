import { CompareFunctions } from "./types";
import { prioritizeDb } from "./util";

export const getGameFnc = () =>
    [1, 2, 3].reduce((acc, num) => {
        return {
            ...acc,
            [`action-game${num}-progress`]: prioritizeDb,
            [`saveData${num}`]: prioritizeDb,
        };
    }, {} as CompareFunctions);
