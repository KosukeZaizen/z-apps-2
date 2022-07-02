import * as React from "react";
import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router";
import ScrollMemory from "react-router-scroll-memory";
import { reloadAndRedirect_OneTimeReload } from "../../common/functions";
import { APP_VERSION } from "../../version";
import { ReturnToLocalMenu } from "../LocalDebug/App";
import FooterAnimation from "../shared/Animations/FooterAnimation";
import ShurikenProgress from "../shared/Animations/ShurikenProgress";
import { PopupAd } from "../shared/YouTubeAd/Popup";
import Layout from "./Layout";
import "./Vocab/style.css";

const Top = lazy(() => import("./Vocab/Top"));
const Vocab = lazy(() => import("./Vocab"));
const NotFound = lazy(() => import("../shared/404"));

export function App() {
    return (
        <Layout>
            <Suspense fallback={<LoadingAnimation />}>
                <ScrollMemory />
                <Switch>
                    <Route sensitive exact path="/" component={Top} />
                    <Route sensitive path="/not-found" component={NotFound} />
                    <Route
                        sensitive
                        exact
                        path="/local"
                        component={ReturnToLocalMenu}
                    />
                    <Route
                        sensitive
                        exact
                        path="/:hiragana"
                        component={Vocab}
                    />
                    <Route component={NotFoundRedirect} />
                </Switch>
            </Suspense>
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

    return (
        <div>
            <LoadingAnimation />
        </div>
    );
}

export function LoadingAnimation() {
    return (
        <div className="center">
            <ShurikenProgress key="circle" size="20%" style={{ margin: 30 }} />
        </div>
    );
}
