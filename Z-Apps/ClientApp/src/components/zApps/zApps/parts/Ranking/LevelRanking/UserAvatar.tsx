import { Avatar, makeStyles, Theme } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { theme } from "../../../../Layout";
import { UserForRanking } from "./types";

export function UserAvatar({
    user,
    rank,
    size,
}: {
    user: UserForRanking;
    rank: number;
    size: number;
}) {
    const c = useStyles({ size, rank });

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
    theme.palette.secondary.light,
    theme.palette.primary.light,
    theme.palette.success.main,
    "#8E44AD",
    "#EC7063",
    "#34495E",
    "#5499C7",
    "#D4AC0D",
];

type StyleProps = { size: number; rank: number };
const useStyles = makeStyles<Theme, StyleProps>({
    imgAvatar: ({ size }) => ({ width: size, height: size }),
    img: ({ size }) => ({
        objectFit: "cover",
        objectPosition: "50% 50%",
        width: size,
        height: size,
    }),
    iconAvatar: ({ size, rank }) => ({
        width: size,
        height: size,
        backgroundColor: colors[rank % colors.length],
    }),
    icon: ({ size }) => ({
        width: size * 0.8,
        height: size * 0.8,
    }),
});
