import { replaceWithContextAttribute } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  title: 'title-renderer-title',
};

export { dataTestIds as dataTestIdsTitleRenderer };

interface OverridableClassName {
  titleContainer?: string;
}

interface TitleRenderer {
  formGenConfig?: FormGen.Config;
  classes?: OverridableClassName;
}

export const TitleRenderer: React.FC<TitleRenderer> = props => {
  const defaultClasses = useStyles({});

  if (!props.formGenConfig) {
    return null;
  }

  return (
    <>
      {props.formGenConfig.title && (
        <Typography
          data-testid={dataTestIds.title}
          variant="h4"
          className={clsx(defaultClasses.titleContainer, props.classes.titleContainer)}
          paragraph={!props.formGenConfig.subtitle}
        >
          {replaceWithContextAttribute(props.formGenConfig.title, props.formGenConfig.context)}
        </Typography>
      )}
      {props.formGenConfig.subtitle && (
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={clsx(defaultClasses.titleContainer, props.classes.titleContainer)}
          paragraph
        >
          <MarkdownExtended>
            {replaceWithContextAttribute(props.formGenConfig.subtitle, props.formGenConfig.context)}
          </MarkdownExtended>
        </Typography>
      )}
    </>
  );
};
