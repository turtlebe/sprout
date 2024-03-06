import { buildDmsDevice } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { render } from '@testing-library/react';
import { Settings } from 'luxon';
import React from 'react';

import { dataTestIdsDeviceCertificate as dataTestIds, DeviceCertificate } from '.';

const luminaireWalalight = buildDmsDevice({ deviceTypeName: 'LuminaireWalalight', hasCertificate: true });
const hathor = buildDmsDevice({ deviceTypeName: 'Hathor', hasCertificate: false });

describe('DeviceCertificate', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  it('renders nothing', () => {
    const { container } = render(<DeviceCertificate device={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a non hathor device', () => {
    const { container } = render(<DeviceCertificate device={luminaireWalalight} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a chip for a device with no certificate', () => {
    const { queryByTestId } = render(<DeviceCertificate device={{ ...hathor, hasCertificate: false }} />);

    expect(queryByTestId(dataTestIds.hasCertificate)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noCertificate)).toHaveTextContent('no certificate');
  });

  it('renders a chip for a device with certificate', () => {
    const { queryByTestId } = render(
      <DeviceCertificate
        device={{ ...hathor, hasCertificate: true, certificateCreatedAt: '2018-05-01T13:44:48.708709Z' }}
      />
    );

    expect(queryByTestId(dataTestIds.hasCertificate)).toHaveAttribute('title', 'Created at: 05/01/2018 06:44 AM');
    expect(queryByTestId(dataTestIds.hasCertificate)).toHaveTextContent('certificate');
    expect(queryByTestId(dataTestIds.noCertificate)).not.toBeInTheDocument();
  });
});
