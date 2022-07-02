import * as React from "react";
import { lazy, Suspense } from "react";
import ReactGA from "react-ga";
import { Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import ScrollMemory from "react-router-scroll-memory";
import { reloadAndRedirect_OneTimeReload } from "../../common/functions";
import { useScreenSize } from "../../common/hooks/useScreenSize";
import { APP_VERSION } from "../../version";
import { ReturnToLocalMenu } from "../LocalDebug/App";
import FooterAnimation from "../shared/Animations/FooterAnimation";
import ShurikenProgress from "../shared/Animations/ShurikenProgress";
import { ReMountMain } from "../shared/Remount";
import { PopupAd } from "../shared/YouTubeAd/Popup";
import Layout from "./Layout";

const Home = lazy(() => import("./zApps/Home"));
const Terms = lazy(() => import("./zApps/Terms"));
const Test = lazy(() => import("./zApps/VocabExplorer"));
const RomajiConverter = lazy(() => import("./zApps/RomajiConverter"));
const KanjiConverter = lazy(() => import("./zApps/KanjiConverter"));
const HiraganaAndKatakana = lazy(() => import("./zApps/HiraganaAndKatakana"));
const HiraganaQuiz = lazy(() => import("./zApps/HiraganaQuiz"));
const KatakanaQuiz = lazy(() => import("./zApps/KatakanaQuiz"));
const VocabList = lazy(() => import("./zApps/Vocab/VocabList"));
const VocabQuiz = lazy(() => import("./zApps/Vocab/VocabQuiz"));
const VocabQuizTop = lazy(() => import("./zApps/Vocab/VocabQuizTop"));
const VocabKanjiQuiz = lazy(() => import("./zApps/Vocab/VocabKanjiQuiz"));
const VocabKanjiQuizTop = lazy(() => import("./zApps/Vocab/VocabKanjiQuizTop"));
const VocabVideo = lazy(() => import("./zApps/Vocab/VocabVideo"));
const VocabEdit = lazy(() => import("./zApps/Vocab/Edit"));
const VocabEditTop = lazy(() => import("./zApps/Vocab/Edit/Top"));
const VocabMerge = lazy(() => import("./zApps/Vocab/Merge"));
const VocabMergeTop = lazy(() => import("./zApps/Vocab/Merge/Top"));
const Stories = lazy(() => import("./zApps/Stories"));
const StoriesTop = lazy(() => import("./zApps/Stories/StoriesTop"));
const StoriesEdit = lazy(() => import("./zApps/Stories/StoriesEdit"));
const StoriesEditTop = lazy(
    () => import("./zApps/Stories/StoriesTop/StoriesEditTop")
);
const StoriesVideo = lazy(() => import("./zApps/Stories/StoriesVideo"));
const NinjaTop = lazy(() => import("./zApps/Games/NinjaGameTop"));
const Ninja1 = lazy(() => import("./zApps/Games/NinjaGame"));
const Ninja2 = lazy(() => import("./zApps/Games/NinjaGame2"));
const Ninja3 = lazy(() => import("./zApps/Games/NinjaGame3"));
const GameOver = lazy(() => import("./zApps/Games/GameOver"));
const SiteMapEdit = lazy(() => import("./zApps/SiteMapEdit"));
const Admin = lazy(() => import("./zApps/Admin"));
const ApiCache = lazy(() => import("./zApps/Admin/ApiCache"));
const AbTestResult = lazy(() => import("./zApps/Admin/AbTestResult"));
const OpeLogTable = lazy(() => import("./zApps/Admin/OpeLogTable"));
const ColorPalette = lazy(() => import("./zApps/ColorPalette"));
const Boscobel = lazy(() => import("./zApps/Boscobel"));
const SBDiner = lazy(() => import("./zApps/SBDiner"));
const EnCheck = lazy(() => import("./zApps/EnCheck"));
const NotFound = lazy(() => import("../shared/404"));

export function App() {
    React.useEffect(() => {
        const { pathname } = window.location;

        // 旧ブログへのリダイレクト時はAnalyticsから除外
        if (!pathname.startsWith("/2018")) {
            ReactGA.set({ page: pathname });
            ReactGA.pageview(pathname);
        }
    }, []);

    return (
        <Layout>
            <ReMountMain>
                <Suspense fallback={<LoadingAnimation />}>
                    <ScrollMemory />
                    <Switch>
                        <Route sensitive exact path="/" component={Home} />
                        <Route sensitive path="/terms" component={Terms} />
                        <Route
                            sensitive
                            path="/developer"
                            component={() => {
                                window.location.href = "/#KosukeZaizen";
                                return null;
                            }}
                        />
                        <Route
                            sensitive
                            path="/kanji-converter"
                            component={KanjiConverter}
                        />
                        <Route
                            sensitive
                            path="/romaji-converter"
                            component={RomajiConverter}
                        />
                        <Route
                            sensitive
                            path="/hiragana-katakana"
                            component={HiraganaAndKatakana}
                        />
                        <Route
                            sensitive
                            path="/hiragana-quiz"
                            component={HiraganaQuiz}
                        />
                        <Route
                            sensitive
                            path="/katakana-quiz"
                            component={KatakanaQuiz}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabulary-list"
                            component={VocabList}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabulary-quiz"
                            component={VocabQuizTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabulary-quiz/:genreName"
                            component={VocabQuiz}
                        />
                        <Route
                            sensitive
                            exact
                            path="/kanji-quiz"
                            component={VocabKanjiQuizTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/kanji-quiz/:genreName"
                            component={VocabKanjiQuiz}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabularyVideo/:genreName"
                            component={VocabVideo}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabularyEdit"
                            component={VocabEditTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabularyEdit/:genreName"
                            component={VocabEdit}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabularyMerge"
                            component={VocabMergeTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/vocabularyMerge/:genreName"
                            component={VocabMerge}
                        />
                        <Route
                            sensitive
                            exact
                            path="/folktales"
                            component={StoriesTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/folktales/:storyName"
                            component={Stories}
                        />
                        <Route
                            sensitive
                            exact
                            path="/folktalesEdit"
                            component={StoriesEditTop}
                        />
                        <Route
                            sensitive
                            exact
                            path="/folktalesEdit/:storyName"
                            component={StoriesEdit}
                        />
                        <Route
                            sensitive
                            exact
                            path="/folktalesVideo/:storyName"
                            component={StoriesVideo}
                        />
                        <Route sensitive path="/ninja" component={NinjaTop} />
                        <Route sensitive path="/ninja1" component={Ninja1} />
                        <Route sensitive path="/ninja2" component={Ninja2} />
                        <Route sensitive path="/ninja3" component={Ninja3} />
                        <Route
                            sensitive
                            path="/game-over"
                            component={GameOver}
                        />
                        <Route
                            sensitive
                            exact
                            path="/articles"
                            component={RedirectToArticles}
                        />
                        <Route
                            sensitive
                            exact
                            path="/articles/:pageName"
                            component={RedirectToArticles}
                        />
                        <Route
                            sensitive
                            path="/sitemapEdit"
                            component={SiteMapEdit}
                        />
                        <Route sensitive path="/admin" component={Admin} />
                        <Route
                            sensitive
                            path="/apiCache"
                            component={ApiCache}
                        />
                        <Route
                            sensitive
                            path="/opeLogTable"
                            component={OpeLogTable}
                        />
                        <Route
                            sensitive
                            path="/abTestResult"
                            component={AbTestResult}
                        />
                        <Route
                            sensitive
                            path="/color-code"
                            component={ColorPalette}
                        />
                        <Route
                            sensitive
                            path="/boscobel"
                            component={Boscobel}
                        />
                        <Route sensitive path="/sb-diner" component={SBDiner} />
                        <Route
                            sensitive
                            path="/en-check/:pageName?"
                            component={EnCheck}
                        />
                        <Route sensitive path="/test" component={Test} />
                        <Route
                            sensitive
                            path="/not-found"
                            component={NotFound}
                        />
                        <Route
                            sensitive
                            exact
                            path="/local"
                            component={ReturnToLocalMenu}
                        />
                        <Route component={NotFoundRedirect} />
                    </Switch>
                </Suspense>
            </ReMountMain>
            <FooterAnimation />
            <PopupAd />
        </Layout>
    );
}

function NotFoundRedirect() {
    const url = `api/SystemBase/GetVersion/V${new Date().getMilliseconds()}`;
    fetch(url).then(res => {
        res.json().then(v => {
            if (Number(v) !== APP_VERSION) {
                //@ts-ignore
                window.location.reload(true);
            } else {
                reloadAndRedirect_OneTimeReload("pageNotFoundRedirect");
            }
        });
    });

    return <LoadingAnimation />;
}

function RedirectToArticles(props: RouteComponentProps<{ pageName?: string }>) {
    window.location.href =
        "https://articles.lingual-ninja.com" + props.match.url;
    return null;
}

export function LoadingAnimation() {
    const { screenWidth, screenHeight } = useScreenSize();
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ShurikenProgress size={Math.min(screenWidth, screenHeight) / 5} />
        </div>
    );
}
