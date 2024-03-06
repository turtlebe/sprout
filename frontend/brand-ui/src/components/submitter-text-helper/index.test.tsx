import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { SubmitterTextHelper } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

mockCurrentUser();

describe('SubmitterTextHelper', () => {
  it('renders info about who submitted the seedling-qa form', () => {
    const createdAt = '2020-06-03T00:00:00.000';
    const username = 'sbell';

    mockUseSwrAxios.mockReturnValue({
      data: {
        firstName: 'Stringer',
        lastName: 'Bell',
        username,
      },
    });

    const { asFragment } = render(<SubmitterTextHelper createdAt={createdAt} username={username} />);

    expect(asFragment().textContent).toContain(
      `Submitted by Stringer Bell on ${DateTime.fromISO(createdAt).toFormat(DateTimeFormat.DEFAULT)}`
    );
  });

  it('renders the current user info', () => {
    const { asFragment } = render(<SubmitterTextHelper />);

    expect(asFragment().textContent).toContain('Submitting as omar little in LAX1/LAX1');
  });
});
