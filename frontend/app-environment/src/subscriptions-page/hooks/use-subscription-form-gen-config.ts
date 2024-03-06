import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { when } from '@plentyag/brand-ui/src/components/form-gen';
import {
  Subscription,
  SubscriptionMethod,
  SubscriptionNotificationType,
  SubscriptionPriority,
} from '@plentyag/core/src/types/environment';
import { toMinutes, toSeconds } from '@plentyag/core/src/utils';
import * as yup from 'yup';

import { NotificationTooltip } from '../components/notification-tooltip';
import { NotificationTypeTooltip } from '../components/notification-type-tooltip';
import { RecipientTooltip } from '../components/recipient-tooltip';
import { RenotifyTooltip } from '../components/renotify-tooltip';

export interface UseSubscriptionFormGenConfig {
  alertRuleId?: string;
  subscription?: Subscription;
  username: string;
}

export const useSubscriptionFormGenConfig = ({
  alertRuleId,
  subscription,
  username,
}: UseSubscriptionFormGenConfig): FormGen.Config => {
  const isUpdating = Boolean(subscription);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  return {
    title: isUpdating ? 'Edit Subscription' : 'New Subscription',
    createEndpoint: EVS_URLS.subscriptions.createUrl(),
    updateEndpoint: EVS_URLS.subscriptions.updateUrl(subscription),
    deserialize: values => ({
      ...values,
      notificationDuration: toMinutes(values.notificationDuration),
      renotifyPeriod: toMinutes(values.renotifyPeriod),
    }),
    serialize: values => ({
      alertRuleId,
      ...values,
      notificationDuration: toSeconds(values.notificationDuration),
      renotifyPeriod: toSeconds(values.renotifyPeriod),
      [createdOrUpdatedBy]: username,
    }),
    fields: [
      {
        type: 'Select',
        name: 'notificationType',
        label: 'Type',
        options: Object.values(SubscriptionNotificationType),
        validate: yup.string().required(),
        default: SubscriptionNotificationType.default,
        tooltip: NotificationTypeTooltip,
      },
      {
        type: 'Select',
        name: 'method',
        label: 'Method',
        options: Object.values(SubscriptionMethod),
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'to',
        label: 'Recipient',
        tooltip: RecipientTooltip,
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'notificationThreshold',
        label: 'Notification Count',
        tooltip: NotificationTooltip,
        textFieldProps: { type: 'number' },
        validate: yup.number().min(1).nullable(),
      },
      {
        type: 'TextField',
        name: 'notificationDuration',
        label: 'Notification Duration (minutes)',
        tooltip: NotificationTooltip,
        textFieldProps: { type: 'number' },
        validate: yup.number().min(1).nullable(),
      },
      {
        type: 'Select',
        name: 'notificationDistinctSource',
        label: 'Use Distinct Source?',
        tooltip: NotificationTooltip,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
      {
        type: 'TextField',
        name: 'renotifyPeriod',
        label: 'Renotify Every (minutes)',
        tooltip: RenotifyTooltip,
        textFieldProps: { type: 'number' },
        validate: yup.number().min(10).nullable(),
      },
      {
        type: 'TextField',
        name: 'description',
        label: 'Description',
        validate: yup.string().nullable(),
        textFieldProps: { multiline: true },
      },
      {
        if: when(['method'], method => method === SubscriptionMethod.opsGenie),
        fields: [
          {
            type: 'Select',
            name: 'priority',
            label: 'Priority',
            options: Object.values(SubscriptionPriority),
            validate: yup.string().required(),
          },
          {
            type: 'AutocompleteMultiple',
            name: 'tags',
            label: 'Tags',
            options: [],
            autocompleteProps: { freeSolo: true },
            validate: yup
              .array()
              .optional()
              .max(20)
              .of(yup.string().optional().max(50, '50 characters allowed max per tag')),
          },
        ],
      },
    ],
  };
};
