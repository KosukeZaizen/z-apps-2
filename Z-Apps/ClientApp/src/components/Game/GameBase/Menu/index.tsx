import Button from "@material-ui/core/Button/Button";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Slide from "@material-ui/core/Slide/Slide";
import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { gameOpenAnimationTime } from "../GameFrame";
import { MenuContent } from "./Contents/MenuContent";

export type SubMenu = "Game" | "About";

export const menuLabels: { [key in SubMenu]: { name: string }[] } = {
    Game: [{ name: "status" }, { name: "skills" }],
    About: [{ name: "test1" }, { name: "test2" }, { name: "test3" }],
};

export const menuStyle = {
    screenMargin: 1,
    buttonWidth: 28,
    buttonHeight: 8,
    buttonMargin: 1,
    sectionMargin: 2,
    buttonFontSize: 3,
    smallButtonFontSize: 2,
};

export interface MenuState {
    isMenuOpen: boolean;
    subMenu: SubMenu;
}

class MenuStateManager {
    private _menuState: MenuState;
    private _setMenuState: (state: MenuState) => void;

    constructor(
        menuState: MenuState,
        setMenuState: (state: MenuState) => void
    ) {
        this._menuState = menuState;
        this._setMenuState = setMenuState;
    }

    getState() {
        return this._menuState;
    }

    setState(newState: Partial<MenuState>) {
        this._menuState = { ...this._menuState, ...newState };
        this._setMenuState(this._menuState);
    }
}
export let menuStateManager: MenuStateManager;

function useMenuStateManager() {
    const [menuState, setMenuState] = useState<MenuState>({
        isMenuOpen: true,
        subMenu: "Game",
    });

    useEffect(() => {
        menuStateManager = new MenuStateManager(menuState, setMenuState);
    }, []);

    return menuState;
}

export function GameMenu({ UL }: { UL: number }) {
    const { isMenuOpen, subMenu } = useMenuStateManager();

    const setOpen = useCallback((open: boolean) => {
        menuStateManager.setState({ isMenuOpen: open });
    }, []);
    const onClickMenuButton = useCallback(() => setOpen(!isMenuOpen), [
        isMenuOpen,
    ]);
    const onClickBlackLayer = useCallback(() => setOpen(false), []);

    return (
        <>
            <MenuButton UL={UL} open={isMenuOpen} onClick={onClickMenuButton} />
            <SideBar UL={UL} open={isMenuOpen} chosenSubMenu={subMenu} />
            <MenuScreen UL={UL} open={isMenuOpen} />
            <BlackLayer open={isMenuOpen} UL={UL} onClick={onClickBlackLayer} />
        </>
    );
}

function MenuButton({
    UL,
    open,
    onClick,
}: {
    UL: number;
    open: boolean;
    onClick: () => void;
}) {
    const style = useMemo<CSSProperties>(
        () => ({
            zIndex: 20005,
            position: "absolute",
            top: menuStyle.screenMargin * UL,
            right: (menuStyle.screenMargin + menuStyle.buttonMargin) * UL,
            width: menuStyle.buttonWidth * UL,
            height: menuStyle.buttonHeight * UL,
            fontSize: menuStyle.buttonFontSize * UL,
            fontWeight: "bold",
            opacity: UL ? (open ? 1 : 0.9) : 0,
            transition: gameOpenAnimationTime,
        }),
        [UL, open]
    );

    return (
        <Button
            variant="contained"
            color={open ? "secondary" : "primary"}
            style={style}
            onClick={onClick}
        >
            {open ? "Close" : "Menu"}
        </Button>
    );
}

function SideBar({
    UL,
    open,
    chosenSubMenu,
}: {
    UL: number;
    open: boolean;
    chosenSubMenu: SubMenu;
}) {
    const OutsideCollapseStyle = useMemo<CSSProperties>(
        () => ({
            position: "absolute",
            top:
                (menuStyle.screenMargin +
                    menuStyle.buttonHeight +
                    menuStyle.sectionMargin +
                    (chosenSubMenu === "Game" ? menuStyle.buttonMargin : 0)) *
                UL,
            transition: "500ms",
            right: menuStyle.screenMargin * UL,
            width: (menuStyle.buttonWidth + 2 * menuStyle.buttonMargin) * UL,
            zIndex: 20004,
        }),
        [chosenSubMenu, UL]
    );

    return (
        <Collapse in={open} style={OutsideCollapseStyle} timeout={500}>
            {(Object.keys(menuLabels) as (keyof typeof menuLabels)[]).map(
                subMenu => (
                    <EachMenu
                        key={subMenu}
                        UL={UL}
                        chosenSubMenu={chosenSubMenu}
                        subMenu={subMenu}
                    />
                )
            )}
        </Collapse>
    );
}

function EachMenu({
    UL,
    chosenSubMenu,
    subMenu,
}: {
    UL: number;
    chosenSubMenu: SubMenu;
    subMenu: SubMenu;
}) {
    const EachMenuDivStyle = useMemo<CSSProperties>(
        () => ({
            width: "100%",
            backgroundColor:
                chosenSubMenu === subMenu ? "rgba(255,255,255,0.7)" : undefined,
            transition: "500ms",
            borderTopRightRadius: UL,
            borderBottomRightRadius: UL,
        }),
        [chosenSubMenu, subMenu, UL]
    );

    const ButtonStyle = useMemo<CSSProperties>(
        () => ({
            margin: menuStyle.buttonMargin * UL,
            width: menuStyle.buttonWidth * UL,
            height: menuStyle.buttonHeight * UL,
            fontSize: menuStyle.buttonFontSize * UL,
            zIndex: 20004,
            fontWeight: "bold",
            transition: "500ms",
        }),
        [UL]
    );

    const onClickButton = useCallback(() => {
        menuStateManager.setState({ subMenu });
    }, [subMenu]);

    return (
        <div style={EachMenuDivStyle}>
            <Button
                variant="contained"
                color={chosenSubMenu === subMenu ? "primary" : "default"}
                style={ButtonStyle}
                onClick={onClickButton}
            >
                {subMenu}
            </Button>
            <Collapse in={chosenSubMenu === subMenu}>
                {menuLabels[subMenu].map(c => (
                    <LowestLayerButton key={c.name} name={c.name} UL={UL} />
                ))}
            </Collapse>
        </div>
    );
}

function LowestLayerButton({ name, UL }: { name: string; UL: number }) {
    const ButtonStyle = useMemo<CSSProperties>(
        () => ({
            margin: menuStyle.buttonMargin * UL,
            width: menuStyle.buttonWidth * UL,
            height: menuStyle.buttonHeight * UL,
            fontSize: menuStyle.smallButtonFontSize * UL,
            fontWeight: "bold",
            zIndex: 20004,
        }),
        [UL]
    );

    return (
        <Button
            key={name}
            variant="outlined"
            color="default"
            style={ButtonStyle}
        >
            {name}
        </Button>
    );
}

function MenuScreen({ UL, open }: { UL: number; open: boolean }) {
    return (
        <div
            style={{
                position: "absolute",
                top: menuStyle.screenMargin * UL,
                right: open
                    ? (menuStyle.screenMargin +
                          2 * menuStyle.buttonMargin +
                          menuStyle.buttonWidth) *
                      UL
                    : menuStyle.screenMargin,
                width: open
                    ? (160 -
                          (2 * menuStyle.screenMargin +
                              2 * menuStyle.buttonMargin +
                              menuStyle.buttonWidth)) *
                      UL
                    : 0,
                height: open ? (90 - 2 * menuStyle.screenMargin) * UL : 0,
                transition: gameOpenAnimationTime,
                zIndex: 20002,
                backgroundColor: "white",
                borderRadius: 1 * UL,
                overflow: "hidden",
            }}
        >
            <MenuContent open={open} UL={UL} />
        </div>
    );
}

function BlackLayer({
    UL,
    open,
    onClick,
}: {
    UL: number;
    open: boolean;
    onClick: () => void;
}) {
    const BlackLayerStyle = useMemo<CSSProperties>(
        () => ({
            position: "absolute",
            top: 0,
            left: 0,
            width: 160 * UL,
            height: 90 * UL,
            zIndex: 20001,
            backgroundColor: "black",
            opacity: 0.5,
        }),
        [UL]
    );

    return (
        <Slide in={open} direction="down">
            <div style={BlackLayerStyle} onClick={onClick} />
        </Slide>
    );
}
