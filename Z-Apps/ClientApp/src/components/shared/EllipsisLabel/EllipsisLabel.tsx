import { makeStyles, TooltipProps } from "@material-ui/core";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { Tooltip } from "../Tooltip";

export const EllipsisLabel = ({
    title,
    placement,
    style,
}: {
    title: string;
    placement?: TooltipProps["placement"];
    style?: CSSProperties;
}) => {
    const c = useStyles();

    const [isOverflowed, setIsOverflow] = useState(false);
    const textElementRef = useRef<HTMLDivElement>(null);
    const [trimmedTitle, setTrimmedTitle] = useState(title);
    const { screenWidth } = useScreenSize();

    useEffect(() => {
        setIsOverflow(false);
        setTrimmedTitle(title);
    }, [title, screenWidth]);

    useEffect(() => {
        if (!textElementRef.current) {
            return;
        }

        if (
            textElementRef.current.scrollWidth >
            textElementRef.current.clientWidth
        ) {
            setIsOverflow(true);
            setTrimmedTitle(trimmedTitle.slice(0, -1));
        }
    }, [trimmedTitle]);

    return (
        <Tooltip
            title={title}
            disableHoverListener={!isOverflowed}
            disableTouchListener={!isOverflowed}
            disableFocusListener={!isOverflowed}
            placement={placement}
        >
            <div ref={textElementRef} className={c.div} style={style}>
                {trimmedTitle}
                {isOverflowed && "..."}
            </div>
        </Tooltip>
    );
};
const useStyles = makeStyles({
    div: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
});
