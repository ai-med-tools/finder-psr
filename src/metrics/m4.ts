import {M2} from "./m2";
import {M3} from "./m3";
import {m4weight} from "../constants";
export class M4 {
    public static neededKeys = ['xPath', 'start', 'end', 'decorCode', 'code', 'name'];
    public static calcGeneralCriterion(expertMarkup: any[], memberMarkup: any[]) {
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

        const m2Result = M2.calcAccuracyOfLocalizationOfSymptoms(expertMarkup, memberMarkup);
        const m3Result = M3.calcSymptomIdentificationAccuracy(expertMarkup, memberMarkup);

        const result = m2Result + (m4weight * m3Result);

        return result;
    }
}