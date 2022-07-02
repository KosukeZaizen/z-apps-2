import * as React from "react";
import Container from "reactstrap/lib/Container";
import "./Layout.css";

interface Props {
    children: React.ReactNode;
}

function Layout({ children }: Props) {
    return (
        <div style={{ paddingTop: 20 }}>
            {/* <NavMenu /> */}
            <Container className="contents-container">{children}</Container>
        </div>
    );
}

export default Layout;
