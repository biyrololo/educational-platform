type UserResultTypeResponse = {
    test_result_correct: number;
    user_name: string;
    user_grade: string;
    user_id: number;
    test_id: number;
    id: number;
    test_name: string;
    test_result_all: number;
    incorrect_asks_ids: number[];
    date: string
}

type UserResultType = {
    test_result_correct: number;
    user_name: string;
    user_grade: string;
    user_id: number;
    test_id: number;
    id: number;
    test_name: string;
    test_result_all: number;
    incorrect_asks: number;
    date: string
}

export type {
    UserResultType,
    UserResultTypeResponse
}