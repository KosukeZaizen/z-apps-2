import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import Collapse from "reactstrap/lib/Collapse";
import Container from "reactstrap/lib/Container";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import NavLink from "reactstrap/lib/NavLink";
import { LinkOrA } from "../../shared/Link/LinkOrA";
import { Link } from "../../shared/Link/LinkWithYouTube";
import "./NavMenu.css";

function NavigationItems(props: { closeToggle: () => void }) {
    let links: { key: string; url: string }[] = [
        { key: "Vocabulary", url: "/" },
        {
            key: "Japanese Folktales",
            url: "https://www.lingual-ninja.com/folktales",
        },
        {
            key: "Hiragana / Katakana",
            url: "https://www.lingual-ninja.com/hiragana-katakana",
        },
        { key: "Action Games", url: "https://www.lingual-ninja.com/ninja" },
        { key: "Articles", url: "https://articles.lingual-ninja.com" },
    ];

    return (
        <ul className="navbar-nav flex-grow" onClick={props.closeToggle}>
            {links.map(l => (
                <NavLink
                    key={l.key}
                    tag={LinkOrA}
                    className="text-light dropdown"
                    href={l.url}
                >
                    {l.key}
                </NavLink>
            ))}
        </ul>
    );
}

interface OuterProps {}

type InnerProps = OuterProps;

class NavMenu extends React.Component<
    InnerProps,
    {
        isOpen: boolean;
    }
> {
    constructor(props: InnerProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.closeToggle = this.closeToggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    closeToggle() {
        this.setState({
            isOpen: false,
        });
    }
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
                            <span
                                style={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "bold",
                                }}
                                className="z-apps-title text-light"
                                onClick={this.closeToggle}
                            >
                                Japanese Vocab
                            </span>
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <Collapse
                            className="d-md-inline-flex flex-md-row-reverse"
                            isOpen={this.state.isOpen}
                            navbar
                        >
                            <NavigationItems closeToggle={this.closeToggle} />
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default NavMenu;
