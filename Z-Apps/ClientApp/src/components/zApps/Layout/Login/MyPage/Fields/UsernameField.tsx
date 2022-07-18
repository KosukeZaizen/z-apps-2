import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import PencilIcon from "@material-ui/icons/Create";
import { useState } from "react";
import { changeAppState } from "../../../../../../common/appState";
import { User } from "../../../../../../common/hooks/useUser";
import ShurikenProgress from "../../../../../shared/Animations/ShurikenProgress";
import { TextField } from "../../../../../shared/Input/TextField";

export function UsernameField({ user }: { user: User }) {
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return <EditField user={user} setEditMode={setEditMode} />;
    }
    return <PreviewField user={user} setEditMode={setEditMode} />;
}

function PreviewField({
    user,
    setEditMode,
}: {
    user: User;
    setEditMode: (editMode: boolean) => void;
}) {
    const c = usePreviewFieldStyles();
    return (
        <h2 className={c.container}>
            {user.name}
            <IconButton
                onClick={() => {
                    setEditMode(true);
                }}
                className={c.iconButton}
            >
                <PencilIcon className={c.pencilIcon} />
            </IconButton>
        </h2>
    );
}
const usePreviewFieldStyles = makeStyles({
    container: {
        marginTop: 15,
        marginBottom: 20,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        paddingLeft: 35,
    },
    iconButton: { padding: 5, marginBottom: -5 },
    pencilIcon: { height: 25, width: 25 },
});

function EditField({
    user,
    setEditMode,
}: {
    user: User;
    setEditMode: (editMode: boolean) => void;
}) {
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(user.name);

    const error =
        !name || name.length > 20
            ? "Your username must contain between 1 and 20 characters."
            : undefined;

    const c = useEditFieldStyles();

    return (
        <h2 className={c.container}>
            <TextField
                label="Username"
                autoFocus
                value={name}
                onChange={ev => {
                    setName(ev.target.value || "");
                }}
                helperText={
                    error ? (
                        <div className={c.errorText}>{error}</div>
                    ) : undefined
                }
                error={!!error}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                variant="contained"
                                className={c.saveButton}
                                onClick={() => {
                                    setSubmitting(true);
                                    fetchUpdateName(user.userId, name).then(
                                        ({ user }) => {
                                            setSubmitting(false);
                                            changeAppState("user", user);
                                            setEditMode(false);
                                        }
                                    );
                                }}
                                color="primary"
                                disabled={!!error || submitting}
                            >
                                {submitting ? (
                                    <ShurikenProgress size={20} />
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </InputAdornment>
                    ),
                }}
            />
        </h2>
    );
}
const useEditFieldStyles = makeStyles({
    container: {
        marginTop: 15,
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-end",
    },
    saveButton: {
        maxWidth: 30,
        maxHeight: 30,
        transition: "all 200ms",
        marginLeft: -2,
    },
    errorText: { color: "red", height: 20 },
});

async function fetchUpdateName(
    userId: number,
    name: string
): Promise<{ user: User }> {
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("name", name);

    const res = await fetch("api/User/UpdateName", {
        method: "POST",
        body: formData,
    });
    return res.json();
}
