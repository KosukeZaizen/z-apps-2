export const Direction = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
} as const;
export type Direction = typeof Direction[keyof typeof Direction];
