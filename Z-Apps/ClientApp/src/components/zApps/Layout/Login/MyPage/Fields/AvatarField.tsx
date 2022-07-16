import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CameraIcon from "@material-ui/icons/CameraAlt";
import { User } from "../../../../../../common/hooks/useUser";
import { UserAvatar } from "../../../../../shared/Avatar/UserAvatar";

export function AvatarField({ user }: { user: User }) {
    const c = useAvatarFieldStyles();

    return (
        <div className={c.container}>
            <UserAvatar user={user} colorNumber={"noColor"} size={80} />
            <Button variant="contained" className={c.cameraButton}>
                <CameraIcon className={c.cameraIcon} />
            </Button>
        </div>
    );
}
const useAvatarFieldStyles = makeStyles(({ palette }) => ({
    container: { position: "relative" },
    cameraButton: {
        borderRadius: "50%",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        backgroundColor: palette.grey[800],
        color: "white",
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
        position: "absolute",
        right: -7,
        bottom: -5,
        transform: "scale(0.8)",
    },
    cameraIcon: { width: 20, height: 20 },
}));
