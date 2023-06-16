import {HungarianAlgWithloss} from "./hungarian.alg.withloss";
import {X} from './test_data/expert';
import {Y} from './test_data/member';
import {MetricCalculator} from "./metrics/metric.calculator";

// console.log(1123);
const result = MetricCalculator.getMetricValues(X, Y, false, true);

console.log(result);