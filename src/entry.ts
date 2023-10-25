import {X} from './test_data/expert';
import {Y} from './test_data/member';
import {MetricCalculator} from "./metrics/metric.calculator";

const mockSocMedicaMap = [
    /* Экспертные x */
    [
        {
            hash: "164812797522",
            value: [1,2,3,4,5]
        },
        {
            hash: "3313500083123123",
            value: [1,2,5,3,4]
        },
        {
            hash: "3313500083333233",
            value: [1,2,5,3,4]
        },


    ],
    /* Кандидатные Y */
    [
        {
            hash: "16481279753",
            value: [1,2,3,4,5]
        },
        {
            hash: "331350008344",
            value: [1,2,5,3,4]
        },
        {
            hash: "33135000833333",
            value: [1,2,5,3,4]
        },
    ],
]

// console.log(1123);
const result = MetricCalculator.getMetricValues(X, Y, false, true, mockSocMedicaMap);

console.log(result);