System.register([], function (exports_1, context_1) {
    "use strict";
    var __read = (this && this.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var HungarianAlgWithloss;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            HungarianAlgWithloss = /** @class */ (function () {
                function HungarianAlgWithloss(x, y, workWithSelecton, log) {
                    if (workWithSelecton === void 0) { workWithSelecton = false; }
                    if (log === void 0) { log = false; }
                    var _this = this;
                    this.determFactor = 'type';
                    this.metricFactor = 'type';
                    this.jaccardMatrix = [];
                    this.lossMatrix = [];
                    this.matchedFragmentsPercent = 0;
                    this.matchedFragmentsCount = 0;
                    this.matchedDetailSelections = [];
                    this.log = false;
                    this.log = log;
                    this.workWithSelection = workWithSelecton;
                    if (this.workWithSelection) {
                        //@ts-ignore
                        this.lotsOfX = this.transformSelectionsToMathFormat(x);
                        //@ts-ignore
                        this.lotsOfY = this.transformSelectionsToMathFormat(y);
                    }
                    else {
                        console.log(123123123);
                        //@ts-ignore
                        this.lotsOfX = x;
                        //@ts-ignore
                        this.lotsOfY = y;
                    }
                    console.log(111111111111111);
                    console.log(this.lotsOfX);
                    this.lotsOfX.forEach(function (x) { return _this.jaccardMatrix.push([]); });
                    this.lotsOfX.forEach(function (x) { return _this.lossMatrix.push([]); });
                }
                HungarianAlgWithloss.prototype.complexSearchMatchedFragments = function () {
                    this.calcJaccardMatrix();
                    this.calcLossMatrix();
                    this.goPsrGo();
                    return this.matchedFragmentsPercent;
                };
                HungarianAlgWithloss.prototype.complexSearchMatchedCount = function () {
                    this.calcJaccardMatrix();
                    this.calcLossMatrix();
                    this.goPsrGo();
                    return this.matchedFragmentsCount;
                };
                HungarianAlgWithloss.prototype.complexSearchDetailSelections = function () {
                    this.calcJaccardMatrix();
                    this.calcLossMatrix();
                    this.goPsrGo();
                    return this;
                };
                HungarianAlgWithloss.prototype.calcJaccardMatrix = function () {
                    var _this = this;
                    var _loop_1 = function (i) {
                        this_1.lotsOfY.forEach(function (item, key) {
                            var temp = _this.calcCrossNDivergence(_this.lotsOfX[i].start, _this.lotsOfX[i].end, item.start, item.end);
                            _this.jaccardMatrix[i][key] = +(1 -
                                temp.cross.length / temp.divergence.length).toFixed(1);
                        });
                    };
                    var this_1 = this;
                    for (var i in this.lotsOfX) {
                        _loop_1(i);
                    }
                    if (this.log) {
                        console.log(this.jaccardMatrix);
                    }
                };
                HungarianAlgWithloss.prototype.getJaccardMatrix = function () {
                    return this.jaccardMatrix;
                };
                HungarianAlgWithloss.prototype.calcLossMatrix = function () {
                    for (var i in this.jaccardMatrix) {
                        for (var j in this.jaccardMatrix[i]) {
                            // const Tk = this.calcTkCoeff(
                            //     this.lotsOfX[i].determFactor,
                            //     this.lotsOfY[j].determFactor
                            // );
                            // console.log(Tk);
                            this.lossMatrix[i][j] =
                                this.jaccardMatrix[i][j] +
                                    (this.jaccardMatrix[i][j] === 1 ? 1 : 0) +
                                    (this.lotsOfX[i].start !== this.lotsOfY[j].start ? 1 : 0);
                            // (this.lotsOfX[i].determFactor !== this.lotsOfY[j].determFactor ? 1 : 0) +
                            // Tk;
                        }
                    }
                    if (this.log) {
                        console.log(this.lossMatrix);
                    }
                };
                HungarianAlgWithloss.prototype.getLossMatrix = function () {
                    return this.lossMatrix;
                };
                HungarianAlgWithloss.prototype.calcCrossNDivergence = function (xBegin, xEnd, yBegin, yEnd) {
                    var nX = this.implodeNumRange(xBegin, xEnd);
                    var nY = this.implodeNumRange(yBegin, yEnd);
                    return {
                        cross: nX.filter(function (x) { return nY.includes(x); }),
                        divergence: __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(nX), false), __read(nY), false))), false),
                    };
                };
                HungarianAlgWithloss.prototype.implodeNumRange = function (min, max) {
                    var arrCoords = [];
                    for (var i = min; i <= max; i++) {
                        arrCoords.push(i);
                    }
                    return arrCoords;
                };
                HungarianAlgWithloss.prototype.goPsrGo = function () {
                    var arr = [];
                    for (var g = 0; g < this.jaccardMatrix.length; g++) {
                        arr[g] = [];
                        for (var v = 0; v < this.jaccardMatrix[0].length; v++) {
                            //@ts-ignore
                            arr[g][v] = 0;
                        }
                    }
                    var M = arr;
                    var connComponents = arr;
                    var connLine = [];
                    var mLineTruth = [];
                    var mLineTruth2 = [];
                    var Q = 0;
                    var sumToQ = 0;
                    var x0 = 0;
                    var y0 = 0;
                    var xPrep = [];
                    var yPrep = [];
                    var xEmp = 0;
                    var yEmp = 0;
                    var index = 0;
                    //@ts-ignore
                    var xblock = [];
                    //@ts-ignore
                    var yblock = [];
                    //перенести из 𝐺 в 𝐷 все рёбра (𝑖, 𝑘), для которых 𝐿[𝑖, 𝑘] = 0;
                    for (var z in this.lossMatrix) {
                        for (var x in this.lossMatrix[z]) {
                            if (this.lossMatrix[z][x] === 0) {
                                //@ts-ignore
                                if (!xblock.includes(z) && !yblock.includes(x)) {
                                    mLineTruth.push({ row: z, col: x });
                                    M[z][x] = this.lossMatrix[z][x];
                                    xblock.push(z);
                                    yblock.push(x);
                                }
                            }
                        }
                    }
                    if (this.log) {
                        console.log('mline для L = 0');
                        console.log(mLineTruth);
                    }
                    //Определяем компоненты связности
                    for (var z in this.jaccardMatrix) {
                        for (var x in this.jaccardMatrix[z]) {
                            if (this.jaccardMatrix[z][x] !== 1 && !xblock.includes(z) && !yblock.includes(x)) {
                                connLine.push({ row: z, col: x });
                                connComponents[z][x] = this.jaccardMatrix[z][x];
                            }
                        }
                    }
                    var xPrepConnLine = [];
                    var yPrepConnLine = [];
                    var x0PrepConnLine = 0;
                    var y0PrepConnLine = 0;
                    /** Гипотеза - @todo в любом случае вынести в ф-цию */
                    for (var y in connLine) {
                        xPrepConnLine.push(connLine[y].row);
                        yPrepConnLine.push(connLine[y].col);
                    }
                    x0PrepConnLine = new Set(xPrepConnLine).size;
                    y0PrepConnLine = new Set(yPrepConnLine).size;
                    var Qm = x0PrepConnLine + y0PrepConnLine;
                    if (this.log) {
                        console.log('Первое значение Qmin');
                        console.log(Qm);
                    }
                    if (this.log) {
                        // console.log(x01 + 'x01');
                        console.log('connLine');
                        console.log(connLine);
                        console.log('Qm исходя из 𝐿[𝑖, 𝑘]');
                        console.log(Qm);
                    }
                    var connLineFormatted = this.distributeConnComponents(connLine);
                    if (this.log) {
                        console.log('connLineFormatted');
                        console.log(connLineFormatted);
                    }
                    /** Перебираем парасочетания
                     * mLineTruth - это D после переноса туда парасочетаний, для которых Lik = 0
                     * */
                    for (var compSvyaz in connLineFormatted) {
                        /** Первый вариант - смёжных ребер нет */
                        if (connLineFormatted[compSvyaz].length === 1) {
                            /* connLineFormatted[compSvyaz][0] - первый и единственных элемент */
                            index = mLineTruth.push(connLineFormatted[compSvyaz][0]);
                            // Получаем Q на текущей итерации
                            sumToQ = 0;
                            xPrep = [];
                            yPrep = [];
                            for (var y in mLineTruth) {
                                xPrep.push(mLineTruth[y].row);
                                yPrep.push(mLineTruth[y].col);
                            }
                            x0 = new Set(xPrep).size;
                            y0 = new Set(yPrep).size;
                            xEmp = x0PrepConnLine - x0;
                            yEmp = y0PrepConnLine - y0;
                            for (var k in mLineTruth) {
                                sumToQ += this.lossMatrix[mLineTruth[k].row][mLineTruth[k].col];
                            }
                            Q = sumToQ + xEmp + yEmp;
                            if (Q < Qm) {
                                Qm = Q;
                            }
                            else {
                                var indexOf = mLineTruth.indexOf(connLineFormatted[compSvyaz][0]);
                                delete mLineTruth[indexOf];
                            }
                        }
                        /** Второй вариант - смёжные ребра есть */
                        /** выстроить числа(ключи) в ряд, с пустым значением q (общее q после переноса ребра), потом проверить его по итогу и оставить q самое лучшее */
                        if (connLineFormatted[compSvyaz].length > 1) {
                            var helpQsArray = [];
                            for (var i = 0; i <= connLineFormatted[compSvyaz].length - 1; i++) {
                                helpQsArray.push(0);
                            }
                            for (var candidateKey in connLineFormatted[compSvyaz]) {
                                index = mLineTruth.push(connLineFormatted[compSvyaz][candidateKey]);
                                sumToQ = 0;
                                xPrep = [];
                                yPrep = [];
                                for (var y in mLineTruth) {
                                    xPrep.push(mLineTruth[y].row);
                                    yPrep.push(mLineTruth[y].col);
                                }
                                x0 = new Set(xPrep).size;
                                y0 = new Set(yPrep).size;
                                xEmp = x0PrepConnLine - x0;
                                yEmp = y0PrepConnLine - y0;
                                for (var k in mLineTruth) {
                                    sumToQ += this.lossMatrix[mLineTruth[k].row][mLineTruth[k].col];
                                }
                                // @ts-ignore
                                helpQsArray[candidateKey] = sumToQ + xEmp + yEmp;
                                var indexOf = mLineTruth.indexOf(connLineFormatted[compSvyaz][candidateKey]);
                                delete mLineTruth[indexOf];
                            }
                            var minQs = Math.min.apply(Math, __spreadArray([], __read(helpQsArray), false));
                            var indexOfMinQ = helpQsArray.indexOf(minQs);
                            if (minQs < Qm) {
                                Qm = minQs;
                                mLineTruth.push(connLineFormatted[compSvyaz][indexOfMinQ]);
                            }
                        }
                    }
                    mLineTruth = mLineTruth.filter(function (n) { return n; });
                    if (this.log) {
                        console.log('mLineTruth TOTAL');
                        console.log(mLineTruth);
                    }
                    var countUniq = mLineTruth.length;
                    for (var secLine in mLineTruth) {
                        var zxc = [];
                        zxc.push(this.lotsOfY[mLineTruth[secLine]['col']]);
                        zxc.push(this.lotsOfX[mLineTruth[secLine]['row']]);
                        this.matchedDetailSelections.push(zxc);
                    }
                    this.matchedFragmentsCount = countUniq;
                    if (this.lossMatrix[0] !== undefined) {
                        this.matchedFragmentsPercent = countUniq / this.lossMatrix[0].length;
                    }
                    else {
                        this.matchedFragmentsPercent = 0;
                    }
                };
                HungarianAlgWithloss.prototype.getMatchedFragmentsPercent = function () {
                    return this.matchedFragmentsPercent;
                };
                HungarianAlgWithloss.prototype.getMatchedFragmentsCount = function () {
                    return this.matchedFragmentsCount;
                };
                HungarianAlgWithloss.prototype.getMatchedDetailSelections = function () {
                    return this.matchedDetailSelections;
                };
                HungarianAlgWithloss.prototype.transformSelectionsToMathFormat = function (selections) {
                    var result = [];
                    for (var i in selections) {
                        result.push({
                            start: selections[i].start,
                            end: selections[i].end,
                            // determFactor: selections[i][this.determFactor].toLocaleLowerCase(),
                            // metricFactor: selections[i][this.metricFactor].toLocaleLowerCase(),
                        });
                        // if (
                        //     selections[i][this.determFactor] !== undefined &&
                        //     selections[i][this.metricFactor] !== undefined
                        // ) {
                        //     result.push({
                        //         start: selections[i].startSelection,
                        //         end: selections[i].endSelection,
                        //         // determFactor: selections[i][this.determFactor].toLocaleLowerCase(),
                        //         // metricFactor: selections[i][this.metricFactor].toLocaleLowerCase(),
                        //     });
                        // }
                    }
                    return result;
                };
                // calcTkCoeff(typeOne: string, typeTwo: string): number {
                //     const allLogicBlocks =
                //         SemanticMainBlocks.includes(typeOne) && SemanticMainBlocks.includes(typeTwo);
                //     const allErrorBlocks =
                //         !SemanticMainBlocks.includes(typeOne) && !SemanticMainBlocks.includes(typeTwo);
                //
                //     if (allLogicBlocks || allErrorBlocks) {
                //         return 0;
                //     }
                //
                //     return 4;
                // }
                /**
                 * Распределяем плоский массив ребёр в компоненты связности, где смежные ребра кладутся
                 * в массив вида - [[{x1,y1}], [{x2,y2}, {x2,y3}]]
                 */
                HungarianAlgWithloss.prototype.distributeConnComponents = function (connLine) {
                    var connLineFormatted = [];
                    var connLineFormattedTemp = [];
                    var connLineTemp = connLine;
                    for (var o in connLineTemp) {
                        // @ts-ignore
                        connLineFormatted[o] = [];
                        if (!connLineFormattedTemp.includes(connLineTemp[o])) {
                            connLineFormatted[o].push(connLineTemp[o]);
                        }
                        for (var g in connLineTemp) {
                            if (connLineTemp[g].col == connLineTemp[o].col &&
                                !(connLineTemp[g].row == connLineTemp[o].row &&
                                    connLineTemp[g].col == connLineTemp[o].col)) {
                                if (!connLineFormattedTemp.includes(connLineTemp[o])) {
                                    connLineFormatted[o].push(connLineTemp[g]);
                                    connLineFormattedTemp.push(connLineTemp[g]);
                                }
                            }
                        }
                    }
                    connLineFormatted = connLineFormatted.filter(function (el) {
                        return el.length !== 0;
                    });
                    /** Сортируем @todo поменять на убывание */
                    connLineFormatted.sort(function (a, b) { return a.length - b.length; });
                    return connLineFormatted;
                };
                return HungarianAlgWithloss;
            }());
            exports_1("HungarianAlgWithloss", HungarianAlgWithloss);
        }
    };
});
//# sourceMappingURL=hungarian.alg.withloss.js.map