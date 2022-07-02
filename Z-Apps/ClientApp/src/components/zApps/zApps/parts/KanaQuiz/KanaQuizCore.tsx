import { useMemo, useState } from "react";
import { BLOB_URL } from "../../../../../common/consts";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { EasyAudioPlayer } from "../../../../../common/util/Audio/EasyAudioPlayer";
import { setLocalStorageAndDb } from "../../../Layout/Login/MyPage/progressManager";
import { Quiz1 } from "./KanaQuiz1";
import { Quiz2 } from "./KanaQuiz2";
import {
    FontClassName,
    KanaQuizConsts,
    KanaSounds,
    KanaStatus,
    KanaType,
    PageNum,
    Romaji
} from "./types";

export const BUTTON_PRIMARY = "btn btn-primary btn-lg btn-block hoverScale05";
export const BUTTON_SUCCESS = "btn btn-success btn-lg btn-block hoverScale05";
export const BUTTON_DANGER = "btn btn-danger btn-lg btn-block hoverScale05";
export const BUTTON_DARK = "btn btn-dark btn-lg btn-block hoverScale05";

interface Props {
    consts: KanaQuizConsts;
}
export function QuizCore({ consts }: Props) {
    const { screenWidth } = useScreenSize();

    const [pageNum, setPageNum] = useState<PageNum>(1);
    const [maxChar, setMaxChar] = useState(0);
    const [font, setFont] = useState<FontClassName>(() =>
        window.localStorage.getItem("kana-font") === "ming-font"
            ? "ming-font"
            : "gothic-font"
    );

    const { kanaStatus, changeKanaStatus } = useKanaStatus(consts.KANA_TYPE);

    const kanaSounds = useMemo(
        () =>
            (Object.keys(consts.KANA_LIST) as Romaji[]).reduce(
                (acc, romaji) => ({
                    ...acc,
                    [romaji]: new EasyAudioPlayer(
                        `${BLOB_URL}/kanaQuiz/sound/${romaji.replace(
                            "_",
                            ""
                        )}.m4a`
                    ),
                }),
                {}
            ) as KanaSounds,
        [consts]
    );

    switch (pageNum) {
        case 1:
        case 3: {
            return (
                <Quiz1
                    consts={consts}
                    changePage={setPageNum}
                    setMaxChar={setMaxChar}
                    kanaStatus={kanaStatus}
                    kanaSounds={kanaSounds}
                    isQuizResult={pageNum === 3}
                    font={font}
                    setFont={setFont}
                    screenWidth={screenWidth}
                />
            );
        }
        case 2: {
            return (
                <Quiz2
                    consts={consts}
                    maxChar={maxChar}
                    changePage={setPageNum}
                    kanaSounds={kanaSounds}
                    kanaStatus={kanaStatus}
                    changeKanaStatus={changeKanaStatus}
                    font={font}
                    screenWidth={screenWidth}
                />
            );
        }
        default: {
            const neverCheck: never = pageNum;
            return null;
        }
    }
}

const getKanaStatusFunctions = (kanaType: KanaType) => {
    const key = `KanaQuizStatus-${kanaType}`;
    const getSavedKanaStatus = (): KanaStatus => {
        const json = localStorage.getItem(key);
        if (!json) {
            return {};
        }
        return JSON.parse(json);
    };
    const changeSavedKanaStatus = (newKanaStatus: KanaStatus) => {
        setLocalStorageAndDb([{ key, value: JSON.stringify(newKanaStatus) }]);
    };
    return {
        getSavedKanaStatus,
        changeSavedKanaStatus,
    } as const;
};

function useKanaStatus(kanaType: KanaType) {
    const { changeSavedKanaStatus, getSavedKanaStatus } = useMemo(
        () => getKanaStatusFunctions(kanaType),
        [kanaType]
    );
    const [kanaStatus, setKanaStatus] =
        useState<KanaStatus>(getSavedKanaStatus);
    const changeKanaStatus = (romaji: Romaji, result: boolean) => {
        const newKanaStatus = { ...kanaStatus, [romaji]: result };
        setKanaStatus(newKanaStatus);
        changeSavedKanaStatus(newKanaStatus);
    };
    return { kanaStatus, changeKanaStatus };
}
