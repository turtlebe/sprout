import { makeOptions, renderFormGenInput } from '../test-helpers';

import { Typography } from '.';

const options = makeOptions({});

describe('Typography', () => {
  it('supports MUI Checkbox props', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      Typography,
      options({ formGenField: { typographyProps: { color: 'primary' } } })
    );

    const typography = getByTestId(formGenField.name);

    expect(typography.classList).toContain('MuiTypography-colorPrimary');
  });

  it('supports Markdown', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      Typography,
      options({ formGenField: { label: '[link-to-google](https://google.com)' } })
    );

    const typography = getByTestId(formGenField.name);
    const link = typography.querySelector('a');

    expect(typography).toHaveTextContent('link-to-google');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://google.com');
  });
});
