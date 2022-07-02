import MaterialUiTooltip, { TooltipProps } from "@material-ui/core/Tooltip";

export function Tooltip({ title, ...rest }: TooltipProps) {
    return (
        <MaterialUiTooltip
            {...rest}
            title={
                <span
                    style={{
                        fontSize: "large",
                    }}
                >
                    {title}
                </span>
            }
        />
    );
}
