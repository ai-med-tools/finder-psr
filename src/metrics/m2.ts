import { HungarianAlgWithloss } from "../hungarian.alg.withloss";
import Tokenizer from "@ai-med-tools/tokenizer";
import {M1} from "./m1";
import fs from "fs";

export class M2 {
    public static neededKeys = ['start', 'end'];
    public static calcAccuracyOfLocalizationOfSymptoms(expertMarkup: any[], memberMarkup: any[], debugFileName: string| null = null) {
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
        /** Считаем парасочетания */
        const algStarter = new HungarianAlgWithloss(expertMarkup, memberMarkup, true);

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nРезультат венгерского алгоритма с матрицами\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(algStarter, null, 4));
        }

        const algStarterResult = algStarter.complexSearchDetailSelections();

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nРезультат поиска парасочетаний\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(algStarterResult, null, 4));
        }

        // console.log(JSON.stringify(algStarterResult, null, 4));


        const matchedResult = algStarterResult.getMatchedDetailSelections();

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nСовпавшие парасочетания\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(matchedResult, null, 4));
        }

        // console.log(JSON.stringify(matchedResult, null, 4));

        /** Венгерский алгоритм отдаёт ответы парами - массивы в массиве */
        /** Элемент с индексом 0 - эксперт */
        /** Элемент с индексом 1 - участник */

        const arExpertsFragments = [];
        const arMemberFragments = [];

        let sumM1 = 0;
        for (const resultIter of matchedResult) {
            // resultIter[0] - эксперт
            // resultIter[1] - участник
            const m1Result = M1.comparingTwoTokinzedMarkups([resultIter[1]], [resultIter[0]], debugFileName);
            sumM1 += m1Result.aggregationOfAccuracyCompleteness;

            arExpertsFragments.push(resultIter[0]);
            arMemberFragments.push(resultIter[1]);
        }
        /** Формируем G`, находя разницу в длине между длиной G и длиной разметок икс и игрек */
        const xToG = memberMarkup.length - matchedResult.length;
        const yToG = expertMarkup.length - matchedResult.length;

        const delimeter = xToG + yToG + matchedResult.length;

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nG штрих\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(delimeter, null, 4));
        }

        const result = delimeter > 0 ? sumM1 / delimeter : 0;

        if (debugFileName) {
            fs.appendFileSync(`src/debug/${debugFileName}.log`, `\n\nM2\n\n`);
            fs.appendFileSync(`src/debug/${debugFileName}.log`, JSON.stringify(result, null, 4));
        }

        return result;
    }
}