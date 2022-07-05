import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import "bootstrap/dist/css/bootstrap.css";
import { CSSProperties, useEffect, useRef, useState } from "react";
import Collapse from "reactstrap/lib/Collapse";
import Container from "reactstrap/lib/Container";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import NavLink from "reactstrap/lib/NavLink";
import {
    changeAppState,
    getAppState,
    useAppState
} from "../../../common/appState";
import { ARTICLES_URL } from "../../../common/consts";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { useUser } from "../../../common/hooks/useUser";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import { DarkLayer } from "../../shared/DarkLayer";
import { A, Link } from "../../shared/Link/LinkWithYouTube";
import { Tooltip } from "../../shared/Tooltip";
import "./NavMenu.css";

const links: { name: string; url: string }[] = [
    { name: "Hiragana / Katakana", url: "/hiragana-katakana" },
    { name: "Vocab", url: "/vocabulary-quiz" },
    { name: "Folktales", url: "/folktales" },
    { name: "Articles", url: ARTICLES_URL },
    { name: "Games", url: "/ninja" },
];

function NavigationItems(props: { closeToggle: () => void }) {
    return (
        <ul className="navbar-nav flex-grow" onClick={props.closeToggle}>
            {links.map(l => {
                if (l.url.startsWith("https://")) {
                    return (
                        <NavLink
                            key={l.name}
                            tag={A}
                            className="text-light dropdown"
                            href={l.url}
                        >
                            {l.name}
                        </NavLink>
                    );
                }
                return (
                    <NavLink
                        key={l.name}
                        tag={Link}
                        className="text-light dropdown"
                        to={l.url}
                    >
                        {l.name}
                    </NavLink>
                );
            })}
        </ul>
    );
}

const topOverFlow = 50;

export default function NavMenu() {
    const c = useNavMenuStyles();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const headerHeight = useHeaderHeight(ref.current);
    const hideAppBar = useHideAppBar();

    useEffect(() => {
        const onScroll = () => {
            setIsOpen(false);
        };
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <header
                ref={ref}
                style={{
                    top: hideAppBar ? -(100 + topOverFlow) : -topOverFlow,
                    zIndex: isOpen ? 1102 : 1100,
                }}
            >
                <Navbar
                    variant="pills"
                    className="navbar-inverse navbar-expand-md navbar-toggleable-md border-bottom box-shadow mb-3"
                    style={{
                        backgroundColor: "#222222",
                        marginTop: topOverFlow,
                    }}
                >
                    <Container>
                        <NavbarBrand
                            tag={Link}
                            to="/"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            <span
                                className={spaceBetween(
                                    "z-apps-title text-light",
                                    c.titleContainer
                                )}
                            >
                                Lingual Ninja
                            </span>
                        </NavbarBrand>
                        <Menus isOpen={isOpen} setIsOpen={setIsOpen} />
                    </Container>
                </Navbar>
            </header>
            <div style={{ height: headerHeight, marginBottom: 14 }} />
            <DarkLayer
                open={isOpen}
                onClick={() => {
                    setIsOpen(false);
                }}
                zIndex={1101}
                transitionMilliseconds={500}
            />
        </>
    );
}
const useNavMenuStyles = makeStyles(() => ({
    titleContainer: {
        whiteSpace: "nowrap",
        fontWeight: "bold",
    },
}));

function Menus({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) {
    const c = useMenusStyles();
    const { screenWidth } = useScreenSize();
    const isHamburger = screenWidth < 768;
    return (
        <>
            <div className={c.iconsArea}>
                <NavbarToggler
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    className="mr-2"
                />
                {isHamburger && (
                    <LoginIcon
                        containerStyle={{
                            marginLeft: screenWidth / 30,
                            display: isOpen ? "none" : "block",
                        }}
                        isHamburger={isHamburger}
                        isOpenHamburger={isOpen && isHamburger}
                    />
                )}
            </div>
            <Collapse
                className="d-md-inline-flex flex-md-row-reverse"
                isOpen={isOpen}
                navbar
            >
                <NavigationItems
                    closeToggle={() => {
                        setIsOpen(false);
                    }}
                />
            </Collapse>
            {!isHamburger && (
                <LoginIcon
                    containerStyle={{
                        marginLeft: screenWidth / 30,
                    }}
                    isHamburger={isHamburger}
                />
            )}
        </>
    );
}
const useMenusStyles = makeStyles(() => ({
    iconsArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },
}));

function LoginIcon({
    containerStyle,
    isHamburger,
    isOpenHamburger,
}: {
    containerStyle: CSSProperties;
    isHamburger: boolean;
    isOpenHamburger?: boolean;
}) {
    const c = useLoginIconStyles();
    const { user } = useUser();
    const [isTooltipOpened, setTooltipOpened] = useState(false);
    const [xpBeforeSignUp] = useAppState("xpBeforeSignUp");
    const [level, setLevel] = useState(user?.level || 1);

    useEffect(() => {
        if (user) {
            setLevel(user.level);
            return;
        }
        fetchLevelForXp(xpBeforeSignUp).then(l => {
            setLevel(l);
        });
    }, [user?.level, xpBeforeSignUp]);

    const transitionClass = isHamburger ? "t500ms" : "t1s";

    return (
        <Tooltip
            title={user?.name || "Sign up"}
            placement="bottom"
            className={c.tooltip}
            onOpen={() => {
                setTooltipOpened(true);
            }}
            onClose={() => {
                setTooltipOpened(false);
            }}
        >
            <div
                style={containerStyle}
                className={spaceBetween(c.container, transitionClass)}
                onClick={() => {
                    if (user) {
                        changeAppState("signInPanelState", "myPageTop");
                        return;
                    }
                    changeAppState("signInPanelState", "signUp");
                }}
            >
                <PersonIcon
                    className={spaceBetween(
                        isOpenHamburger ? c.iconForOpenHamburger : c.icon,
                        transitionClass
                    )}
                />
                <div
                    className={spaceBetween(
                        c.levelCardContainer,
                        transitionClass,
                        isTooltipOpened ? "opacity0" : "opacity1"
                    )}
                >
                    <Card className={c.levelCard}>Lv.{level}</Card>
                </div>
            </div>
        </Tooltip>
    );
}
const useLoginIconStyles = makeStyles(theme => ({
    tooltip: { zIndex: 999999999999 },
    container: { display: "flex", flexDirection: "column" },
    levelCard: {
        backgroundColor: theme.palette.grey[800],
        color: "white",
        position: "absolute",
        top: -5,
        padding: "0 5px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    levelCardContainer: {
        height: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    icon: {
        width: 40,
        height: 40,
        color: "white",
        cursor: "pointer",
    },
    iconForOpenHamburger: {
        width: 0,
        height: 40,
        color: "white",
        cursor: "pointer",
    },
}));
async function fetchLevelForXp(xp: number) {
    const res = await fetch(`api/User/GetLevelFromXp?xp=${xp}`);
    return res.json();
}

function useHeaderHeight(headerElement: HTMLElement | null) {
    const [headerHeight, setHeaderHeight] = useAppState("headerHeight");
    const { screenWidth } = useScreenSize();
    useEffect(() => {
        if (headerElement) {
            setHeaderHeight(headerElement.clientHeight - (14 + topOverFlow));
        }
    }, [screenWidth]);
    return headerHeight;
}

export function scrollToElement(
    element: HTMLElement | null,
    noSmooth?: boolean
) {
    if (noSmooth) {
        element?.scrollIntoView(true);
        return;
    }

    const { headerHeight } = getAppState();
    const elementTop = element?.getBoundingClientRect()?.top || 0;
    window.scrollTo({
        top: window.scrollY + elementTop - headerHeight,
        behavior: "smooth",
    });
}

let previousScrollY = 0;
let isHidden = false;

function useHideAppBar() {
    const [hideAppBar, setHideAppBar] = useState(false);
    useEffect(() => {
        const scrollHandler = () => {
            const isRapidScroll = window.scrollY > previousScrollY + 500;
            previousScrollY = window.scrollY;

            if (window.scrollY < 100) {
                setHideAppBar(false);
                return;
            }

            if (isHidden) {
                return;
            }

            if (!isRapidScroll) {
                return;
            }

            setHideAppBar(true);
            isHidden = true;
            setTimeout(() => {
                setHideAppBar(false);
                isHidden = false;
            }, 5000);
        };

        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    return hideAppBar;
}
