import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import * as React from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import ReactGA from "react-ga";
import { Route, Switch } from "react-router-dom";
import {
    debounce,
    reloadAndRedirect_OneTimeReload,
} from "../../common/functions";
import { APP_VERSION } from "../../version";
import { ReturnToLocalMenu } from "../LocalDebug/App";
import { GameFrame } from "./GameBase/GameFrame";

const NinjaAdventure = lazy(() => import("./NinjaAdventure"));
const NotFound = lazy(() => import("../shared/404"));

export function App() {
    useEffect(() => {
        const { pathname } = window.location;
        ReactGA.set({ page: pathname });
        ReactGA.pageview(pathname);
    }, []);

    const UL = useUnitLength();

    return (
        <Suspense fallback={<LoadingAnimation />}>
            <GameFrame UL={UL}>
                <NinjaAdventure UL={UL} />
            </GameFrame>
        </Suspense>
    );
}

export function Routes({ UL }: { UL: number }) {
    return (
        <Switch>
            <Route sensitive exact path="/">
                <div>fantastic!</div>
            </Route>
            <Route sensitive path="/not-found" component={NotFound} />
            <Route
                sensitive
                exact
                path="/local"
                component={ReturnToLocalMenu}
            />
            <Route component={NotFoundRedirect} />
        </Switch>
    );
}

export function LoadingAnimation() {
    return (
        <div style={{ textAlign: "center", margin: "15%" }}>
            <CircularProgress size="30%" />
        </div>
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

const setScreen = debounce((setUL: (UL: number) => void) => {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth < screenHeight) {
        // 縦長なら幅と高さを入れ替えて計算
        screenWidth = window.innerHeight;
        screenHeight = window.innerWidth;
    }

    const UL = Math.min(screenWidth / 168, screenHeight / 94.5);
    setUL(UL);
}, 100);

function useUnitLength() {
    const [UL, setUL] = useState(0);

    useEffect(() => {
        const el = () => {
            setScreen(setUL);
        };
        window.addEventListener("resize", el);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                setScreen(setUL);
            }, i * 1000);
        }
        return () => window.removeEventListener("resize", el);
    }, []);

    return UL;
}
