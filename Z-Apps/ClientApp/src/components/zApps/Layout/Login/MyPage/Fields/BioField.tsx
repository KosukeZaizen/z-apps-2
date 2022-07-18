import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles, Theme } from "@material-ui/core/styles";
import PencilIcon from "@material-ui/icons/Create";
import { useState } from "react";
import { changeAppState } from "../../../../../../common/appState";
import { User } from "../../../../../../common/hooks/useUser";
import ShurikenProgress from "../../../../../shared/Animations/ShurikenProgress";
import { TextField } from "../../../../../shared/Input/TextField";
import { Markdown } from "../../../../../shared/Markdown";

export function BioField({ user }: { user: User }) {
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return <EditField user={user} setEditMode={setEditMode} />;
    }
    return <PreviewField bio={user.bio} setEditMode={setEditMode} />;
}

function PreviewField({
    bio,
    setEditMode,
}: {
    bio: string;
    setEditMode: (editMode: boolean) => void;
}) {
    const c = usePreviewFieldStyles();

    return (
        <div className={c.previewContainer}>
            <Card
                className={c.markdownContainerCard}
                onClick={() => {
                    setEditMode(true);
                }}
            >
                <Markdown source={bio} />
            </Card>
            <Button
                variant="contained"
                className={c.editButton}
                onClick={() => {
                    setEditMode(true);
                }}
            >
                <PencilIcon className={c.pencilIcon} />
            </Button>
        </div>
    );
}
const usePreviewFieldStyles = makeStyles(({ palette }) => ({
    pencilIcon: { width: 20, height: 20 },
    previewContainer: {
        width: "100%",
        marginTop: 25,
        position: "relative",
    },
    markdownContainerCard: { padding: 15, cursor: "pointer" },
    editButton: {
        backgroundColor: palette.grey[800],
        color: "white",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        position: "absolute",
        bottom: 5,
        right: 5,
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
    },
}));

function EditField({
    user,
    setEditMode,
}: {
    user: User;
    setEditMode: (editMode: boolean) => void;
}) {
    const [bio, setBio] = useState(user.bio);

    const error =
        bio.length > 999
            ? "Your bio must be less than 1000 characters."
            : undefined;

    const c = useEditFieldStyles({ isError: !!error });

    const [submitting, setSubmitting] = useState(false);

    return (
        <div className={c.editContainer}>
            <TextField
                label="Bio"
                variant="outlined"
                value={bio}
                multiline
                fullWidth
                onChange={ev => {
                    setBio(ev.target.value || "");
                }}
                inputProps={{
                    style: {
                        paddingBottom: 20,
                    },
                }}
                autoFocus
                helperText={
                    error ? (
                        <div className={c.errorText}>{error}</div>
                    ) : undefined
                }
            />
            <Button
                variant="contained"
                className={c.saveButton}
                onClick={() => {
                    setSubmitting(true);
                    fetchUpdateBio(user.userId, bio).then(({ user }) => {
                        setSubmitting(false);
                        changeAppState("user", user);
                        setEditMode(false);
                    });
                }}
                color="primary"
                disabled={!!error || submitting}
            >
                {submitting ? <ShurikenProgress size={20} /> : "Save"}
            </Button>
        </div>
    );
}
const useEditFieldStyles = makeStyles<Theme, { isError: boolean }>({
    editContainer: { width: "100%", marginTop: 25, position: "relative" },
    errorText: { color: "red", height: 20 },
    saveButton: ({ isError }) => ({
        position: "absolute",
        bottom: isError ? 30 : 5,
        right: 5,
        maxWidth: 30,
        maxHeight: 30,
        transition: "all 200ms",
    }),
});

async function fetchUpdateBio(
    userId: number,
    bio: string
): Promise<{ user: User }> {
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("bio", bio);

    const res = await fetch("api/User/UpdateBio", {
        method: "POST",
        body: formData,
    });
    return res.json();
}
