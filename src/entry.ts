import {HungarianAlgWithloss} from "./hungarian.alg.withloss";
import {x1, y1} from "./test.data";
import {MetricCalculator} from "./metrics/metric.calculator";

// console.log(1123);
const result = MetricCalculator.getMetricValues(y1, x1, false, true);

console.log(result);