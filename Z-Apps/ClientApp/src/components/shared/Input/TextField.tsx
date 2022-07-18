import { makeStyles } from "@material-ui/core/styles";
import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";

export function TextField({ className, ...rest }: TextFieldProps) {
    const c = useStyles();
    return (
        <MuiTextField
            {...rest}
            className={spaceBetween(c.textField, className)}
        />
    );
}
const useStyles = makeStyles({
    textField: {
        /**
         * To prevent iPhone screen from zooming automatically
         *   - Reference: https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone
         */
        fontSize: 16,
    },
});

