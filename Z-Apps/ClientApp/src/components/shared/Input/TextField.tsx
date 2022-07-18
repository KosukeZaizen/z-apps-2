import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";

export function TextField({
    onMouseDown,
    onFocus,
    inputProps,
    ...rest
}: TextFieldProps) {
    return (
        <MuiTextField
            {...rest}
            onMouseDown={ev => {
                /**
                 * Prevent iPhone screen from zooming automatically
                 *    Reference: https://stackoverflow.com/a/41487632
                 */
                (
                    ev.target as HTMLInputElement | HTMLTextAreaElement
                ).style.fontSize = "16px";
                onMouseDown?.(ev);
            }}
            onFocus={ev => {
                ev.target.style.fontSize = "";
                onFocus?.(ev);
            }}
            inputProps={
                rest.autoFocus
                    ? {
                          ...inputProps,
                          style: { ...inputProps?.style, fontSize: 16 },
                      }
                    : inputProps
            }
        />
    );
}

