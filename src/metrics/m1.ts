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
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `Токенизированная разметка эксперта \n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(resultExpertsTokenized, null, 4));
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nТокенизированная разметка участника\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(resultMemberTokenized, null, 4));
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
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nКол-во совпавших у X(эксп) в Y(уч) - ${matchedExpertWithMember.length}\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nОбщая длина Y (уч) - ${viewedMember.length}\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nКол-во совпавших у Y(уч) в X(эксп) - ${matchedMemberWithExpert.length}\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nОбщая длина X (эксп) - ${viewedExpert.length}\n\n`);
        }

        const accuracy = viewedExpert.length > 0 ? matchedMemberWithExpert.length / viewedExpert.length : 0;

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nТочность - ${accuracy}\n\n`);
        }

        const completeness = viewedMember.length > 0 ? matchedExpertWithMember.length / viewedMember.length : 0;
        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nПолнота - ${completeness}\n\n`);
        }

        const aggregationOfAccuracyCompleteness = (accuracy + completeness) > 0 ? (2 * accuracy * completeness) / (accuracy + completeness) : 0;

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nМ1 - ${aggregationOfAccuracyCompleteness}\n\n`);
        }

        return {
            aggregationOfAccuracyCompleteness,
            accuracy,
            completeness,
        };
    }
}