import filter from 'lodash/filter';
import Tokenizer from '@ai-med-tools/tokenizer';
import * as fs from 'fs';

export type TokenDto = {
  startFromAnamnesis: number;
  text: string;
};
export class M1 {
  public static comparingTwoTokinzedMarkups(
    tokenizedMarkupExpert: any,
    tokenizedMarkupMember: any,
    debugFileName: string | null = null,
  ) {
    // console.log(123);
    // console.log(debugFileName);
    if (debugFileName) {
      // console.log({tokenizedMarkupExpert});
    }

    const preparedExpertsTokenized = Tokenizer.prepareToTokenize(
      tokenizedMarkupExpert,
    );
    const resultExpertsTokenized = Tokenizer.tokenize(
      preparedExpertsTokenized,
    ).flat();
    const preparedMemberTokenized = Tokenizer.prepareToTokenize(
      tokenizedMarkupMember,
    );
    const resultMemberTokenized = Tokenizer.tokenize(
      preparedMemberTokenized,
    ).flat();

    if (debugFileName) {
      fs.writeFileSync(
        `src/debug/${debugFileName}.log`,
        JSON.stringify(resultExpertsTokenized, null, 4),
      );
    }

    const viewedExpert = resultExpertsTokenized.map((value) => {
      return {
        startFromAnamnesis: value.startFromAnamnesis,
        text: value.text,
        viewed: false,
        right: false,
      };
    });
    const viewedMember = resultMemberTokenized.map((value) => {
      return {
        startFromAnamnesis: value.startFromAnamnesis,
        text: value.text,
        viewed: false,
        right: false,
      };
    });

    viewedExpert.map(
      (viewedExpertValue, viewedExpertIndex, viewedExpertArray) => {
        viewedMember.map(
          (viewedMemberValue, viewedMemberIndex, viewedMemberArray) => {
            // console.log(viewedMemberValue)
            if (!viewedMemberValue.viewed) {
              if (
                viewedExpertValue.text == viewedMemberValue.text &&
                viewedExpertValue.startFromAnamnesis ==
                  viewedMemberValue.startFromAnamnesis
              ) {
                viewedMemberArray[viewedMemberIndex].right = true;
                viewedExpertArray[viewedExpertIndex].right = true;
                viewedMemberArray[viewedMemberIndex].viewed = true;
                viewedExpertArray[viewedExpertIndex].viewed = true;
                return;
              }
            }
          },
        );
      },
    );

    const filteredExpertByOverlap = filter(viewedExpert, (item) => {
      return item.right === true;
    });
    const filteredMemberByOverlap = filter(viewedMember, (item) => {
      return item.right === true;
    });

    // console.log(viewedExpert.length);
    // console.log(filteredExpertByOverlap.length);
    /** Проверка на существование фильтеред */
    const accuracy = filteredExpertByOverlap.length / viewedExpert.length;
    const completeness = filteredMemberByOverlap.length / viewedMember.length;

    const aggregationOfAccuracyCompleteness =
      (2 * accuracy * completeness) / (accuracy + completeness);

    // console.log(result);

    return {
      aggregationOfAccuracyCompleteness,
      accuracy,
      completeness,
    };
  }
}

const x = [
  {
    startFromAnamnesis: 2,
    text: 'АД',
  },
  {
    startFromAnamnesis: 2,
    text: 'АД',
  },
  {
    startFromAnamnesis: 6,
    text: '130/90',
  },
];
const y = [
  {
    startFromAnamnesis: 2,
    text: 'АД',
  },
  {
    startFromAnamnesis: 6,
    text: '130/90',
  },
  {
    startFromAnamnesis: 6,
    text: '222222222',
  },
];

// const result = M1.comparingTwoTokinzedMarkups(x, y);
// console.log(JSON.stringify(result, null, 2));
