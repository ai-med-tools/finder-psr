System.register(["./hungarian.alg.withloss", "./test.data"], function (exports_1, context_1) {
    "use strict";
    var hungarian_alg_withloss_1, test_data_1, algStarter, algStarterResult;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (hungarian_alg_withloss_1_1) {
                hungarian_alg_withloss_1 = hungarian_alg_withloss_1_1;
            },
            function (test_data_1_1) {
                test_data_1 = test_data_1_1;
            }
        ],
        execute: function () {
            algStarter = new hungarian_alg_withloss_1.HungarianAlgWithloss(test_data_1.x1, test_data_1.y1, true, true);
            algStarterResult = algStarter.complexSearchDetailSelections();
            console.log(algStarterResult.getMatchedDetailSelections());
        }
    };
});
//# sourceMappingURL=entry.js.map