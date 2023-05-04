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
}