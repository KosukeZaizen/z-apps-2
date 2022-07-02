import { Card, makeStyles, MenuItem, Select } from "@material-ui/core";
import { CSSProperties, useEffect, useState } from "react";
import { changeAppState } from "../../../../../common/appState";
import { BLOB_URL } from "../../../../../common/consts";
import { useAbTest } from "../../../../../common/hooks/useAbTest";
import { useUser } from "../../../../../common/hooks/useUser";
import { LazyExecutor, LazyLoad } from "../../../../../common/util/LazyLoad";
import ShurikenProgress from "../../../../shared/Animations/ShurikenProgress";
import { AuthorArea } from "../../../../shared/Author";
import { ResultExpDialog } from "../../../../shared/Dialog/ResultExpDialog";
import { AnchorLink } from "../../../../shared/HashScroll";
import { Link } from "../../../../shared/Link/LinkWithYouTube";
import { Markdown } from "../../../../shared/Markdown";
import { setLocalStorageAndDb } from "../../../Layout/Login/MyPage/progressManager";
import { scrollToElement } from "../../../Layout/NavMenu";
import {
    BUTTON_DANGER,
    BUTTON_DARK,
    BUTTON_PRIMARY,
    BUTTON_SUCCESS,
} from "./KanaQuizCore";
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

interface Props {
    consts: KanaQuizConsts;
    changePage: (i: PageNum) => void;
    setMaxChar: (i: number) => void;
    kanaStatus: KanaStatus;
    kanaSounds: KanaSounds;
    isQuizResult: boolean;
    setFont: (font: FontClassName) => void;
    font: FontClassName;
    screenWidth: number;
    score: number;
    maxChar: number;
}
export function Quiz1({
    consts,
    changePage,
    setMaxChar,
    kanaStatus,
    kanaSounds,
    isQuizResult,
    setFont,
    font,
    screenWidth,
    score,
    maxChar,
}: Props) {
    const c = useStyles();
    const { user, isUserFetchDone } = useUser();
    const [isResultDialogShown, setResultDialogShown] = useState(false);

    useEffect(() => {
        if (isQuizResult) {
            setResultDialogShown(true);

            const replacedHash = `${consts.KANA_TYPE}-chart`;
            scrollToElement(document.getElementById(replacedHash));
        }
    }, [isQuizResult, consts]);

    const startGame = (maxChar: number) => {
        setMaxChar(maxChar);
        changePage(2);
    };

    const allKanaNumber = Object.keys(consts.KANA_LIST).length;
    const rememberedCharactersNumber = Object.values(kanaStatus).filter(
        k => k
    ).length;
    const percentage = Math.floor(
        (100 * rememberedCharactersNumber) / allKanaNumber
    );

    return (
        <div id="disp1">
            <h1 id={`kana-quiz`}>{consts.KANA_TYPE} Quiz</h1>
            <p className={c.pleaseBookMark}>
                {`Please bookmark this page to remember all ${consts.KANA_TYPE} characters!`}
            </p>
            <div className={c.progressContainer}>
                {"Your progress:"}
                <wbr />
                <AnchorLink
                    targetHash={`#${consts.KANA_TYPE}-chart`}
                    style={{ fontWeight: "bold", paddingLeft: 7 }}
                    isSmooth
                >
                    {percentage}
                    {"%"}
                </AnchorLink>
            </div>
            <button onClick={() => startGame(10)} className={BUTTON_PRIMARY}>
                Random 10 characters
            </button>
            <br />
            <button onClick={() => startGame(30)} className={BUTTON_SUCCESS}>
                Random 30 characters
            </button>
            <br />
            <button
                onClick={() => startGame(Object.keys(consts.KANA_LIST).length)}
                className={BUTTON_DANGER}
            >
                All {consts.KANA_TYPE} characters
            </button>
            <hr className={c.hrAboveChart} />
            <Card
                id={`${consts.KANA_TYPE}-chart`}
                className={c.chartContainerCard}
            >
                <h2 className={c.chartTitle}>{consts.KANA_TYPE} Chart</h2>

                <ChartMessage
                    percentage={percentage}
                    kanaType={consts.KANA_TYPE}
                />

                <div className={"cancelCenter " + c.areaAboveChart}>
                    {isUserFetchDone && !user ? (
                        <LazyLoad>
                            <SignUpButton
                                kanaType={consts.KANA_TYPE}
                                testType={
                                    percentage === 0
                                        ? "AboveChart-SignInButton-0Percent"
                                        : percentage === 100
                                        ? "AboveChart-SignInButton-Perfect"
                                        : "AboveChart-SignInButton"
                                }
                            />
                        </LazyLoad>
                    ) : (
                        // Put this empty div for the flex layout
                        <div />
                    )}

                    <div className={c.fontSelectorContainer}>
                        <span className={c.fontTitle}>Font:</span>
                        <Select
                            value={font}
                            onChange={ev => {
                                const value = ev.target.value as FontClassName;
                                setFont(value);
                                setLocalStorageAndDb([
                                    { key: "kana-font", value },
                                ]);
                            }}
                        >
                            <MenuItem value={"gothic-font"}>Gothic</MenuItem>
                            <MenuItem value={"ming-font"}>Ming</MenuItem>
                        </Select>
                    </div>
                </div>

                <KanaChart
                    kanaList={consts.KANA_LIST}
                    kanaSounds={kanaSounds}
                    kanaStatus={kanaStatus}
                    chartRomaji={normalChartRomaji}
                    style={{ marginBottom: 10 }}
                    font={font}
                />

                <AnchorLink targetHash={`#kana-quiz`} isSmooth>
                    <button className={BUTTON_PRIMARY}>
                        Try the {consts.KANA_TYPE} Quiz!
                    </button>
                </AnchorLink>

                <KanaChart
                    kanaList={consts.KANA_LIST}
                    kanaSounds={kanaSounds}
                    kanaStatus={kanaStatus}
                    chartRomaji={dullChartRomaji}
                    font={font}
                />
                <KanaChart
                    kanaList={consts.KANA_LIST}
                    kanaSounds={kanaSounds}
                    kanaStatus={kanaStatus}
                    chartRomaji={pChartRomaji}
                    style={{ marginBottom: 10 }}
                    font={font}
                />

                <AnchorLink targetHash={`#kana-quiz`} isSmooth>
                    <button className={BUTTON_PRIMARY}>
                        Try the {consts.KANA_TYPE} Quiz!
                    </button>
                </AnchorLink>

                <KanaChart
                    kanaList={consts.KANA_LIST}
                    kanaSounds={kanaSounds}
                    kanaStatus={kanaStatus}
                    chartRomaji={contractedChartRomaji}
                    font={font}
                />
            </Card>
            <AnchorLink targetHash={`#kana-quiz`} isSmooth>
                <button className={BUTTON_PRIMARY}>
                    Try the {consts.KANA_TYPE} Quiz!
                </button>
            </AnchorLink>
            <hr className={c.marginTop20} />
            <AuthorArea
                title="Developer"
                screenWidth={Math.min(screenWidth, 600)}
                hoverScale
            />
            <hr className={`${c.marginTop20} ${c.positionRelative}`} />
            <Markdown style={{ textAlign: "left" }} source={consts.MARK_DOWN} />
            <br />
            <Link to={"/" + consts.OTHER_KANA_TYPE.toLowerCase() + "-quiz"}>
                <button className={BUTTON_DARK}>
                    {consts.OTHER_KANA_TYPE} Quiz
                </button>
            </Link>
            <ResultDialog
                open={isResultDialogShown || true} // TODO: remove "true"
                onClose={() => {
                    setResultDialogShown(false);
                }}
                // score={score} TODO: uncomment
                // maxChar={maxChar} TODO: uncomment
                score={9}
                maxChar={10}
            />
        </div>
    );
}
const useStyles = makeStyles(() => ({
    pleaseBookMark: { marginBottom: 20 },
    progressContainer: { fontSize: "x-large", marginBottom: 30 },
    hrAboveChart: { margin: "20px 0" },
    chartContainerCard: {
        padding: 10,
        backgroundColor: "#eeeeee",
        marginBottom: 20,
    },
    chartTitle: { marginTop: 5, marginBottom: 15 },
    areaAboveChart: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fontSelectorContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    fontTitle: {
        marginRight: 10,
        paddingBottom: 2,
    },
    marginTop20: { marginTop: 20 },
    positionRelative: { position: "relative" },
}));

function ResultDialog({
    open,
    onClose,
    score,
    maxChar,
}: {
    open: boolean;
    onClose: () => void;
    score: number;
    maxChar: number;
}) {
    return (
        <ResultExpDialog
            open={open}
            onClose={onClose}
            score={score}
            maxChar={maxChar}
            exp={10 * score}
            topSmallMessage={
                <div>
                    Your Score: {score}/{maxChar}
                </div>
            }
            characterComment={
                "Receive the EXP by making a free lifetime account!"
            }
            buttonLabel={"Sign up"}
        />
    );
}

function SignUpButton({
    kanaType,
    testType,
}: {
    kanaType: KanaType;
    testType:
        | "AboveChart-SignInButton-0Percent"
        | "AboveChart-SignInButton"
        | "AboveChart-SignInButton-Perfect";
}) {
    const { abTestKey, abTestSuccess } = useAbTest({
        testName: `${kanaType}Quiz-${testType}`,
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
            className="btn btn-primary"
            onClick={() => {
                changeAppState("signInPanelState", "signUp");
                abTestSuccess();
            }}
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

function ChartMessage({
    percentage,
    kanaType,
}: {
    percentage: number;
    kanaType: KanaType;
}) {
    const c = useChartMessageStyles();

    return (
        <div className={c.chartMessage}>
            {percentage === 100 && (
                <Card
                    className={
                        "responsive-congratulations " + c.congratulations
                    }
                >
                    Congratulations!
                </Card>
            )}
            <div className={c.messageContainer}>
                {percentage === 0 ? (
                    <>
                        {"Your current progress is "}
                        <span className={c.percentage}>{percentage}%</span>
                        {"!"}
                        <br />
                    </>
                ) : (
                    <>
                        {"You have remembered "}
                        <span
                            className={
                                c.percentage +
                                (percentage === 100
                                    ? ` ${c.perfectPercentage}`
                                    : "")
                            }
                        >
                            {percentage}%
                        </span>
                        {" of "}
                        {kanaType}
                        {" characters!"}
                        <br />
                    </>
                )}
                {percentage === 100 ? (
                    <>
                        {"Next, please try the "}
                        {kanaType === "Hiragana" ? (
                            <Link
                                to={"/katakana-quiz"}
                                style={{ fontWeight: "bold" }}
                            >
                                Katakana Quiz
                            </Link>
                        ) : (
                            <Link
                                to={"/vocabulary-quiz"}
                                style={{ fontWeight: "bold" }}
                            >
                                Vocabulary Quiz
                            </Link>
                        )}
                        {"!"}
                    </>
                ) : (
                    <>
                        {"You still need to remember the "}
                        <span className={c.redBold}>red characters</span>
                        {" below!"}
                        <br />
                        {"After glancing at the chart, please try the "}
                        <AnchorLink
                            targetHash={"#kana-quiz"}
                            style={{ fontWeight: "bold" }}
                            isSmooth
                        >
                            {kanaType} Quiz
                        </AnchorLink>
                        {percentage === 0
                            ? " to change the color of the characters"
                            : " again"}
                        {"!"}
                        {percentage !== 0 && (
                            <>
                                <br />
                                {
                                    "The questions you couldn't answer correctly will be asked frequently!"
                                }
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
const useChartMessageStyles = makeStyles(() => ({
    chartMessage: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 20,
        lineHeight: 1.5,
    },
    congratulations: {
        color: "green",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 20,
        padding: "10px 20px",
    },
    messageContainer: { textAlign: "left", fontSize: "large" },
    percentage: {
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "0 2px",
    },
    perfectPercentage: {
        color: "green",
    },
    redBold: { color: "red", fontWeight: "bold" },
}));

function KanaChart({
    kanaList,
    kanaSounds,
    kanaStatus,
    chartRomaji,
    style,
    font,
}: {
    kanaList: KanaList;
    kanaSounds: KanaSounds;
    kanaStatus: KanaStatus;
    chartRomaji: (Romaji | "")[][];
    style?: CSSProperties;
    font: FontClassName;
}) {
    const c = useKanaChartStyles();
    return (
        <div className={"roundedTable"} style={{ marginTop: 10, ...style }}>
            <table className="kanaTable">
                <tbody>
                    {chartRomaji.map(line => (
                        <tr key={"line-" + line[0]}>
                            {line.map((romaji, i) =>
                                !romaji ? (
                                    <td key={i} className={c.emptyCell} />
                                ) : (
                                    <td
                                        key={romaji}
                                        onClick={() => {
                                            kanaSounds[romaji].play();
                                        }}
                                        className={
                                            kanaStatus[romaji]
                                                ? c.normalCell
                                                : c.redCell
                                        }
                                    >
                                        <LazyExecutor
                                            fnc={() => {
                                                kanaSounds[romaji].load();
                                            }}
                                            offset={0}
                                        />
                                        <div
                                            className={
                                                c.characterContainer +
                                                " hoverScale05"
                                            }
                                        >
                                            <span
                                                className={
                                                    c.bold +
                                                    " font-kana-in-chart " +
                                                    font
                                                }
                                            >
                                                {kanaList[romaji]}
                                            </span>
                                            <span
                                                className={
                                                    c.marginTop10 +
                                                    " font-romaji-in-chart"
                                                }
                                            >
                                                {romaji.replace("_", "")}
                                            </span>
                                            <button
                                                className="btn btn-dark hoverScale05"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <img
                                                    alt="speaker"
                                                    src={
                                                        BLOB_URL +
                                                        "/articles/img/speaker.png"
                                                    }
                                                    className={c.width15}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
const useKanaChartStyles = makeStyles(() => ({
    emptyCell: {
        overflow: "visible",
        backgroundColor: "#eeeeee",
        boxShadow: "none",
    },
    redCell: {
        cursor: "pointer",
        color: "red",
    },
    normalCell: {
        cursor: "pointer",
    },
    characterContainer: {
        display: "flex",
        flexDirection: "column",
    },
    bold: {
        fontWeight: "bold",
    },
    marginTop10: {
        marginBottom: 10,
    },
    width15: {
        width: 15,
    },
}));

const normalChartRomaji: (Romaji | "")[][] = [
    ["a", "i", "u", "e", "o"],
    ["ka", "ki", "ku", "ke", "ko"],
    ["sa", "shi", "su", "se", "so"],
    ["ta", "chi", "tsu", "te", "to"],
    ["na", "ni", "nu", "ne", "no"],
    ["ha", "hi", "fu", "he", "ho"],
    ["ma", "mi", "mu", "me", "mo"],
    ["ya", "", "yu", "", "yo"],
    ["ra", "ri", "ru", "re", "ro"],
    ["wa", "", "", "", "_wo"],
    ["n", "", "", "", ""],
];

const dullChartRomaji: (Romaji | "")[][] = [
    ["ga", "gi", "gu", "ge", "go"],
    ["za", "ji", "zu", "ze", "zo"],
    ["da", "_ji", "_zu", "de", "do"],
    ["ba", "bi", "bu", "be", "bo"],
];

const pChartRomaji: (Romaji | "")[][] = [["pa", "pi", "pu", "pe", "po"]];

const contractedChartRomaji: (Romaji | "")[][] = [
    ["kya", "", "kyu", "", "kyo"],
    ["sha", "", "shu", "", "sho"],
    ["cha", "", "chu", "", "cho"],
    ["nya", "", "nyu", "", "nyo"],
    ["hya", "", "hyu", "", "hyo"],
    ["mya", "", "myu", "", "myo"],
    ["rya", "", "ryu", "", "ryo"],
    ["gya", "", "gyu", "", "gyo"],
    ["ja", "", "ju", "", "jo"],
    ["bya", "", "byu", "", "byo"],
    ["pya", "", "pyu", "", "pyo"],
];
