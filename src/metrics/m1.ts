import filter from 'lodash/filter';

export type TokenDto = {
    startFromAnamnesis: number;
    text: string;
}
export class M1 {
    public static comparingTwoTokinzedMarkups(tokenizedMarkupExpert: TokenDto[], tokenizedMarkupMember: TokenDto[]) {
        const viewedExpert = tokenizedMarkupExpert.map((value) => {
            return {startFromAnamnesis: value.startFromAnamnesis, text: value.text, viewed: false, right: false}
        });
        const viewedMember = tokenizedMarkupMember.map((value) => {
            return {startFromAnamnesis: value.startFromAnamnesis, text: value.text, viewed: false, right: false}
        });

        viewedExpert.map((viewedExpertValue, viewedExpertIndex, viewedExpertArray) => {
            viewedMember.map((viewedMemberValue, viewedMemberIndex, viewedMemberArray) => {
                // console.log(viewedMemberValue)
                if (!viewedMemberValue.viewed) {
                    if (viewedExpertValue.text == viewedMemberValue.text &&
                        viewedExpertValue.startFromAnamnesis == viewedMemberValue.startFromAnamnesis) {

                        viewedMemberArray[viewedMemberIndex].right = true;
                        viewedExpertArray[viewedExpertIndex].right = true;
                        viewedMemberArray[viewedMemberIndex].viewed = true;
                        viewedExpertArray[viewedExpertIndex].viewed = true;
                        return;
                    }

                }
            });

        });

        const filteredExpertByOverlap = filter(viewedExpert, (item) => {
            return item.right === true;
        });
        const filteredMemberByOverlap = filter(viewedMember, (item) => {
            return item.right === true;
        });

        // console.log(viewedExpert.length);
        // console.log(filteredExpertByOverlap.length);
        /** Проверка на существование фильтеред */
        const accuracy = filteredExpertByOverlap.length / viewedExpert.length;
        const fullness = filteredMemberByOverlap.length / viewedMember.length;

        const result = (2 * accuracy * fullness) / (accuracy + fullness);

        // console.log(result);

        return result;
    }
}

const x =   [
    {
        "startFromAnamnesis": 2,
        "text": "АД"
    },
    {
        "startFromAnamnesis": 2,
        "text": "АД"
    },
    {
        "startFromAnamnesis": 6,
        "text": "130/90"
    }
];
const y =   [
    {
        "startFromAnamnesis": 2,
        "text": "АД"
    },
    {
        "startFromAnamnesis": 6,
        "text": "130/90"
    },
    {
        "startFromAnamnesis": 6,
        "text": "222222222"
    }
];

const result = M1.comparingTwoTokinzedMarkups(x, y);
console.log(JSON.stringify(result, null, 2));