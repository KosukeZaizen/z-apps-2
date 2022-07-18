export interface Author {
    authorId: number;
    authorName: string;
    initialGreeting: string;
    selfIntroduction: string;
    isAdmin: boolean;
    imgExtension: string;
}

export type AuthorPanelState = { open: true; title?: string } | { open: false };
export const initialAuthorPanelState =
    window.location.hash === "#KosukeZaizen"
        ? { open: true, title: "Developer" }
        : { open: false };
