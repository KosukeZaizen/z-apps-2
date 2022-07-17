import { Avatar, makeStyles, Theme } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { User } from "../../../common/hooks/useUser";
import { theme } from "../../zApps/Layout";
import { UserForRanking } from "../../zApps/zApps/parts/Ranking/LevelRanking/types";

export function UserAvatar({
    user,
    colorNumber,
    size,
}: {
    user: User | UserForRanking;
    colorNumber: number | "noColor";
    size: number;
}) {
    const c = useStyles({ size, colorNumber });

    if (user.avatarPath) {
        return (
            <Avatar className={c.imgAvatar}>
                <img
                    src={user.avatarPath}
                    className={c.img}
                    alt={user.name}
                    title={user.name}
                />
            </Avatar>
        );
    }
    return (
        <Avatar className={c.iconAvatar}>
            <PersonIcon className={c.icon} />
        </Avatar>
    );
}

const colors = [
    "#DC7633",
    theme.palette.primary.light,
    theme.palette.success.main,
    theme.palette.secondary.light,
    "#8E44AD",
    "#EC7063",
    "#34495E",
    "#5499C7",
    "#D4AC0D",
];

const useStyles = makeStyles<
    Theme,
    { size: number; colorNumber: number | "noColor" }
>({
    imgAvatar: ({ size }) => ({ width: size, height: size }),
    img: ({ size }) => ({
        objectFit: "cover",
        objectPosition: "50% 50%",
        width: size,
        height: size,
    }),
    iconAvatar: ({ size, colorNumber }) => ({
        width: size,
        height: size,
        backgroundColor:
            colorNumber === "noColor"
                ? undefined
                : colors[colorNumber % colors.length],
    }),
    icon: ({ size }) => ({
        width: size * 0.8,
        height: size * 0.8,
    }),
});
