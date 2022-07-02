import { vocabGenre } from "../../../../../../types/vocab";
import { CompareFunctions, ComparisonResult } from "./types";
import { checkExistence } from "./util";

export const getVocabAndKanjiFnc = async () => {
    const allGenres = await getAllGenres();
    return getFunctionsFromGenre(allGenres);
};

let genres: vocabGenre[];
async function getAllGenres(): Promise<vocabGenre[]> {
    if (!genres) {
        const res = await fetch("api/VocabQuiz/GetAllGenres");
        genres = await res.json();
    }
    return genres;
}

export function getFunctionsFromGenre(allGenres: vocabGenre[]) {
    return allGenres.reduce((acc, genre) => {
        return {
            ...acc,
            ...["vocab", "kanji"].reduce((acc2, type) => {
                let result: ComparisonResult;
                return {
                    ...acc2,
                    [`${type}-quiz-percentage-${genre.genreId}`]: (
                        db: string | null,
                        storage: string | null
                    ) => {
                        const existence = checkExistence(db, storage);
                        if (existence !== "both") {
                            result = existence;
                            return existence;
                        }

                        const dbPercentage = Number(JSON.parse(db as string)); // already checked the string existence
                        const storagePercentage = Number(
                            JSON.parse(storage as string)
                        ); // already checked the string existence

                        if (dbPercentage < storagePercentage) {
                            result = "storage";
                            return "storage";
                        }
                        result = "db";
                        return "db";
                    },
                    [`${type}-quiz-incorrectIds-${genre.genreId}`]: () => result,
                };
            }, {} as CompareFunctions),
        };
    }, {} as CompareFunctions);
}
