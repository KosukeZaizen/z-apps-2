import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { User } from "../../../../../../common/hooks/useUser";
import ShurikenProgress from "../../../../../shared/Animations/ShurikenProgress";
import { UploadCameraButton } from "../../../../../shared/User/UserAvatar/UploadCameraButton";
import { UserAvatar } from "../../../../../shared/User/UserAvatar/UserAvatar";

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
            <UploadCameraButton
                submitting={submitting}
                setSubmitting={setSubmitting}
                userId={user.userId}
                size={30}
                style={{
                    position: "absolute",
                    right: -7,
                    bottom: -5,
                    margin: 0,
                }}
            />
        </div>
    );
}
const useAvatarFieldStyles = makeStyles(({ palette }) => ({
    container: { position: "relative" },
}));
