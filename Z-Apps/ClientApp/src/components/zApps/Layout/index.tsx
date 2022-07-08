import { createTheme, ThemeProvider } from "@material-ui/core";
import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import { connect } from "react-redux";
import Container from "reactstrap/lib/Container";
import { compose } from "recompose";
import { sleepAsync } from "../../../common/functions";
import * as baseStore from "../../../store/BaseStore";
import { ApplicationState } from "../../../store/configureStore";
import Footer from "./Footer";
import "./Layout.css";
import NavMenu from "./NavMenu";

interface OuterProps {
    children: React.ReactNode;
}

type InnerProps = OuterProps & baseStore.BaseState;

function Layout({ children, isHeaderShown, isFooterShown }: InnerProps) {
    const [panels, setPanels] = useState<ReactNode[]>([]);

    useEffect(() => {
        (async () => {
            await sleepAsync(500);
            const panels = await importPanels();
            setPanels(panels);

            await sleepAsync(1000);
            setPanels([...panels, ...(await lateImportPanels())]);
        })();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div>
                {isHeaderShown && <NavMenu />}

                <Container className="contents-container">{children}</Container>

                {isFooterShown && <Footer />}

                {panels}
            </div>
        </ThemeProvider>
    );
}

async function importPanels() {
    // Dynamic import panels
    const PanelComponents = [
        import("../../shared/Author"),
        import("./Login/Panel"),
    ].map(async (p, i) => {
        const { default: Component } = await p;
        return <Component key={i} />;
    });

    return await Promise.all(PanelComponents);
}

async function lateImportPanels() {
    // Dynamic import panels
    const PanelComponents = [
        import("../../shared/Dialog/ResultXpDialog/GuestUser"),
        import("../../shared/Dialog/ResultXpDialog/RegisteredUser"),
    ].map(async (p, i) => {
        const { default: Component } = await p;
        return <Component key={i} />;
    });

    return await Promise.all(PanelComponents);
}

const theme = createTheme({
    palette: { primary: { main: "#007BFF" }, secondary: { main: "#dc3545" } },
});

export default compose<InnerProps, OuterProps>(
    connect((state: ApplicationState) => state.base)
)(Layout);
