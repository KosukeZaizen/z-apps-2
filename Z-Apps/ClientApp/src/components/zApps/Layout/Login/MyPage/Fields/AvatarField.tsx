import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CameraIcon from "@material-ui/icons/CameraAlt";
import { useState } from "react";
import { changeAppState } from "../../../../../../common/appState";
import { User } from "../../../../../../common/hooks/useUser";
import ShurikenProgress from "../../../../../shared/Animations/ShurikenProgress";
import { UserAvatar } from "../../../../../shared/Avatar/UserAvatar";

export function AvatarField({ user }: { user: User }) {
    const c = useAvatarFieldStyles();
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className={c.container}>
            {submitting ? (
                <ShurikenProgress style={{ width: 80, height: 80 }} size={60} />
            ) : (
                <UserAvatar user={user} colorNumber={"noColor"} size={80} />
            )}

            <input
                type="file"
                accept="image/*"
                className={c.input}
                id="icon-button-photo"
                onChange={({ target }) => {
                    if (!target.files || !target.files[0]) {
                        return;
                    }
                    const file = target.files[0];

                    const error = validate(file);
                    if (error) {
                        alert(error);
                        return;
                    }

                    setSubmitting(true);
                    fetchUpdateAvatar(user.userId, file).then(({ user }) => {
                        changeAppState("user", user);
                        setTimeout(() => {
                            setSubmitting(false);
                        }, 50);
                    });
                }}
            />
            {!submitting && (
                <label htmlFor="icon-button-photo" className={c.label}>
                    <Button
                        variant="contained"
                        className={c.cameraButton}
                        component="span"
                    >
                        <CameraIcon className={c.cameraIcon} />
                    </Button>
                </label>
            )}
        </div>
    );
}
const useAvatarFieldStyles = makeStyles(({ palette }) => ({
    container: { position: "relative" },
    label: { position: "absolute", right: -7, bottom: -5, margin: 0 },
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
        transform: "scale(0.8)",
    },
    cameraIcon: { width: 20, height: 20 },
    input: { display: "none" },
}));

async function fetchUpdateAvatar(
    userId: number,
    file: File
): Promise<{ user: User }> {
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("file", file);

    const res = await fetch("api/User/UpdateAvatar", {
        method: "POST",
        body: formData,
    });
    return res.json();
}

function validate(file: File) {
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        return "Sorry, only JPG, JPEG, PNG & GIF files are allowed";
    }

    if (file.size > 3000000) {
        return "File size must be less than 3MB";
    }
    return null;
}
