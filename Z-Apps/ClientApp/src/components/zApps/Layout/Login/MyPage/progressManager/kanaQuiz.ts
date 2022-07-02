import { getKanaPercentageFromStatus } from "../../../../zApps/parts/KanaQuiz/kanaProgress";
import { CompareFunctions } from "./types";
import { checkExistence } from "./util";

export const getKanaQuizFnc = () =>
    (["Hiragana", "Katakana"] as const).reduce((acc, kanaType) => {
        return {
            ...acc,
            [`KanaQuizStatus-${kanaType}`]: (
                db: string | null,
                storage: string | null
            ) => {
                const existence = checkExistence(db, storage);
                if (existence !== "both") {
                    return existence;
                }
                const dbKanaStatus = JSON.parse(db as string); // already checked the string existence
                const storageKanaStatus = JSON.parse(storage as string); // already checked the string existence

                const dbPercentage = getKanaPercentageFromStatus(
                    kanaType,
                    dbKanaStatus
                );
                const storagePercentage = getKanaPercentageFromStatus(
                    kanaType,
                    storageKanaStatus
                );

                if (dbPercentage < storagePercentage) {
                    return "storage";
                }
                return "db";
            },
        };
    }, {} as CompareFunctions);
