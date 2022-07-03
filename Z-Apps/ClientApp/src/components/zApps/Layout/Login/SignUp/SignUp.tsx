import { Collapse } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
    ChangeEventHandler,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import { changeAppState, getAppState } from "../../../../../common/appState";
import { sendPost } from "../../../../../common/functions";
import { useAbTest } from "../../../../../common/hooks/useAbTest";
import { useScreenSize } from "../../../../../common/hooks/useScreenSize";
import { User } from "../../../../../common/hooks/useUser";
import { FetchResult } from "../../../../../types/fetch";
import ShurikenProgress from "../../../../shared/Animations/ShurikenProgress";
import CharacterComment from "../../../../shared/CharacterComment";
import { loginSuccess } from "../MyPage/loginSuccess";
import { signInPanelWidth } from "../Panel";
import { realTimeValidate, submissionValidate } from "./validation";

export function SignUp({
    chosen,
    panelClosed,
    email,
    password,
    setEmail,
    setPassword,
}: {
    chosen: boolean;
    panelClosed: boolean;
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}) {
    const classes = useStyles();
    const { screenWidth } = useScreenSize();
    const { getAbTestedComment, abTestSuccess } = useAbTestedComment(chosen);
    const {
        abTestKey: abTestKey_UserNameShown,
        abTestSuccess: abTestSuccess_UserNameShown,
    } = useAbTest({
        testName: "SignUpPanel-UserNameFieldVisible",
        keys: ["hidden", "shown"] as const,
        open: chosen,
    });

    const [name, setName] = useState("");

    const [submissionError, setSubmissionError] = useState<ReactNode>(null);
    const realTimeError = useMemo<ReactNode>(
        () => realTimeValidate(name, email, password),
        [name, email, password]
    );
    const [submitting, setSubmitting] = useState(false);
    const error = submissionError || realTimeError;

    const onSubmit = async (ev: SyntheticEvent) => {
        ev.preventDefault();

        const sError = submissionValidate(name, email, password);
        if (sError) {
            setSubmissionError(sError);
            return;
        }

        setSubmitting(true);
        const user: FetchResult<User> = await sendPost(
            {
                name: name.trim() || email.split("@")[0],
                email,
                password,
                initialXp: getAppState().xpBeforeSignUp,
            },
            "api/Auth/Register"
        );

        if ("error" in user) {
            setSubmissionError(
                getSubmissionError(user.error, () => {
                    setEmail(email);
                })
            );
            setSubmitting(false);
            return;
        }

        abTestSuccess();
        await loginSuccess(user);
        setSubmitting(false);
    };

    const { partiallyOpened, completelyOpened } = useOpenState(chosen);
    if (!partiallyOpened) {
        return null;
    }

    const sidePadding = screenWidth > 600 ? 25 : 15;

    return (
        <Container
            component="div"
            style={{
                position: "absolute",
                right:
                    panelClosed || completelyOpened ? 0 : chosen ? 600 : -600,
                transition: "all 500ms",
                paddingLeft: sidePadding,
                paddingRight: sidePadding,
            }}
            key="signUp"
        >
            <div className={classes.paper}>
                <div className={classes.signUpTitleContainer}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h2 className={classes.signUpTitle}>Sign up</h2>
                </div>

                <CharacterComment
                    imgNumber={2}
                    screenWidth={Math.min(signInPanelWidth - 58, screenWidth)}
                    comment={
                        <div className={classes.signUpComment}>
                            {getAbTestedComment()}
                        </div>
                    }
                />

                {error && <div className={classes.errorContainer}>{error}</div>}

                <form className={classes.form} onSubmit={onSubmit}>
                    <UserNameField
                        setName={setName}
                        setSubmissionError={setSubmissionError}
                        name={name}
                        abTestKey={abTestKey_UserNameShown}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        autoComplete="email"
                        onChange={ev => {
                            setEmail(ev.target.value.trim());
                            setSubmissionError(null);
                        }}
                        value={email}
                    />

                    <PasswordField
                        onChange={ev => {
                            setPassword(ev.target.value.trim());
                            setSubmissionError(null);
                        }}
                        password={password}
                    />

                    <SubmitButton
                        submitting={submitting}
                        chosen={chosen}
                        error={error}
                        className={classes.submit}
                        success={abTestSuccess_UserNameShown}
                    />

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <a
                                href="#"
                                onClick={ev => {
                                    ev.preventDefault();
                                    changeAppState(
                                        "signInPanelState",
                                        "signIn"
                                    );
                                }}
                            >
                                Already have an account? Sign in
                            </a>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

function UserNameField({
    setName,
    setSubmissionError,
    name,
    abTestKey,
}: {
    setName: (name: string) => void;
    setSubmissionError: (error: ReactNode) => void;
    name: string;
    abTestKey?: "hidden" | "shown";
}) {
    if (abTestKey === "hidden") {
        return null;
    }
    return (
        <Collapse in={abTestKey === "shown"}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                autoComplete="username"
                onChange={ev => {
                    setName(ev.target.value);
                    setSubmissionError(null);
                }}
                value={name}
            />
        </Collapse>
    );
}

function SubmitButton({
    submitting,
    chosen,
    error,
    className,
    success,
}: {
    submitting: boolean;
    chosen: boolean;
    error?: ReactNode;
    className: string;
    success: () => void;
}) {
    const { abTestKey, abTestSuccess } = useAbTest({
        testName: "SignUpPanel-SubmitButtonMessage",
        keys: [
            "Sign Up",
            "Sign Up!",
            "Join Now",
            "Join Now!",
            "Register",
            "Register!",
        ] as const,
        open: chosen,
    });
    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={className}
            disabled={!!error || submitting}
            onClick={() => {
                abTestSuccess();
                success();
            }}
        >
            {!abTestKey || submitting ? (
                <ShurikenProgress size="7%" />
            ) : (
                abTestKey
            )}
        </Button>
    );
}

function useAbTestedComment(chosen: boolean) {
    const { abTestKey, abTestSuccess } = useAbTest({
        testName: "SignUpPanel-CharacterComment-Instruction",
        keys: [
            "can-check-level",
            "can-sync",
            "save-progress",
            "save-progress-noCreditCard",
            "japanese-master",
            "japanese-master-noCreditCard",
        ] as const,
        open: chosen,
    });
    return {
        getAbTestedComment: () => {
            switch (abTestKey) {
                case "can-check-level": {
                    return "You can always check your current Japanese level by making a free lifetime account!";
                }
                case "can-sync": {
                    return "You can sync your progress between your devices or browsers by making an account!";
                }
                case "save-progress": {
                    return "Make a free lifetime account to save your progress!";
                }
                case "save-progress-noCreditCard": {
                    return "Make a free lifetime account to save your progress! No credit card needed!";
                }
                case "japanese-master": {
                    return "Make a free lifetime account, and be a Japanese master!";
                }
                case "japanese-master-noCreditCard": {
                    return "Make a free lifetime account, and be a Japanese master! No credit card needed!";
                }
                case undefined: {
                    return <ShurikenProgress size="15%" />;
                }
                default: {
                    const exhaustiveCheck: never = abTestKey;
                    return null;
                }
            }
        },
        abTestSuccess,
    };
}

export function PasswordField({
    onChange,
    password,
}: {
    onChange: ChangeEventHandler<HTMLInputElement>;
    password: string;
}) {
    const [visible, setVisible] = useState(false);
    const classes = useStyles();

    return (
        <div className={classes.passwordContainer}>
            <TextField
                variant="outlined"
                margin="none"
                required
                fullWidth
                label="Password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                onChange={onChange}
                value={password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                    setVisible(!visible);
                                }}
                            >
                                {visible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}

export function useOpenState(open: boolean) {
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (open && !showContent) {
            // when open
            setTimeout(() => {
                setShowContent(true);
            }, 100);
            return;
        }
        if (!open && showContent) {
            // when close
            setTimeout(() => {
                setShowContent(false);
            }, 550);
        }
    }, [open]);

    return {
        partiallyOpened: open || showContent,
        completelyOpened: open && showContent,
    };
}

export const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    passwordContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 8,
    },
    errorContainer: {
        padding: 10,
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 15,
        color: "red",
    },
    bold: { fontWeight: "bold" },
    signUpTitleContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 15,
    },
    signUpTitle: { fontWeight: "bold", paddingRight: 56 },
    signUpComment: {
        textAlign: "left",
        padding: "0 8px",
    },
}));

function getSubmissionError(
    error: string,
    setSignInEmail: () => void
): ReactNode {
    if (error === "duplication") {
        return (
            <span>
                This email address has already been registered.
                <br />
                Do you want to{" "}
                <a
                    href="#"
                    onClick={ev => {
                        ev.preventDefault();
                        setSignInEmail();
                        changeAppState("signInPanelState", "signIn");
                    }}
                    className="bold"
                >
                    sign in
                </a>
                ?
            </span>
        );
    }
    return error;
}
