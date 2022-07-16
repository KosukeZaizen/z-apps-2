import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import PencilIcon from "@material-ui/icons/Create";
import { User } from "../../../../../../common/hooks/useUser";
import { Markdown } from "../../../../../shared/Markdown";

export function BioField({ user }: { user: User }) {
    const c = useBioAreaStyles();

    return (
        <div style={{ width: "100%", marginTop: 25, position: "relative" }}>
            <Card style={{ padding: 15 }}>
                <Markdown source={user.bio} />
            </Card>
            <Button variant="contained" className={c.editButton}>
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
}));

