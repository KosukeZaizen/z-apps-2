import "bootstrap/dist/css/bootstrap.css";
import { createBrowserHistory } from "history";
import * as React from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { startAnimation } from "./common/animation";
import { useAppState } from "./common/appState";
import { azureUrl, Z_APPS_HOST, Z_APPS_TOP_URL } from "./common/consts";
import * as commonFncs from "./common/functions";
import { checkAppVersion } from "./common/functions";
import { useUnmounted } from "./common/hooks/useUnmounted";
import { GOOGLE_ANALYTICS } from "./common/privateConsts";
import {
    setNoYouTubeAdMode
} from "./common/util/setNoYouTubeAdMode";
import { Articles } from "./components/Articles";
import { Game } from "./components/Game";
import { LocalDebugMenu } from "./components/LocalDebug";
import { Vocab } from "./components/Vocab";
import { zApps } from "./components/zApps";
import "./css/index.css";
//import registerServiceWorker from './registerServiceWorker';
import { unregister } from "./registerServiceWorker";
import configureStore from "./store/configureStore";

//AzureUrlから通常のURLへリダイレクト
if (window.location.href.includes(azureUrl)) {
    window.location.href = window.location.href.replace(azureUrl, Z_APPS_HOST);
}

checkAppVersion();
ReactGA.initialize(GOOGLE_ANALYTICS);

// Create browser history to use in the Redux store
const baseUrl =
    document.getElementsByTagName("base")[0].getAttribute("href") ?? undefined;
const history = createBrowserHistory({ basename: baseUrl });

history.listen(({ pathname }) => {
    setTimeout(() => {
        ReactGA.set({ page: pathname });
        ReactGA.pageview(pathname);
        commonFncs.sendClientOpeLog("change page");
    }, 1000);
});

startAnimation();

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

const rootElement = document.getElementById("root");

export interface AppToMount {
    key: string;
    hostname: string;
    getApp: () => Promise<React.FunctionComponent>;
}

// アプリ追加時は、この配列に追加
export const apps: AppToMount[] = [
    Game,
    Articles,
    zApps,
    Vocab,
    LocalDebugMenu,
];
const appObject = apps.find(a => window.location.hostname.includes(a.hostname));

if (appObject?.key === "LocalDebugMenu") {
    const savedAppKey = window.localStorage.getItem("appKeyToMount");
    const savedApp = apps.find(a => a.key === savedAppKey);
    if (savedApp) {
        appObject.getApp = savedApp.getApp;
    }
}

if (!appObject) {
    window.location.href = Z_APPS_TOP_URL;
} else {
    const render = async () => {
        const App = await appObject.getApp();
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <ScreenSizeOrigin>
                        <HideLoadingAnimationWithoutJs>
                            <App />
                        </HideLoadingAnimationWithoutJs>
                    </ScreenSizeOrigin>
                </ConnectedRouter>
            </Provider>,
            rootElement
        );
    };
    render();
}

//registerServiceWorker();
unregister();

function HideLoadingAnimationWithoutJs({
    children,
}: {
    children: JSX.Element;
}) {
    React.useEffect(() => {
        const loadingAnimation = document.getElementById(
            "loading-animation-before-js-loading"
        );
        if (loadingAnimation) {
            loadingAnimation.style.opacity = "0";
            setTimeout(() => {
                loadingAnimation.style.display = "none";
            }, 350);
        }
    }, []);
    return <>{children}</>;
}

function ScreenSizeOrigin({ children }: { children: JSX.Element }) {
    const [screenSize, setScreenSize] = useAppState("screenSize");
    const { getIsUnmounted } = useUnmounted();

    useEffect(() => {
        const changeScreenSize = () => {
            if (!getIsUnmounted()) {
                setScreenSize(getScreenSize());
            }
        };

        let timer = 0;
        const onResize = () => {
            if (timer > 0) {
                clearTimeout(timer);
            }
            timer = window.setTimeout(changeScreenSize, 100);
        };
        window.addEventListener("resize", onResize);
        onResize();

        return () => window.removeEventListener("resize", onResize);
    }, []);

    return <>{children}</>;
}

function getScreenSize() {
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window;
    return {
        screenWidth,
        screenHeight,
    };
}

// if (
//     location.hash === "#n" ||
//     checkPastNoYouTubeAd() ||
//     window.navigator.userAgent.toLowerCase().includes("bot")
// ) {
    // NoYouTubeAdMode
    setNoYouTubeAdMode();
// }
