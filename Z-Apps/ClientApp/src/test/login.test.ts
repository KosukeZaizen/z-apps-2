import "jest";
import { getFunctionsFromGenre } from "../components/zApps/Layout/Login/MyPage/progressManager/vocabAndKanji";
import { vocabGenre } from "../types/vocab";

const allGenres = [
    { genreId: 1 },
    { genreId: 2 },
    { genreId: 3 },
    { genreId: 4 },
] as vocabGenre[];

describe("vocabAndKanji merge progress", () => {
    describe("getFunctionsFromGenre", () => {
        test("vocab", () => {
            const functions = getFunctionsFromGenre(allGenres);

            expect(functions["vocab-quiz-percentage-1"]("20", "10")).toEqual(
                "db"
            );
            expect(functions["vocab-quiz-incorrectIds-1"]("10", "20")).toEqual(
                "db"
            );

            expect(functions["vocab-quiz-percentage-2"]("10", "20")).toEqual(
                "storage"
            );
            expect(functions["vocab-quiz-incorrectIds-2"]("10", null)).toEqual(
                "storage"
            );

            expect(functions["vocab-quiz-percentage-3"]("null", null)).toEqual(
                "none"
            );
            expect(
                functions["vocab-quiz-incorrectIds-3"]("null", null)
            ).toEqual("none");

            expect(functions["vocab-quiz-percentage-4"]("null", "100")).toEqual(
                "storage"
            );
            expect(functions["vocab-quiz-incorrectIds-4"]("100", "0")).toEqual(
                "storage"
            );
        });

        test("kanji", () => {
            const functions = getFunctionsFromGenre(allGenres);

            expect(functions["kanji-quiz-percentage-1"]("20", "10")).toEqual(
                "db"
            );
            expect(functions["kanji-quiz-incorrectIds-1"]("10", "20")).toEqual(
                "db"
            );

            expect(functions["kanji-quiz-percentage-2"]("10", "20")).toEqual(
                "storage"
            );
            expect(functions["kanji-quiz-incorrectIds-2"]("10", null)).toEqual(
                "storage"
            );

            expect(functions["kanji-quiz-percentage-3"]("null", null)).toEqual(
                "none"
            );
            expect(
                functions["kanji-quiz-incorrectIds-3"]("null", null)
            ).toEqual("none");

            expect(functions["vocab-quiz-percentage-4"]("null", "100")).toEqual(
                "storage"
            );
            expect(functions["vocab-quiz-incorrectIds-4"]("100", "0")).toEqual(
                "storage"
            );
        });
    });
});

