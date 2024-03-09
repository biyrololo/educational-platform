type AskType = {
    image?: string;
    answers: string[];
    id: number;
    text: string;
    test_id: number;
}

type AsksType = AskType[];

type AskWithAns = AskType & {
    ans: string
}

type CheckAnsRType = {
    answers: {
        answer: string;
        ans_id: number;
    }[];
    user_name: string;
    user_id: number;
    test_name: string;
    test_id: number;
    date: string
}

export type {
    AskType,
    AsksType,
    AskWithAns,
    CheckAnsRType
}