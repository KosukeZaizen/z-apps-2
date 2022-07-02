export type ComparisonResult = "db" | "storage" | "none";

type CompareFnc = (
    db: string | null,
    storage: string | null
) => ComparisonResult;

export type CompareFunctions = {
    [key: string]: CompareFnc;
};
