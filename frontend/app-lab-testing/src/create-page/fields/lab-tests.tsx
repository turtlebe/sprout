import { makeStyles } from '@material-ui/styles';
import { cloneDeep } from 'lodash';
import React from 'react';

import { TestChip } from '../test-chip';
import { getTests } from '../utils/get-tests';

interface Props {
  className: string;
  fieldName: string;
  labTypeData: LT.LabTestType[];
  labTestKind: string;
  labTestProvider: string;
  labSampleType: string;
  tests: LT.Test[];
  setFieldValue: LT.SetFieldValueType;
  disabled: boolean;
}

const useStyles = makeStyles({
  testsWrapper: {
    alignSelf: 'center',
    flexWrap: 'wrap',
    display: 'inline-flex',
  },
});
export const LabTests: React.FC<Props> = React.memo(
  ({ labTypeData, labTestKind, labTestProvider, labSampleType, ...props }) => {
    const classes = useStyles({});

    const prevLabTestProvider = React.useRef<string>(labTestProvider);
    const prevLabTestKind = React.useRef<string>(labTestKind);
    const prevLabSampleType = React.useRef<string>(labSampleType);

    let tests = props.tests;
    // lab test provider, lab test kind or sample type changes then create new set of tests.
    if (
      prevLabTestProvider.current !== labTestProvider ||
      prevLabTestKind.current !== labTestKind ||
      prevLabSampleType.current !== labSampleType
    ) {
      tests = getTests({ labTypeData, labTestKind, labSampleType, labTestProvider });
      prevLabTestProvider.current = labTestProvider;
      prevLabTestKind.current = labTestKind;
      prevLabSampleType.current = labSampleType;
    }

    React.useEffect(() => {
      if (
        prevLabTestProvider.current !== labTestProvider ||
        prevLabTestKind.current !== labTestKind ||
        prevLabSampleType.current !== labSampleType
      ) {
        props.setFieldValue(props.fieldName, tests);
      }
    });

    const onToggleChip = React.useCallback(
      (chipIndex: number) => {
        const numberSelected = tests.reduce((prev, curr) => {
          return prev + (curr.selected ? 1 : 0);
        }, 0);
        if ((tests[chipIndex].selected && numberSelected > 1) || !tests[chipIndex].selected) {
          const newTests = cloneDeep(tests);
          newTests[chipIndex].selected = !newTests[chipIndex].selected;
          props.setFieldValue(props.fieldName, newTests);
        }
      },
      [props.setFieldValue, tests, props.fieldName]
    );

    const testChips = tests.map((chipValue, chipIndex) => {
      return (
        <TestChip
          disabled={props.disabled}
          key={`${chipValue}-${chipIndex}`}
          selected={chipValue.selected}
          label={chipValue.name}
          onToggle={() => onToggleChip(chipIndex)}
        />
      );
    });
    const className = `${props.className} ${classes.testsWrapper}`;
    const body = testChips.length > 0 ? testChips : 'Select: Lab Test Type, Lab Provider and Sample Type.';
    return <div className={className}>{body}</div>;
  }
);
