export type EnterGlobalObject = {
    essay: {
        id: string;
        meta: {
            theme: string;
            subject: string;
            [key: string]: string | number;
        };
        text: string;
        markups: {
            id: string;
            isExpert?: boolean;
            third?: boolean;
            criteria: {
                [key: string]: number;
            };
            selections: {
                id: number;
                tag: string;
                type: string;
                group: any;
                comment: string;
                subtype: string;
                correction: string;
                explanation: string;
                startSelection: number;
                endSelection: number;
            }[];
            metrics: {
                [key: string]: number;
            };
        }[];
    };
};

export type Selections = {
    id: number;
    tag: string;
    type: string;
    name: string;
    group: any;
    comment: string;
    subtype: string;
    correction: string;
    explanation: string;
    start: number;
    end: number;
}[];

export type LotsOf = {
    start: number;
    end: number;
    name: string;
}[];
