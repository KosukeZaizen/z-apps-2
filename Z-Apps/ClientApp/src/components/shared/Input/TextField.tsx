import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";

export function TextField({ onMouseDown, onFocus, ...rest }: TextFieldProps) {
    return (
        <MuiTextField
            {...rest}
            onMouseDown={ev => {
                (
                    ev.target as HTMLInputElement | HTMLTextAreaElement
                ).style.fontSize = "16px";
                onMouseDown?.(ev);
            }}
            onFocus={ev => {
                ev.target.style.fontSize = "";
                onFocus?.(ev);
            }}
        />
    );
}

