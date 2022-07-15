import { Avatar } from "@material-ui/core";
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
    if (user.avatarPath) {
        return (
            <Avatar style={{ width: size, height: size }}>
                <img
                    src={user.avatarPath}
                    style={{
                        objectFit: "cover",
                        objectPosition: "50% 50%",
                        width: size,
                        height: size,
                    }}
                    alt={user.name}
                    title={user.name}
                />
            </Avatar>
        );
    }
    return (
        <Avatar
            style={{
                width: size,
                height: size,
                backgroundColor: colors[rank % colors.length],
            }}
        >
            <PersonIcon
                style={{
                    width: size * 0.8,
                    height: size * 0.8,
                }}
            />
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
