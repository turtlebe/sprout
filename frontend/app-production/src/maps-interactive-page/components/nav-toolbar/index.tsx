import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { Dropdown, DropdownItem, DropdownItemText, PlentyLink } from '@plentyag/brand-ui/src/components';
import { Breadcrumbs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefArea, FarmDefLine } from '@plentyag/core/src/farm-def/types';
import React, { useCallback, useEffect } from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'nav-toolbar-root',
  mapsLink: 'nav-toolbar-maps-link',
  interactiveLink: 'nav-toolbar-interactive-link',
  areaDropdown: 'nav-toolbar-area-dropdown',
  areaDropdownItem: (name: string) => `nav-toolbar-area-dropdown-item-${name}`,
  lineDropdown: 'nav-toolbar-line-dropdown',
  lineDropdownItem: (name: string) => `nav-toolbar-line-dropdown-item-${name}`,
};

export { dataTestIds as dataTestIdsNavToolbar };

interface NavToolbar {
  isLoading?: boolean;
  areas: FarmDefArea[];
  lines?: FarmDefLine[];
  area?: FarmDefArea;
  line?: FarmDefLine;
}

export const NavToolbar: React.FC<NavToolbar> = ({ isLoading = false, areas = [], lines = [], area, line }) => {
  const classes = useStyles({});
  const { routeToMapsInterative, getMapsInteractiveRoute } = useMapsInteractiveRouting();

  /**
   * On load handlers
   * - if there is a selected area but no lines selected yet reroute to the first found line
   * - if there is no selected area reroute to landing
   * - if there is a selected area but no lines at all reroute to landing
   */
  useEffect(() => {
    if (area && !line && lines?.length) {
      const lineName = lines[0].name;
      routeToMapsInterative(area.name, lineName);
    }
  }, [area, line, lines]);

  /**
   * On area dropdown change, reroute
   */
  const handleAreaChange = useCallback((areaName: string) => {
    routeToMapsInterative(areaName, undefined);
  }, []);

  /**
   * On line dropdown change, reroute
   */
  const handleLineChange = useCallback(
    (lineName: string) => {
      routeToMapsInterative(area.name, lineName);
    },
    [lines, area]
  );

  return (
    <Breadcrumbs data-testid={dataTestIds.root} className={classes.breadcrumbs}>
      <PlentyLink data-testid={dataTestIds.mapsLink} to={getMapsInteractiveRoute()}>
        Maps
      </PlentyLink>
      <PlentyLink data-testid={dataTestIds.interactiveLink} to={getMapsInteractiveRoute()}>
        Interactive
      </PlentyLink>
      <Dropdown
        data-testid={dataTestIds.areaDropdown}
        className={classes.dropdownButton}
        color="default"
        disabled={isLoading || !areas?.length}
        label={<Typography color="primary">{area?.displayName || 'Area'}</Typography>}
      >
        {areas.map(area => (
          <DropdownItem
            data-testid={dataTestIds.areaDropdownItem(area.name)}
            key={area.name}
            value={area.name}
            onClick={() => handleAreaChange(area.name)}
          >
            <DropdownItemText>{area.displayName}</DropdownItemText>
          </DropdownItem>
        ))}
      </Dropdown>
      <Dropdown
        data-testid={dataTestIds.lineDropdown}
        className={classes.dropdownButton}
        color="default"
        disabled={isLoading || !lines?.length}
        label={<Typography color="primary">{line?.displayName || 'Line'}</Typography>}
      >
        {lines.map(line => (
          <DropdownItem
            data-testid={dataTestIds.lineDropdownItem(line.name)}
            key={line.name}
            onClick={() => handleLineChange(line.name)}
          >
            <DropdownItemText>{line.displayName}</DropdownItemText>
          </DropdownItem>
        ))}
      </Dropdown>
    </Breadcrumbs>
  );
};
