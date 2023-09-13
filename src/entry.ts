import {X} from './test_data/expert';
import {Y} from './test_data/member';
import {MetricCalculator} from "./metrics/metric.calculator";

const mockSocMedicaMap = [
    /* Экспертные x */
    [
        {
            hash: "1648127975",
            value: 123
        },
        {
            hash: "3313500083",
            value: 124
        },
        {
            hash: "3710576566",
            value: 125
        },
        {
            hash: "4984643355",
            value: 123
        },
    ],
    /* Кандидатные Y */
    [
        {
            hash: "8189773973",
            value: 123
        },
        {
            hash: "8189773973",
            value: 123
        },
        {
            hash: "1764206832",
            value: 124
        },
        {
            hash: "2414938698",
            value: 125
        },
        {
            hash: "1784741587",
            value: 147
        },
    ],
]

// console.log(1123);
const result = MetricCalculator.getMetricValues(X, Y, false, true, mockSocMedicaMap);

console.log(result);