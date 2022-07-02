import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import Container from "reactstrap/lib/Container";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import { Link } from "../../shared/Link/LinkWithYouTube";
import "./NavMenu.css";

interface State {
    isOpen: boolean;
}

class NavMenu extends React.Component<never, State> {
    constructor(props: never) {
        super(props);

        this.state = {
            isOpen: false,
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };
    closeToggle = () => {
        this.setState({
            isOpen: false,
        });
    };

    render() {
        return (
            <header>
                <Navbar
                    variant="pills"
                    className="navbar-inverse navbar-expand-md navbar-toggleable-md border-bottom box-shadow mb-3"
                    style={{ backgroundColor: "#222222" }}
                >
                    <Container>
                        <NavbarBrand tag={Link} to="/">
                            <b
                                onClick={this.closeToggle}
                                className="z-apps-title text-light"
                            >
                                <span style={{ whiteSpace: "nowrap" }}>
                                    Lingual Ninja
                                </span>
                            </b>
                        </NavbarBrand>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default NavMenu;
