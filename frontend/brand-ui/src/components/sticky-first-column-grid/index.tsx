import React from 'react';

import { MarkdownExtended } from '../markdown-extended';

import { useStyles } from './styles';

interface StickyFirstColumnGrid<C, R> {
  columns: C[];
  rows: R[];
  renderCell: (renderCellProps: { column: C; row: R; colIndex: number; rowIndex: number }) => JSX.Element | string;
  renderHeader: (renderHeaderProps: { column: C; colIndex: number }) => JSX.Element | string;
  renderRowHeader: (renderRowHeaderProps: { row: R; rowIndex: number }) => string;
}

export function StickyFirstColumnGrid<C, R>({
  columns,
  rows,
  renderCell,
  renderHeader,
  renderRowHeader,
}: StickyFirstColumnGrid<C, R>) {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <table>
        <thead>
          <tr>
            <td className={classes.sticky}></td>
            {columns.map((column, colIndex) => (
              <th key={colIndex}>{renderHeader({ column, colIndex })}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className={classes.sticky}>
                <MarkdownExtended>{renderRowHeader({ row, rowIndex })}</MarkdownExtended>
              </td>
              {columns.map((column, colIndex) => (
                <td key={`${rowIndex}.${colIndex}`}>{renderCell({ column, row, colIndex, rowIndex })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
