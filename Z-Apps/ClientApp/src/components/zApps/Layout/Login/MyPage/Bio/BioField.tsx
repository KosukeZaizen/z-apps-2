import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PencilIcon from "@material-ui/icons/Create";
import { useEffect, useState } from "react";
import { User } from "../../../../../../common/hooks/useUser";
import { Markdown } from "../../../../../shared/Markdown";

export function BioField({ user }: { user: User }) {
    const c = useBioAreaStyles();
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState(user.bio);

    useEffect(() => {
        setBio(user.bio);
    }, [user.bio]);

    if (editMode) {
        return (
            <div style={{ width: "100%", marginTop: 25, position: "relative" }}>
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
                />
                <Button
                    variant="contained"
                    className={c.saveButton}
                    onClick={() => {
                        setEditMode(false);
                    }}
                    color="primary"
                >
                    Save
                </Button>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", marginTop: 25, position: "relative" }}>
            <Card style={{ padding: 15 }}>
                <Markdown source={bio} />
            </Card>
            <Button
                variant="contained"
                className={c.editButton}
                onClick={() => {
                    setEditMode(true);
                }}
            >
                <PencilIcon style={{ width: 20, height: 20 }} />
            </Button>
        </div>
    );
}
const useBioAreaStyles = makeStyles(({ palette }) => ({
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
    saveButton: {
        position: "absolute",
        bottom: 5,
        right: 5,
        maxWidth: 30,
        maxHeight: 30,
        transition: "all 200ms",
    },
}));

