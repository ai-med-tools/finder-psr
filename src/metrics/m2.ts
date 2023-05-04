import { HungarianAlgWithloss } from "../hungarian.alg.withloss";
import Tokenizer from "@ai-med-tools/tokenizer";
import {M1} from "./m1";

export class M2 {
    public static neededKeys = ['start', 'end'];
    public static calcAccuracyOfLocalizationOfSymptoms(expertMarkup: any[], memberMarkup: any[]) {
        expertMarkup.map((value) => {
            /** Объект из решения */
            const keys = Object.keys(value);
            if (!this.neededKeys.every(item => keys.includes(item))) {
                throw new Error('Объект экспертной разметки не готов к расчёту');
            }
        });

        memberMarkup.map((value) => {
            /** Объект из решения */
            const keys = Object.keys(value);
            if (!this.neededKeys.every(item => keys.includes(item))) {
                throw new Error('Объект разметки участника не готов к расчёту');
            }
        });

        console.log({ xLength: expertMarkup.length} );
        console.log({ yLength: memberMarkup.length});

        /** Считаем парасочетания */

        const algStarter = new HungarianAlgWithloss(expertMarkup, memberMarkup, true);
        const algStarterResult = algStarter.complexSearchDetailSelections();
        const matchedResult = algStarterResult.getMatchedDetailSelections();

        /** Венгерский алгоритм отдаёт ответы парами - массивы в массиве */
        /** Элемент с индексом 0 - эксперт */
        /** Элемент с индексом 1 - участник */

        const arExpertsFragments = [];
        const arMemberFragments = [];

        for (const resultIter of matchedResult) {
            arExpertsFragments.push(resultIter[0]);
            arMemberFragments.push(resultIter[1]);
        }

        const preparedExpertsTokenized = Tokenizer.prepareToTokenize(arExpertsFragments);
        const resultExpertsTokenized = Tokenizer.tokenize(preparedExpertsTokenized).flat();
        const preparedMemberTokenized = Tokenizer.prepareToTokenize(arMemberFragments);
        const resultMemberTokenized = Tokenizer.tokenize(preparedMemberTokenized).flat();

        /** Формируем G`, находя разницу в длине между длиной G и длиной разметок икс и игрек */

        const xToG = memberMarkup.length - matchedResult.length;
        const yToG = expertMarkup.length - matchedResult.length;

        const delimeter = xToG + yToG + matchedResult.length;


        const m1Result = M1.comparingTwoTokinzedMarkups(resultMemberTokenized, resultExpertsTokenized);
        const result = m1Result / delimeter;

        console.log(result);
        console.log({xToG});
        console.log({yToG});
        console.log(delimeter);

        return result;
    }
}