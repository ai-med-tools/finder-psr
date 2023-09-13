import {SocMedicaMaps} from "../types";

export class M3 {
    public static neededKeys = ['xPath', 'start', 'end', 'decorCode', 'code', 'name'];
    public static calcSymptomIdentificationAccuracy(expertMarkup: any[], memberMarkup: any[]) {
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

        const lotOfExpertCodes: string[] = [];
        const lotOfMarkupCodes: string[] = [];

        expertMarkup.map((value) => {
           lotOfExpertCodes.push(value.code)
        });
        memberMarkup.map((value) => {
            lotOfMarkupCodes.push(value.code)
        });

        const intersection = lotOfExpertCodes.filter(x => lotOfMarkupCodes.includes(x));

        const result = intersection.length / lotOfExpertCodes.length;

        return result;
    }

    public static externalCalcSymptomIdentificationAccuracy(socMedicaMap: SocMedicaMaps) {
        if (socMedicaMap.length === 0) return 0;
        if (socMedicaMap[0].length === 0) return 0;
        if (socMedicaMap[1].length === 0) return 0;

        const expertLength = socMedicaMap[0].length;
        /* множество совпавших хешей */
        let comparedHashArray: string[] = [];
        /* множество использованных экспертных */
        let alreadyUsedHash: string[] = [];
        for (const pVal of socMedicaMap[1]) {
            if (!comparedHashArray.includes(pVal.hash)) {
                for (const eVal of socMedicaMap[0]) {
                    if (pVal.value === eVal.value && !alreadyUsedHash.includes(eVal.hash)) {
                        alreadyUsedHash.push(eVal.hash)
                        comparedHashArray.push(pVal.hash)
                    }
                }
            }
        }

        const resultM3 = comparedHashArray.length / expertLength;
        return resultM3;
    }
}