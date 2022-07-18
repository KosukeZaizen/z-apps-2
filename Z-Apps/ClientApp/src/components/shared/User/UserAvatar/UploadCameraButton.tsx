import { makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import CameraIcon from "@material-ui/icons/CameraAlt";
import { changeAppState } from "../../../../common/appState";
import { User } from "../../../../common/hooks/useUser";

export function UploadCameraButton({
    submitting,
    setSubmitting,
    userId,
    size,
    style,
}: {
    submitting: boolean;
    setSubmitting: (submitting: boolean) => void;
    userId: number;
    size: number;
    style?: BaseCSSProperties;
}) {
    const c = useUploadCameraStyles({ size, labelStyle: style });
    return (
        <>
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
                    fetchUpdateAvatar(userId, file).then(({ user }) => {
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
        </>
    );
}
const useUploadCameraStyles = makeStyles<
    Theme,
    {
        size: number;
        labelStyle?: BaseCSSProperties;
    }
>(({ palette }) => ({
    label: ({ labelStyle }) => ({
        ...labelStyle,
    }),
    cameraButton: ({ size }) => ({
        borderRadius: "50%",
        maxWidth: size,
        maxHeight: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: palette.grey[800],
        color: "white",
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
        transform: "scale(0.8)",
    }),
    cameraIcon: ({ size }) => ({
        width: (size * 2) / 3,
        height: (size * 2) / 3,
    }),
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

    if (file.size > 10000000) {
        return "File size must be less than 10MB";
    }
    return null;
}
