import {M1} from "./m1";
import {M2} from "./m2";
import {M3} from "./m3";
import {M4} from "./m4";
import {x1, y1} from "../test.data";

export type FinderMetrics = {
    m1: number;
    m2: number;
    m3: number;
    m4: number;
}
export class MetricCalculator {
    public static neededKeys = ['xPath', 'start', 'end', 'decorCode', 'code', 'name'];
    public static getMetricValues(expertMarkup: any[], memberMarkup: any[], useMock: boolean = false, debug: boolean = false) {
        if (useMock) {
            expertMarkup = y1;
            memberMarkup = x1;
        }

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
            console.log(keys);
            if (!this.neededKeys.every((item) => {
                console.log(item);
                return keys.includes(item)
            })) {
                throw new Error('Объект разметки участника не готов к расчёту');
            }
        });

        const result: FinderMetrics = {
            m1: 0.00000000,
            m2: 0.00000000,
            m3: 0.00000000,
            m4: 0.00000000,
        }

        result.m1 = M1.comparingTwoTokinzedMarkups(expertMarkup, memberMarkup);
        result.m2 = M2.calcAccuracyOfLocalizationOfSymptoms(expertMarkup, memberMarkup);
        result.m3 = M3.calcSymptomIdentificationAccuracy(expertMarkup, memberMarkup);
        result.m4 = M4.calcGeneralCriterion(expertMarkup, memberMarkup);

        return result;
    }
}