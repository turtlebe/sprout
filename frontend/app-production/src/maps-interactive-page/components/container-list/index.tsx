import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ContainerState, EMPTY_CONTAINER_COLOR, GetCropColor } from '../../types';
import { getTitleFromResourceState } from '../../utils/text-helpers';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'container-list-root',
  containerIcon: (serial: string) => `container-list-item-icon-${serial}`,
  containerTitle: (serial: string) => `container-list-item-title-${serial}`,
  serialLink: (serial: string) => `container-list-item-link-${serial}`,
};

export { dataTestIds as dataTestIdsContainerList };

export interface ContainerList {
  containers: ContainerState[];
  resourcesPageBasePath: string;
  getCropColor: GetCropColor;
}

export const ContainerList: React.FC<ContainerList> = ({ containers, getCropColor, resourcesPageBasePath }) => {
  const classes = useStyles();

  return (
    <Box width="100%" data-testid={dataTestIds.root}>
      {containers.map((container, index) => {
        const { resourceState } = container;

        const title = getTitleFromResourceState(resourceState);
        const serial = resourceState?.containerObj?.serial;
        const lotName = resourceState?.materialObj?.lotName;
        const nonSerial = !serial && `index_${index}`;
        const product = resourceState?.materialObj?.product;

        const color = product ? getCropColor(product) : EMPTY_CONTAINER_COLOR;

        const containerIconStyle = color ? { background: color } : { border: '1px solid #ccc' };

        const uniqueId = serial || lotName || nonSerial;

        return (
          <Box key={uniqueId} className={classes.item}>
            <Box className={classes.figure}>
              <Box
                className={classes.containerIcon}
                style={containerIconStyle}
                data-testid={dataTestIds.containerIcon(uniqueId)}
              ></Box>
            </Box>
            <Box className={classes.description}>
              <Box className={classes.title} data-testid={dataTestIds.containerTitle(uniqueId)}>
                {title}
              </Box>
              {(serial || lotName) && (
                <PlentyLink
                  data-testid={dataTestIds.serialLink(uniqueId)}
                  to={`${resourcesPageBasePath}?q=${serial || lotName}`}
                  openInNewTab
                >
                  <b>{serial || lotName}</b>
                </PlentyLink>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
