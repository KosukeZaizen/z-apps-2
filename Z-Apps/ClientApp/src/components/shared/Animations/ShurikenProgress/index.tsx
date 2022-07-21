import { Theme } from "@material-ui/core";
import { BaseCSSProperties, makeStyles } from "@material-ui/styles";
import { appsPublicImg } from "../../../../common/consts";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import "./animation.css";

const shuriken = appsPublicImg + "shuriken.png";

interface Props {
    size?: string | number;
    style?: BaseCSSProperties;
}
export default function ShurikenProgress({ size, style }: Props) {
    const c = useShurikenProgressStyles({ size, style });
    return (
        <div className={spaceBetween("center", c.container)}>
            <img
                src={shuriken}
                alt="shuriken"
                className={spaceBetween("ShurikenProgress", c.img)}
            />
        </div>
    );
}
const useShurikenProgressStyles = makeStyles<
    Theme,
    {
        size?: string | number;
        style?: BaseCSSProperties;
    }
>({
    container: ({ style }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
    }),
    img: ({ size }) => ({ width: size, height: size }),
});

export function FullScreenShurikenProgress({ style, size }: Props) {
    const c = useFullScreenShurikenProgressStyles({ style });
    return (
        <div className={c.container}>
            <ShurikenProgress size={size || "20%"} />
        </div>
    );
}
const useFullScreenShurikenProgressStyles = makeStyles<
    Theme,
    { style?: BaseCSSProperties }
>({
    container: ({ style }) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
    }),
});
