export const checkDataExistence = (data: string | null): data is string =>
    !!data && data !== "null" && data !== "undefined";

export const prioritizeDb = (db: string | null, storage: string | null) =>
    checkDataExistence(db)
        ? "db"
        : checkDataExistence(storage)
        ? "storage"
        : "none";

export const checkExistence = (db: string | null, storage: string | null) => {
    const dbExistence = checkDataExistence(db);
    const storageExistence = checkDataExistence(storage);

    if (dbExistence && storageExistence) {
        return "both";
    }
    if (dbExistence) {
        return "db";
    }
    if (storageExistence) {
        return "storage";
    }
    return "none";
};
