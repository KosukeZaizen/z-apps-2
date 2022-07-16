import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PencilIcon from "@material-ui/icons/Create";
import { useEffect, useState } from "react";
import { User } from "../../../../../../common/hooks/useUser";
import { Markdown } from "../../../../../shared/Markdown";

export function BioField({ user }: { user: User }) {
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState(user.bio);

    useEffect(() => {
        setBio(user.bio);
    }, [user.bio]);

    const error =
        bio.length > 999
            ? "Your bio must be less than 1000 characters."
            : undefined;

    const c = useBioAreaStyles({ isError: !!error });

    if (editMode) {
        return (
            <div className={c.editContainer}>
                <TextField
                    label="Bio"
                    variant="outlined"
                    value={bio}
                    multiline
                    fullWidth
                    onChange={ev => {
                        setBio(ev.target.value);
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
                        setEditMode(false);
                    }}
                    color="primary"
                    disabled={!!error}
                >
                    Save
                </Button>
            </div>
        );
    }

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
const useBioAreaStyles = makeStyles<Theme, { isError: boolean }>(
    ({ palette }) => ({
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
    })
);

