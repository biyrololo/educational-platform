type TestInfoType = {
    name: string,
    img?: string
}

type TestAskInfoType = {
    text: string;
    image?: string;
    answers: string[];
    correct_answer: string;
}

type TestRType = {
    name: string;
    img_src?: string;
    answers: {
        text: string;
        image?: string;
        answers: string[];
        correct_answer: string;
    }[]
}

export type {
    TestInfoType,
    TestAskInfoType,
    TestRType
}