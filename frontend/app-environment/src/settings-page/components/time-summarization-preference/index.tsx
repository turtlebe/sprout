import { useLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks';
import { Card } from '@plentyag/brand-ui/src/components';
import { Button, ButtonGroup } from '@plentyag/brand-ui/src/material-ui/core';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  buttonTimeSummarization: (timeSummarization: TimeSummarization) =>
    `time-summarization-perference-${timeSummarization}`,
};

export { dataTestIds as dataTestIdsTimeSummarizationPreference };

export const TimeSummarizationPreference: React.FC = () => {
  const [preferredTimeSummarization, setTimeSummarization] = useLocalStorageTimeSummarization();
  return (
    <Card title="Time Summarization" isLoading={false}>
      <ButtonGroup color="default">
        {Object.values(TimeSummarization).map(timeSummarization => (
          <Button
            key={timeSummarization}
            onClick={() => setTimeSummarization(timeSummarization)}
            color={preferredTimeSummarization === timeSummarization ? 'primary' : undefined}
            data-testid={dataTestIds.buttonTimeSummarization(timeSummarization)}
          >
            {timeSummarization}
          </Button>
        ))}
      </ButtonGroup>
    </Card>
  );
};
