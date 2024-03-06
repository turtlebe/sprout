import { getIndexedSkus } from '@plentyag/app-production/src/reports-finished-goods-page/utils';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot } from '@plentyag/core/src/types';
import { DateTimeFormat, getBestByDateFromLotAndSku } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import * as yup from 'yup';

import { CREATE_POSTHARVEST_QA_AUDIT, UPDATE_POSTHARVEST_QA_AUDIT } from '../../constants';
import { Assessment, AssessmentTypes } from '../../types';
import { getAssessmentTypeFields } from '../../utils';
import { getTooltipComponent } from '../../utils/get-tooltip-component';

export interface UseEditPostharvestQaFormGenConfig {
  lots: PackagingLot[];
  lotsRecord: Record<string, PackagingLot>;
  skus: FarmDefSku[];
  skusRecord: Record<string, FarmDefSku>;
  assessmentTypes: AssessmentTypes[];
  username: string;
  siteName: string;
  farmName: string;
}

export const useEditPostharvestQaFormGenConfig = ({
  lots = [],
  lotsRecord = {},
  skus = [],
  skusRecord = {},
  assessmentTypes,
  username,
  siteName,
  farmName,
}: UseEditPostharvestQaFormGenConfig): FormGen.Config => {
  const title = 'New Audit';
  const lotsOptions = lots?.map(lot => lot.lotName) || [];

  return {
    title,
    createEndpoint: CREATE_POSTHARVEST_QA_AUDIT,
    updateEndpoint: UPDATE_POSTHARVEST_QA_AUDIT,
    serialize: values => {
      const { originalModel, lot, sku } = values;
      return {
        ...originalModel,
        createdBy: username,
        lot,
        sku,
        site: siteName,
        farm: farmName,
        assessments: assessmentTypes.reduce<Assessment[]>((acc, assessmentType) => {
          const { name } = assessmentType;
          const value = values[name];
          if (value) {
            acc.push({ name, value });
          }
          return acc;
        }, []),
      };
    },
    deserialize: values => {
      return {
        originalModel: values,
        lot: values.lot,
        sku: values.sku,
        ...assessmentTypes.reduce((acc, assessmentType) => {
          const value = values?.assessments?.find(assessment => assessment.name === assessmentType.name)?.value ?? null;
          acc[assessmentType.name] = value;
          return acc;
        }, {}),
      };
    },
    fields: [
      {
        type: 'Autocomplete',
        name: 'lot',
        label: 'Packaging Lot',
        options: lotsOptions,
        validate: yup.string().required(),
        tooltip: getTooltipComponent(
          'Packaging Lot',
          'Select the packaging lot number. Packaging lots listed are all generated packaging lots in the last 3 days'
        ),
      },
      {
        computed: (values: any) => {
          const selectedLot = lotsRecord[values.lot];
          const skusByCrop = getIndexedSkus(skus);
          const skusOptions = skusByCrop[selectedLot?.product]?.map(sku => sku.name) || [];
          return [
            {
              type: 'Autocomplete',
              name: 'sku',
              label: 'SKU',
              options: skusOptions,
              validate: yup.string().required(),
              tooltip: getTooltipComponent(
                'SKU',
                'Select the SKU. SKUs listed are restricted by specific product (crop) of the selected packaging lot.'
              ),
            },
          ];
        },
      },
      {
        computed: (values: any) => {
          const packagingLot = lotsRecord[values.lot];
          const sku = skusRecord?.[values.sku];
          const bestByDate = packagingLot && sku && getBestByDateFromLotAndSku(packagingLot, sku);
          const valuesWithMoreInfo = {
            ...values,
            skuWeight: sku?.productWeightOz || 0,
            bestByDate: bestByDate && DateTime.fromJSDate(bestByDate).toFormat(DateTimeFormat.DATE_ONLY),
          };
          return getAssessmentTypeFields(assessmentTypes, valuesWithMoreInfo);
        },
      },
    ],
    permissions: {
      create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
    },
  };
};
