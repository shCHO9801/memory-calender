export type CandidateType =
    | "EVENT"
    | "TODO";

export type ClassificationItem = {
    type: CandidateType;
    content: string;
    startAt: string | null;
    endAt: string | null;
    dueAt: string | null;
    location: string | null;
    needsConfirmation: boolean;
};

export type ClassificationResponse = {
    noteId: number;
    items: ClassificationItem[];
};

export type ConfirmClassificationItem = {
    type: CandidateType;
    content: string;
    startAt: string | null;
    endAt: string | null;
    dueAt: string | null;
    location: string | null;
};

export type ConfirmClassificationRequest = {
    items: ConfirmClassificationItem[];
};