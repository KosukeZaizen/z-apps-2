import React from "react";
import { menuStyle } from "..";
import { Routes } from "../../../App";

export function MenuContent({ open, UL }: { open: boolean; UL: number }) {
    return (
        <div
            style={{
                width:
                    (160 -
                        (2 * menuStyle.screenMargin +
                            2 * menuStyle.buttonMargin +
                            menuStyle.buttonWidth)) *
                    UL,
                height: (90 - 2 * menuStyle.screenMargin) * UL,
                opacity: open ? 1 : 0,
                transition: "500ms",
            }}
        >
            <Routes UL={UL} />
        </div>
    );
}
