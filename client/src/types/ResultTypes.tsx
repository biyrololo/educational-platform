type ResultType = {
    test_result_correct: number;
    user_name: string;
    user_id: number;
    test_id: number;
    test_name: string;
    id: number;
    test_result_all: number;
    incorrect_asks_ids: number[];
    user_answers: string[];
    date: string;
}

type ResultAsk = {
    image?: string;
    text: string;
    correct_answer: string;
}

export type {
    ResultType,
    ResultAsk
}