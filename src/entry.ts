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

    ],
]

// console.log(1123);
const result = MetricCalculator.getMetricValues(X, Y, false, true, mockSocMedicaMap);

console.log(result);