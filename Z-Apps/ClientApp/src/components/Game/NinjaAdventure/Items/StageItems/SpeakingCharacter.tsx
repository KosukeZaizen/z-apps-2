import Popover from "@material-ui/core/Popover";
import React, { CSSProperties, useMemo, useRef } from "react";
import { StageItem } from ".";
import { ImgSrc } from "../../../StorageItems";
import { Ninja } from "../Ninja";

interface Props {
    key: string;
    x: number;
    y: number;
    width: number;
    zIndex?: number;
    imgSrc?: ImgSrc;
    withoutIcon?: boolean;
}

export class SpeakingCharacter extends StageItem {
    isSpeaking: boolean;
    withoutIcon?: boolean;
    imgSrc?: ImgSrc;

    constructor(props: Props) {
        const { imgSrc, ...rest } = props;
        super({ type: "speakingCharacter", ...rest });
        this.isSpeaking = false;
        this.withoutIcon = props.withoutIcon;
        this.imgSrc = imgSrc;
    }

    onEachTime() {
        if (this.isSpeaking) {
            this.isSpeaking = false;
        }
    }

    onTouchNinja(ninja: Ninja) {
        if (!this.isSpeaking) {
            this.isSpeaking = true;
        }
    }

    renderItem(UL: number) {
        return (
            <SpeakingCharacterComponent
                key={this.key}
                alt={this.key}
                imgSrc={this.imgSrc}
                x={this.x}
                y={this.y}
                width={this.width}
                zIndex={this.zIndex}
                withoutIcon={this.withoutIcon}
                isSpeaking={this.isSpeaking}
                UL={UL}
            />
        );
    }
}

const origins = {
    anchor: { vertical: "top", horizontal: "left" },
    transform: { vertical: "bottom", horizontal: "left" },
} as const;

function SpeakingCharacterComponent({
    alt,
    imgSrc,
    x,
    y,
    width,
    zIndex,
    isSpeaking,
    withoutIcon,
    UL,
}: Pick<
    SpeakingCharacter,
    "imgSrc" | "x" | "y" | "width" | "zIndex" | "withoutIcon" | "isSpeaking"
> & {
    alt: SpeakingCharacter["key"];
    UL: number;
}) {
    const ref = useRef(null);

    const imgStyle = useMemo<CSSProperties>(
        () => ({
            position: "absolute",
            top: y * UL,
            left: x * UL,
            width: width * UL,
            zIndex: zIndex || 10,
        }),
        [x, y, width, zIndex, UL]
    );

    const dependingOnUl = useMemo(
        () =>
            ({
                popoverPaperProps: {
                    style: {
                        padding: 1 * UL,
                        fontSize: 5 * UL,
                        margin: 1 * UL,
                        maxWidth: 150 * UL,
                    },
                },
                iconStyle: {
                    width: 10 * UL,
                    float: "left",
                    margin: 3 * UL,
                },
                message: getMessages(UL, "pochi1"),
            } as const),
        [UL]
    );

    return (
        <>
            <img alt={alt} src={imgSrc} style={imgStyle} ref={ref} />
            <Popover
                anchorOrigin={origins.anchor}
                transformOrigin={origins.transform}
                PaperProps={dependingOnUl.popoverPaperProps}
                anchorEl={ref.current}
                open={isSpeaking}
            >
                {!withoutIcon && (
                    <img
                        alt={alt}
                        src={imgSrc}
                        style={dependingOnUl.iconStyle}
                    />
                )}
                {dependingOnUl.message}
            </Popover>
        </>
    );
}

type messageKey = "pochi1" | "hello";
function getMessages(UL: number, key: messageKey) {
    return {
        pochi1: (
            <div>
                Welcome!
                <br />
                If you want to be a good lingual ninja, you should collect
                Kotodama souls!
                <br />
                あああああああああああああああああああああああああああああああ
            </div>
        ),
        hello: <div>hello</div>,
    }[key];
}
