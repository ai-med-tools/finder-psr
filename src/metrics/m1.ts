import Tokenizer from "@ai-med-tools/tokenizer";
import * as fs from "fs";
import find from 'lodash/find';
import {AccuracyCompletenessSelectionsFinder} from "./metric.calculator";

export type TokenDto = {
    startFromAnamnesis: number;
    text: string;
}
export class M1 {
    public static comparingTwoTokinzedMarkups(tokenizedMarkupExpert: any, tokenizedMarkupMember: any, debugFileName: string| null = null): AccuracyCompletenessSelectionsFinder {
        const preparedExpertsTokenized = Tokenizer.prepareToTokenize(tokenizedMarkupExpert);
        const resultExpertsTokenized = Tokenizer.tokenize(preparedExpertsTokenized).flat();
        const preparedMemberTokenized = Tokenizer.prepareToTokenize(tokenizedMarkupMember);
        const resultMemberTokenized = Tokenizer.tokenize(preparedMemberTokenized).flat();

        if (debugFileName) {
            fs.writeFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(resultExpertsTokenized, null, 4));
        }

        const viewedExpert = resultExpertsTokenized.map((value) => {
            return {startFromAnamnesis: value.startFromAnamnesis, text: value.text, viewed: false, right: false}
        });
        const viewedMember = resultMemberTokenized.map((value) => {
            return {startFromAnamnesis: value.startFromAnamnesis, text: value.text, viewed: false, right: false}
        });

        // @ts-ignore
        const matchedMemberWithExpert = [];
        viewedMember.map((value, index, array) => {
            // @ts-ignore
            const alreadyExistsInTotalResult = find(matchedMemberWithExpert, value);

            const existsInExpertArray = find(viewedExpert, value);
            if (alreadyExistsInTotalResult == undefined && existsInExpertArray) {
                matchedMemberWithExpert.push(existsInExpertArray);
            }
        });

        // @ts-ignore
        const matchedExpertWithMember = [];
        viewedExpert.map((value, index, array) => {
            // @ts-ignore
            const alreadyExistsInTotalResult = find(matchedExpertWithMember, value);

            const existsInMemberArray = find(viewedMember, value);
            if (alreadyExistsInTotalResult == undefined && existsInMemberArray) {
                matchedExpertWithMember.push(existsInMemberArray);
            }
        });

        if (debugFileName) {
            console.log(`Кол-во совпавших у X(эксп) в Y(уч) - ${matchedExpertWithMember.length}`)
            console.log(`Общая длина Y (уч) - ${viewedMember.length}`)

            console.log(`Кол-во совпавших у Y(уч) в X(эксп) - ${matchedMemberWithExpert.length}`)
            console.log(`Общая длина X (эксп) - ${viewedExpert.length}`)
        }


        const accuracy = matchedMemberWithExpert.length / viewedExpert.length;
        const completeness = matchedExpertWithMember.length / viewedMember.length;


        const aggregationOfAccuracyCompleteness = (2 * accuracy * completeness) / (accuracy + completeness);

        return {
            aggregationOfAccuracyCompleteness,
            accuracy,
            completeness,
        };
    }
}