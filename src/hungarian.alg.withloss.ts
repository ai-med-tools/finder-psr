// eslint-disable-file guard-for-in
import { LotsOf, Selections } from './types';

export class HungarianAlgWithloss {
  workWithSelection: boolean;

  determFactor: 'type' | 'correction' | 'explanation' | 'subtype' = 'type';

  metricFactor: 'type' | 'correction' | 'explanation' | 'subtype' = 'type';

  lotsOfX: LotsOf;

  lotsOfY: LotsOf;

  jaccardMatrix: Array<number[]> = [];

  lossMatrix: Array<number[]> = [];

  matchedFragmentsPercent: number = 0;

  matchedFragmentsCount: number = 0;

  matchedDetailSelections: any = [];

  log: boolean = false;

  constructor(
    x: LotsOf | Selections,
    y: LotsOf | Selections,
    workWithSelecton: boolean = false,
    log: boolean = false,
  ) {
    this.log = log;
    this.workWithSelection = workWithSelecton;
    if (this.workWithSelection) {
      // @ts-ignore
      this.lotsOfX = this.transformSelectionsToMathFormat(x);
      // @ts-ignore
      this.lotsOfY = this.transformSelectionsToMathFormat(y);
    } else {
      console.log(123123123);
      // @ts-ignore
      this.lotsOfX = x;
      // @ts-ignore
      this.lotsOfY = y;
    }
    // console.log(2222222222222)
    // console.log(111111111111111)
    // console.log(this.lotsOfX)
    this.lotsOfX.forEach((x) => this.jaccardMatrix.push([]));
    this.lotsOfX.forEach((x) => this.lossMatrix.push([]));
  }

  complexSearchMatchedFragments(): number {
    this.calcJaccardMatrix();
    this.calcLossMatrix();

    this.goPsrGo();
    return this.matchedFragmentsPercent;
  }

  complexSearchMatchedCount(): number {
    this.calcJaccardMatrix();
    this.calcLossMatrix();

    this.goPsrGo();
    return this.matchedFragmentsCount;
  }

  complexSearchDetailSelections(): any {
    this.calcJaccardMatrix();
    this.calcLossMatrix();

    this.goPsrGo();
    return this;
  }

  calcJaccardMatrix() {

    for (const i in this.lotsOfX) {
      this.lotsOfY.forEach((item, key) => {
        const temp = this.calcCrossNDivergence(
          this.lotsOfX[i].start,
          this.lotsOfX[i].end,
          item.start,
          item.end,
        );
        this.jaccardMatrix[i][key] = +(
          1 -
          temp.cross.length / temp.divergence.length
        ).toFixed(2);
      });
    }

    if (this.log) {
      // console.log('jaccardMatrix');
      // console.log(this.jaccardMatrix);
    }
  }

  getJaccardMatrix() {
    return this.jaccardMatrix;
  }

  calcLossMatrix() {
    for (const i in this.jaccardMatrix) {
      for (const j in this.jaccardMatrix[i]) {
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
      // console.log(this.lossMatrix);
    }
  }

  getLossMatrix() {
    return this.lossMatrix;
  }

  calcCrossNDivergence(
    xBegin: number,
    xEnd: number,
    yBegin: number,
    yEnd: number,
  ) {
    const nX = this.implodeNumRange(xBegin, xEnd);
    const nY = this.implodeNumRange(yBegin, yEnd);
    return {
      cross: nX.filter((x) => nY.includes(x)),
      divergence: [...new Set<number>([...nX, ...nY])],
    };
  }

  implodeNumRange(min: number, max: number) {
    const arrCoords = [];
    for (let i = min; i <= max; i++) {
      arrCoords.push(i);
    }

    return arrCoords;
  }

  goPsrGo() {
    const arr: Array<number[]> = [];
    for (let g = 0; g < this.jaccardMatrix.length; g++) {
      arr[g] = [];
      for (let v = 0; v < this.jaccardMatrix[0].length; v++) {
        // @ts-ignore
        arr[g][v] = 0;
      }
    }

    const M = arr;

    const connComponents = arr;

    const connLine = [];
    let mLineTruth: any = [];
    const mLineTruth2: any = [];

    let Q = 0;
    let sumToQ = 0;

    let x0 = 0;
    let y0 = 0;

    let xPrep = [];
    let yPrep = [];

    let xEmp = 0;
    let yEmp = 0;
    let index = 0;

    // @ts-ignore
    const xblock = [];
    // @ts-ignore
    const yblock = [];

    // перенести из 𝐺 в 𝐷 все рёбра (𝑖, 𝑘), для которых 𝐿[𝑖, 𝑘] = 0;
    for (const z in this.lossMatrix) {
      for (const x in this.lossMatrix[z]) {
        if (this.lossMatrix[z][x] === 0) {
          // @ts-ignore
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
      // console.log('mline для L = 0');
      // console.log(mLineTruth);
    }

    // Определяем компоненты связности
    for (const z in this.jaccardMatrix) {
      for (const x in this.jaccardMatrix[z]) {
        if (
          this.jaccardMatrix[z][x] !== 1 &&
          !xblock.includes(z) &&
          !yblock.includes(x)
        ) {
          connLine.push({ row: z, col: x });
          connComponents[z][x] = this.jaccardMatrix[z][x];
        }
      }
    }

    const xPrepConnLine = [];
    const yPrepConnLine = [];

    let x0PrepConnLine = 0;
    let y0PrepConnLine = 0;
    /** Гипотеза - @todo в любом случае вынести в ф-цию */
    for (const y in connLine) {
      xPrepConnLine.push(connLine[y].row);
      yPrepConnLine.push(connLine[y].col);
    }
    x0PrepConnLine = new Set(xPrepConnLine).size;
    y0PrepConnLine = new Set(yPrepConnLine).size;

    let Qm = x0PrepConnLine + y0PrepConnLine;
    if (this.log) {
      // console.log('Первое значение Qmin');
      // console.log(Qm);
    }

    if (this.log) {
      // console.log(x01 + 'x01');
      // console.log('connLine');
      // console.log(connLine);
      // console.log('Qm исходя из 𝐿[𝑖, 𝑘]');
      // console.log(Qm);
    }

    const connLineFormatted = this.distributeConnComponents(connLine);

    if (this.log) {
      console.log('connLineFormatted');
      console.log(connLineFormatted);
    }

    /** Перебираем парасочетания
     * mLineTruth - это D после переноса туда парасочетаний, для которых Lik = 0
     * */
    for (const compSvyaz in connLineFormatted) {
      /** Первый вариант - смёжных ребер нет */
      if (connLineFormatted[compSvyaz].length === 1) {
        /* connLineFormatted[compSvyaz][0] - первый и единственных элемент */
        index = mLineTruth.push(connLineFormatted[compSvyaz][0]);
        // Получаем Q на текущей итерации
        sumToQ = 0;
        xPrep = [];
        yPrep = [];
        for (const y in mLineTruth) {
          xPrep.push(mLineTruth[y].row);
          yPrep.push(mLineTruth[y].col);
        }
        x0 = new Set(xPrep).size;
        y0 = new Set(yPrep).size;

        xEmp = x0PrepConnLine - x0;
        yEmp = y0PrepConnLine - y0;

        for (const k in mLineTruth) {
          sumToQ += this.lossMatrix[mLineTruth[k].row][mLineTruth[k].col];
        }
        Q = sumToQ + xEmp + yEmp;
        if (Q < Qm) {
          Qm = Q;
          // console.log({Q: Q})
        } else {
          const indexOf = mLineTruth.indexOf(connLineFormatted[compSvyaz][0]);
          delete mLineTruth[indexOf];
        }
      }

      /** Второй вариант - смёжные ребра есть */
      /** выстроить числа(ключи) в ряд, с пустым значением q (общее q после переноса ребра), потом проверить его по итогу и оставить q самое лучшее */
      if (connLineFormatted[compSvyaz].length > 1) {
        const helpQsArray = [];
        for (let i = 0; i <= connLineFormatted[compSvyaz].length - 1; i++) {
          helpQsArray.push(0);
        }

        for (const candidateKey in connLineFormatted[compSvyaz]) {
          index = mLineTruth.push(connLineFormatted[compSvyaz][candidateKey]);
          sumToQ = 0;
          xPrep = [];
          yPrep = [];
          for (const y in mLineTruth) {
            xPrep.push(mLineTruth[y].row);
            yPrep.push(mLineTruth[y].col);
          }
          x0 = new Set(xPrep).size;
          y0 = new Set(yPrep).size;

          xEmp = x0PrepConnLine - x0;
          yEmp = y0PrepConnLine - y0;
          for (const k in mLineTruth) {
            sumToQ += this.lossMatrix[mLineTruth[k].row][mLineTruth[k].col];
          }
          // @ts-ignore
          helpQsArray[candidateKey] = sumToQ + xEmp + yEmp;

          const indexOf = mLineTruth.indexOf(
            connLineFormatted[compSvyaz][candidateKey],
          );
          delete mLineTruth[indexOf];
        }
        const minQs = Math.min(...helpQsArray);
        const indexOfMinQ = helpQsArray.indexOf(minQs);
        if (minQs < Qm) {
          Qm = minQs;
          mLineTruth.push(connLineFormatted[compSvyaz][indexOfMinQ]);
        }
      }
    }
    mLineTruth = mLineTruth.filter((n: any) => n);
    if (this.log) {
      // console.log('mLineTruth TOTAL');
      // console.log(mLineTruth);
    }

    const countUniq = mLineTruth.length;

    for (const secLine in mLineTruth) {
      const zxc = [];
      zxc.push(this.lotsOfY[mLineTruth[secLine].col]);
      zxc.push(this.lotsOfX[mLineTruth[secLine].row]);

      this.matchedDetailSelections.push(zxc);
    }

    this.matchedFragmentsCount = countUniq;
    if (this.lossMatrix[0] !== undefined) {
      this.matchedFragmentsPercent = countUniq / this.lossMatrix[0].length;
    } else {
      this.matchedFragmentsPercent = 0;
    }
  }

  getMatchedFragmentsPercent() {
    return this.matchedFragmentsPercent;
  }

  getMatchedFragmentsCount() {
    return this.matchedFragmentsCount;
  }

  getMatchedDetailSelections() {
    return this.matchedDetailSelections;
  }

  transformSelectionsToMathFormat(selections: Selections) {
    const result = [];

    for (const i in selections) {
      result.push({
        start: selections[i].start,
        end: selections[i].end,
        name: selections[i].name,
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
  }

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
  distributeConnComponents(connLine: { row: string; col: string }[]) {
    let connLineFormatted: any = [];
    const connLineFormattedTemp: any = [];
    const connLineTemp = connLine;
    for (const o in connLineTemp) {
      // @ts-ignore
      connLineFormatted[o] = [];
      if (!connLineFormattedTemp.includes(connLineTemp[o])) {
        connLineFormatted[o].push(connLineTemp[o]);
      }

      for (const g in connLineTemp) {
        if (
          (connLineTemp[g].col == connLineTemp[o].col ||
            connLineTemp[g].row == connLineTemp[o].row) &&
          !(
            connLineTemp[g].row == connLineTemp[o].row &&
            connLineTemp[g].col == connLineTemp[o].col
          )
        ) {
          if (!connLineFormattedTemp.includes(connLineTemp[o])) {
            connLineFormatted[o].push(connLineTemp[g]);
            connLineFormattedTemp.push(connLineTemp[g]);
          }
        }
      }
    }

    connLineFormatted = connLineFormatted.filter((el: any) => {
      return el.length !== 0;
    });
    /** Сортируем @todo поменять на убывание */
    connLineFormatted.sort((a: [], b: []) => a.length - b.length);

    return connLineFormatted;
  }
}
