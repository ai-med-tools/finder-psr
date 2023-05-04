import {HungarianAlgWithloss} from "./hungarian.alg.withloss";
import {x1, y1} from "./test.data";
import {MetricCalculator} from "./metrics/metric.calculator";


const result = MetricCalculator.getMetricValues(y1, x1);

console.log(result);