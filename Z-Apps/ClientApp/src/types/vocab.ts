export type vocab = {
    genreId: number;
    vocabId: number;
    hiragana: string;
    kanji: string;
    english: string;
    order: number;
};
export type vocabGenre = {
    genreId: number & { _vocabGenreId: never };
    genreName: string;
    order: number;
    youtube: string;
    released: boolean;
};
export function VocabGenreId(id: number) {
    return id as vocabGenre["genreId"];
}
export type vocabMergedGenre = {
    genreId: number & { _mergedVocabGenreId: never };
    genreName: string;
    order: number;
    youtube: string;
    released: boolean;
};
export function VocabMergedGenreId(id: number) {
    return id as vocabMergedGenre["genreId"];
}
export type sound = {
    audio: HTMLAudioElement;
    playable: boolean;
};
