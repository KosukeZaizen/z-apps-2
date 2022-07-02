import { changeAppState, getAppState } from "../../../../../../common/appState";
import { User } from "../../../../../../common/hooks/useUser";
import { reMountMain } from "../../../../../shared/Remount";
import { getGameFnc } from "./game";
import { getKanaQuizFnc } from "./kanaQuiz";
import { CompareFunctions } from "./types";
import { checkDataExistence, prioritizeDb } from "./util";
import { getVocabAndKanjiFnc } from "./vocabAndKanji";

let compareFunctions: CompareFunctions = {};

export async function mergeLocalStorageAndSavedUserData(user: User) {
    const progressJson = user.progress;
    const progressFromDB: { [key: string]: string } = progressJson
        ? JSON.parse(progressJson)
        : {};

    compareFunctions = {
        ["kana-font"]: prioritizeDb,
        ...getKanaQuizFnc(),
        ...getGameFnc(),
        ...(await getVocabAndKanjiFnc()),
    };

    let dataToSaveInDb: { [key: string]: string } = {};
    let storageUpdated: boolean = false;
    for (let key in compareFunctions) {
        const db = progressFromDB[key] || null;
        const ls = localStorage.getItem(key);
        const validData = db === ls ? "storage" : compareFunctions[key](db, ls);

        switch (validData) {
            case "none": {
                // If there's no data in both db and localStorage, no need to save anything
                localStorage.removeItem(key); // in case string "null" is in localStorage
                break;
            }
            case "db": {
                // Save DB data in localStorage
                storageUpdated = true;
                if (checkDataExistence(db)) {
                    localStorage.setItem(key, db);
                    dataToSaveInDb = { ...dataToSaveInDb, [key]: db }; // keep the DB data
                    break;
                }
                localStorage.removeItem(key);
                break;
            }
            case "storage": {
                // Save localStorage data in DB
                if (checkDataExistence(ls)) {
                    dataToSaveInDb = {
                        ...dataToSaveInDb,
                        [key]: ls,
                    };
                }
                break;
            }
            default: {
                const exhaustiveCheck: never = validData;
            }
        }
    }

    const progress = JSON.stringify(dataToSaveInDb);
    if (Object.keys(dataToSaveInDb).length > 0) {
        fetch("api/Auth/SaveProgress", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ progress }),
        });
    }
    if (storageUpdated) {
        reMountMain();
    }
    changeAppState("user", { ...user, progress });
}

export async function clearLocalStorageData() {
    // when logout
    Object.keys(compareFunctions).forEach(key => {
        localStorage.removeItem(key);
    });
    reMountMain();
}

export async function setLocalStorageAndDb(
    args: { key: string; value: string }[]
) {
    args.forEach(({ key, value }) => {
        localStorage.setItem(key, value);
    });

    const { user } = getAppState();
    if (!user) {
        return;
    }

    const previousProgress = user.progress ? JSON.parse(user.progress) : {};

    const progress = JSON.stringify(
        args.reduce((acc, arg) => {
            return { ...acc, [arg.key]: arg.value };
        }, previousProgress)
    );

    changeAppState("user", { ...user, progress });

    fetch("api/Auth/SaveProgress", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            progress,
        }),
    });
}
