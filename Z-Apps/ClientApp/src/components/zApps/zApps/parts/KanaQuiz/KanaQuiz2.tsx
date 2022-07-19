import { Card, makeStyles } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import * as React from "react";
import { RefObject, useEffect, useRef } from "react";
import { changeAppState } from "../../../../../common/appState";
import { BLOB_URL } from "../../../../../common/consts";
import { sleepAsync } from "../../../../../common/functions";
import { useAbTest } from "../../../../../common/hooks/useAbTest";
import { useUser } from "../../../../../common/hooks/useUser";
import { getRandomItem } from "../../../../../common/util/Array/getRandomItem";
import { spaceBetween } from "../../../../../common/util/Array/spaceBetween";
import { EasyAudioPlayer } from "../../../../../common/util/Audio/EasyAudioPlayer";
import { LazyLoad } from "../../../../../common/util/LazyLoad";
import ShurikenProgress from "../../../../shared/Animations/ShurikenProgress";
import { AuthorArea } from "../../../../shared/Author/Author";
import { addXp } from "../../../../shared/Dialog/ResultXpDialog/addXp";
import { HideFooter } from "../../../../shared/HideHeaderAndFooter/HideFooter";
import { scrollToElement } from "../../../Layout/NavMenu";
import {
    FontClassName,
    KanaList,
    KanaQuizConsts,
    KanaSounds,
    KanaStatus,
    KanaType,
    PageNum,
    Romaji,
} from "./types";

type DialogState =
    | { type: "correct" | "incorrect"; question: string; answer?: Romaji }
    | "closed";

type ButtonIndex = 0 | 1 | 2 | 3;
type ButtonLabels = { [key in ButtonIndex]?: Romaji };

const ANSWER_BUTTON_PRIMARY =
    "btn btn-primary btn-lg btn-block active hoverScale05";

const playingRomajiContainer = {
    // Stop to play the Kana sound if the dialog was closed
    playingRomaji: "",
};

interface Props {
    consts: KanaQuizConsts;
    maxChar: number;
    changePage: (i: PageNum) => void;
    kanaSounds: KanaSounds;
    kanaStatus: KanaStatus;
    changeKanaStatus: (romaji: keyof KanaList, result: boolean) => void;
    font: FontClassName;
    screenWidth: number;
}
interface State {
    dialogState: DialogState;
    availableKanaList: Partial<KanaList>;
    correct: number;
    incorrectList: Partial<KanaList>;
    question: string;
    buttonLabels: ButtonLabels;
    romajiToAsk?: Romaji;
}
export class Quiz2 extends React.Component<Props, State> {
    correctSound: EasyAudioPlayer;
    incorrectSound: EasyAudioPlayer;
    ref: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        const { romajiToAsk, question, buttonLabels } = getStateToUpdate(
            props.consts.KANA_LIST,
            props.kanaStatus,
            props.consts.KANA_LIST
        );
        this.state = {
            correct: 0,
            incorrectList: {},
            dialogState: "closed",
            availableKanaList: props.consts.KANA_LIST,
            romajiToAsk,
            question,
            buttonLabels,
        };

        props.kanaSounds[romajiToAsk].load();

        this.correctSound = new EasyAudioPlayer(
            `${BLOB_URL}/appsPublic/sound/correctSound.mp3`
        );
        this.correctSound.load();

        this.incorrectSound = new EasyAudioPlayer(
            `${BLOB_URL}/appsPublic/sound/incorrectSound.mp3`
        );
        this.incorrectSound.load();

        this.ref = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        scrollToElement(this.ref.current, false, true);
    }

    onClickBtn = async (i: ButtonIndex) => {
        const { availableKanaList, romajiToAsk, buttonLabels, question } =
            this.state;
        const { changeKanaStatus, kanaSounds } = this.props;

        const answer = buttonLabels[i];
        const correctRomaji = (Object.keys(availableKanaList) as Romaji[]).find(
            r => availableKanaList[r] === question
        );

        if (!romajiToAsk || !answer || !correctRomaji) {
            return;
        }

        const isCorrect = correctRomaji === answer; // judge if it's correct

        this.openDialog(isCorrect ? "correct" : "incorrect", question); // open dialog

        changeKanaStatus(correctRomaji, isCorrect); // save to localStorage

        void playSound(
            kanaSounds,
            correctRomaji,
            isCorrect,
            this.correctSound,
            this.incorrectSound
        );
    };

    openDialog = (type: "correct" | "incorrect", question: string) => {
        const { availableKanaList } = this.state;
        this.setState({
            dialogState: {
                type,
                question,
                answer: (Object.keys(availableKanaList) as Romaji[]).find(
                    k => availableKanaList[k] === question
                ),
            },
        });
    };

    closeDialog = () => {
        const { correct, incorrectList, dialogState, availableKanaList } =
            this.state;
        const {
            maxChar,
            kanaStatus,
            changePage,
            consts: { KANA_LIST, KANA_TYPE },
            kanaSounds,
        } = this.props;

        if (dialogState === "closed") {
            // This will never happen
            return;
        }

        const { type, answer, question } = dialogState;
        if (!answer) {
            return;
        }

        const isCorrect = type === "correct";
        const newCorrect = isCorrect ? correct + 1 : correct;
        const newIncorrectList = isCorrect
            ? incorrectList
            : {
                  ...incorrectList,
                  [answer]: question,
              };

        // Remove the word that have already been asked
        const { [answer]: _, ...newAvailableKanaList } = availableKanaList;

        this.setState({
            availableKanaList: newAvailableKanaList,
            correct: newCorrect,
            incorrectList: newIncorrectList,
            dialogState: "closed",
        });

        // Judge if the game should be finished
        const gameCount = newCorrect + Object.keys(newIncorrectList).length;
        if (gameCount === maxChar) {
            // Finish the game
            changePage(3);
            void addXp({
                xpToAdd: 10 * newCorrect,
                topSmallMessage: (
                    <div>
                        Your Score: {newCorrect}/{maxChar}
                    </div>
                ),
                abTestName: `${KANA_TYPE}Quiz-ResultXpDialog`,
                onCloseCallBack: () => {
                    scrollToElement(
                        document.getElementById(`${KANA_TYPE}-chart`),
                        true
                    );
                },
            });
            return;
        }

        // Prepare next game
        const stateToUpdate =
            getStateToUpdate(newAvailableKanaList, kanaStatus, KANA_LIST) || {};
        this.setState(stateToUpdate);

        // Load kana sound
        kanaSounds[stateToUpdate.romajiToAsk].load();
    };

    render() {
        const { dialogState, correct, incorrectList, question, buttonLabels } =
            this.state;
        const { kanaSounds, maxChar, font, screenWidth, consts } = this.props;

        const incorrect = Object.keys(incorrectList).length || 0;
        const currentGame = correct + incorrect;

        return (
            <div id="disp2" ref={this.ref}>
                {"Progress: "}
                {currentGame}/{maxChar}
                <br />
                <span style={{ marginRight: 15 }}>
                    {"Correct: "}
                    {correct}
                </span>
                <span>
                    {"Incorrect: "}
                    {incorrect}
                </span>
                <br />
                <br />
                Question:
                <br />
                <span className={spaceBetween("question " + font, "bold")}>
                    {question}
                </span>
                <br />
                <br />
                {"Which Romaji is correct for the "}
                {consts.KANA_TYPE} character above?
                <div className="optionsTableContainer">
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <ButtonTd
                                        buttonIndex={0}
                                        buttonLabels={buttonLabels}
                                        onClickBtn={this.onClickBtn}
                                    />
                                    <ButtonTd
                                        buttonIndex={1}
                                        buttonLabels={buttonLabels}
                                        onClickBtn={this.onClickBtn}
                                    />
                                </tr>
                                <tr>
                                    <ButtonTd
                                        buttonIndex={2}
                                        buttonLabels={buttonLabels}
                                        onClickBtn={this.onClickBtn}
                                    />
                                    <ButtonTd
                                        buttonIndex={3}
                                        buttonLabels={buttonLabels}
                                        onClickBtn={this.onClickBtn}
                                    />
                                </tr>
                            </tbody>
                        </table>
                        <SignUpButtonWrapper kanaType={consts.KANA_TYPE} />
                    </div>
                </div>
                <div style={{ maxWidth: 600 }}>
                    <hr />
                    <AuthorArea
                        title="Developer"
                        screenWidth={Math.min(screenWidth, 600)}
                        hoverScale
                    />
                    <ResultDialog
                        dialogState={dialogState}
                        onClose={() => {
                            this.closeDialog();
                        }}
                        kanaSounds={kanaSounds}
                        font={font}
                    />
                </div>
                <HideFooter />
            </div>
        );
    }
}

function SignUpButtonWrapper({ kanaType }: { kanaType: KanaType }) {
    const { isUserFetchDone, user } = useUser();

    return isUserFetchDone && !user ? (
        <LazyLoad>
            <SignUpButton kanaType={kanaType} />
        </LazyLoad>
    ) : null;
}

function SignUpButton({ kanaType }: { kanaType: KanaType }) {
    const { abTestKey, abTestSuccess } = useAbTest({
        testName: `${kanaType}Quiz-BelowKanaOptions-SignInButton`,
        keys: [
            "Create a free account",
            "Free lifetime account",
            "Save your progress",
            "Sign up",
            "Sign in",
            "Lingual Ninja Account",
            "Manage your progress",
            "Check your Japanese level",
            "Sign up free",
            "Sign up for a free account",
        ],
    });

    return (
        <button
            className="btn btn-dark btn-lg not-square"
            onClick={() => {
                changeAppState("signInPanelState", "signUp");
                abTestSuccess();
            }}
            style={{ margin: "15px 0", width: "calc(100% - 30px)" }}
        >
            {abTestKey || (
                <ShurikenProgress
                    size="25%"
                    style={{
                        width: 70,
                    }}
                />
            )}
        </button>
    );
}

function ResultDialog({
    dialogState,
    onClose,
    kanaSounds,
    font,
}: {
    dialogState: DialogState;
    onClose: () => void;
    kanaSounds: KanaSounds;
    font: FontClassName;
}) {
    const c = useResultDialogStyles();

    const okRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (dialogState !== "closed") {
            okRef.current?.focus();
        }
    }, [dialogState]);

    if (dialogState === "closed") {
        return null;
    }

    const { type, question, answer } = dialogState;
    if (!answer) {
        return null;
    }
    const isCorrect = type === "correct";

    return (
        <div className={c.darkLayer}>
            <Card className={c.card}>
                <span
                    className={spaceBetween(
                        c.correctOrIncorrect,
                        isCorrect ? undefined : "red"
                    )}
                >
                    {isCorrect ? "Correct!" : "Incorrect!"}
                </span>
                <div>
                    {!isCorrect && (
                        <>
                            <span className={c.correctAnswerTitle}>
                                {"Correct answer:"}
                            </span>
                            <br />
                        </>
                    )}
                    <div className={c.correctAnswerContainer}>
                        <span className={spaceBetween(font, c.question)}>
                            {question}
                        </span>
                        <ArrowForward className={c.arrow} />
                        <span className={c.answer}>
                            {answer.replace("_", "")}
                            {
                                <button
                                    className={spaceBetween(
                                        "btn",
                                        "btn-dark",
                                        "hoverScale05",
                                        c.speakerButton
                                    )}
                                    style={{ width: 45, height: 40 }}
                                    onClick={() => {
                                        kanaSounds[answer].play();
                                    }}
                                >
                                    <img
                                        alt="speaker"
                                        src={
                                            BLOB_URL +
                                            "/articles/img/speaker.png"
                                        }
                                        className="fullWidth"
                                    />
                                </button>
                            }
                        </span>
                    </div>
                </div>
                <button
                    className={spaceBetween(
                        "btn",
                        `btn-${isCorrect ? "primary" : "danger"}`,
                        "hoverScale05",
                        c.okButton
                    )}
                    style={{ height: 50 }}
                    onClick={() => {
                        playingRomajiContainer.playingRomaji = "";
                        onClose();
                    }}
                    ref={okRef}
                >
                    OK
                </button>
            </Card>
        </div>
    );
}

const useResultDialogStyles = makeStyles(() => ({
    darkLayer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "100%",
        maxWidth: 300,
        height: "100%",
        maxHeight: 300,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
    },
    correctOrIncorrect: {
        fontSize: "xx-large",
        fontWeight: "bold",
    },
    correctAnswerTitle: {
        fontSize: "large",
        fontWeight: "bold",
    },
    correctAnswerContainer: {
        fontSize: "xx-large",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
    },
    question: { marginLeft: 30 },
    arrow: { margin: "0 20px", opacity: 0.5 },
    answer: {
        display: "flex",
        alignItems: "center",
    },
    speakerButton: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    okButton: { fontSize: "large" },
}));

function ButtonTd({
    buttonIndex,
    buttonLabels,
    onClickBtn,
}: {
    buttonIndex: ButtonIndex;
    buttonLabels: ButtonLabels;
    onClickBtn: (buttonIndex: ButtonIndex) => void;
}) {
    return (
        <td>
            <button
                className={ANSWER_BUTTON_PRIMARY}
                onClick={() => {
                    onClickBtn(buttonIndex);
                }}
            >
                {buttonLabels[buttonIndex]?.replace("_", "")}
            </button>
        </td>
    );
}

function getStateToUpdate(
    availableKanaList: Partial<KanaList>,
    kanaStatus: KanaStatus,
    allKanaList: KanaList
): { romajiToAsk: Romaji; question: string; buttonLabels: ButtonLabels } {
    const arrAvailableRomaji = Object.keys(
        availableKanaList
    ) as (keyof typeof availableKanaList)[];
    const arrRomajiToAsk = arrAvailableRomaji.filter(
        romaji => !kanaStatus[romaji]
    );

    let romajiToAsk = getRandomItem(arrAvailableRomaji);

    if (arrRomajiToAsk.length) {
        // If there's a word that was still not asked, ask it in 90% possibility
        if (Math.random() < 0.9) {
            romajiToAsk = getRandomItem(arrRomajiToAsk);
        }
    }

    const question = availableKanaList[romajiToAsk] || "";

    // Prepare button label options
    const arrKeys = (Object.keys(allKanaList) as Romaji[]).filter(
        r =>
            r !== romajiToAsk &&
            romajiToAsk?.replace("_", "") !== r.replace("_", "") &&
            romajiToAsk?.replace("_w", "") !== r.replace("_w", "")
    );

    // Choose similar options to the answer
    const similarKeys = arrKeys
        .filter(
            // first character is the same
            k =>
                Math.random() < 0.1 ||
                romajiToAsk.replace("_", "")[0] === k.replace("_", "")[0]
        )
        .filter(
            // includes the same character
            k =>
                Math.random() < 0.05 ||
                [...romajiToAsk.replace("_", "")].some(a => k.includes(a))
        )
        .filter(
            // same length
            k =>
                Math.random() < 0.05 ||
                romajiToAsk.replace("_", "").length ===
                    k.replace("_", "").length
        );

    // Set button labels
    const buttonLabels = [0, 1, 2, 3].reduce((acc, val) => {
        const unusedKeys = getUnusedKeys(similarKeys, acc);
        const keys =
            unusedKeys.length > 0 ? unusedKeys : getUnusedKeys(arrKeys, acc);
        return {
            ...acc,
            [val]: getRandomItem(keys),
        };
    }, {} as ButtonLabels);

    // Put an correct button at a random position
    const q = Math.floor(Math.random() * 4) as ButtonIndex;
    buttonLabels[q] = romajiToAsk;

    return { romajiToAsk, question, buttonLabels };
}

function getUnusedKeys(keys: Romaji[], currentButtonLabels: ButtonLabels) {
    return keys.filter(
        r =>
            !Object.values(currentButtonLabels).some(
                romaji => romaji.replace("_", "") === r.replace("_", "")
            )
    );
}

async function playSound(
    kanaSounds: KanaSounds,
    correctRomaji: Romaji,
    isCorrect: boolean,
    correctSound: EasyAudioPlayer,
    incorrectSound: EasyAudioPlayer
) {
    playingRomajiContainer.playingRomaji = correctRomaji;

    if (isCorrect) {
        await correctSound.play();
    } else {
        await incorrectSound.play();
        await sleepAsync(500);
    }

    if (playingRomajiContainer.playingRomaji !== correctRomaji) {
        return;
    }
    await kanaSounds[correctRomaji].play();

    await sleepAsync(1000);
    if (playingRomajiContainer.playingRomaji !== correctRomaji) {
        return;
    }
    kanaSounds[correctRomaji].play();
}
