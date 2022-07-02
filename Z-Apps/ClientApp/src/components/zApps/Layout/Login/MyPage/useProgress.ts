import { useEffect, useState } from "react";
import { vocabGenre } from "../../../../../types/vocab";
import { getKanaPercentage } from "../../../zApps/parts/KanaQuiz/kanaProgress";
import "./style.css";

export function useProgress(
    loadAllGenres: () => void,
    allGenres: vocabGenre[]
) {
    const [kanaProgress, setKanaProgress] = useState(0);
    const [hiraganaProgress, setHiraganaProgress] = useState(0);
    const [katakanaProgress, setKatakanaProgress] = useState(0);
    const [vocabProgress, setVocabProgress] = useState(0);
    const [kanjiProgress, setKanjiProgress] = useState(0);
    const [vocabAndKanjiProgress, setVocabAndKanjiProgress] = useState(0);
    const [actionGameProgress, setActionGameProgress] = useState(0);

    useEffect(() => {
        loadAllGenres();

        const hiraganaPercentage = getKanaPercentage("Hiragana");
        const katakanaPercentage = getKanaPercentage("Katakana");

        setHiraganaProgress(hiraganaPercentage);
        setKatakanaProgress(katakanaPercentage);
        setKanaProgress(
            Math.floor(
                (getKanaPercentage("Hiragana") +
                    getKanaPercentage("Katakana")) /
                    2
            )
        );
        setActionGameProgress(
            [1, 2, 3]
                .map(i => localStorage.getItem(`action-game${i}-progress`))
                .filter(p => p).length
        );
    }, [loadAllGenres]);

    useEffect(() => {
        const { vocab, kanji } = getVocabPercentage(allGenres);
        setVocabProgress(Math.floor(vocab));
        setKanjiProgress(Math.floor(kanji));
        setVocabAndKanjiProgress(Math.floor((vocab + kanji) / 2));
    }, [allGenres.length]);

    return {
        kanaProgress,
        hiraganaProgress,
        katakanaProgress,
        vocabProgress,
        kanjiProgress,
        vocabAndKanjiProgress,
        actionGameProgress,
    };
}

function getVocabPercentage(allVocabGenres: vocabGenre[]): {
    vocab: number;
    kanji: number;
} {
    const { vocab, kanji } = allVocabGenres.reduce(
        (acc, { genreId }) => ({
            vocab:
                acc.vocab +
                Number(
                    localStorage.getItem(`vocab-quiz-percentage-${genreId}`)
                ),
            kanji:
                acc.kanji +
                Number(
                    localStorage.getItem(`kanji-quiz-percentage-${genreId}`)
                ),
        }),
        { vocab: 0, kanji: 0 }
    );

    return {
        vocab: vocab / allVocabGenres.length,
        kanji: kanji / allVocabGenres.length,
    };
}
