import { DateRangeValue } from '@plentyag/brand-ui/src/components/date-range-picker';
import React from 'react';

import { useCrops, useSkus } from '../../common/hooks/use-crops-skus';
import { getAllowedCropToPackagingLotCropCodesMapping } from '../utils/get-allowed-crop-to-packaging-lot-crop-codes-mapping';
import { getChildToParentCropsMapping } from '../utils/get-child-to-parent-crops-mapping';
import { getPackagingLotName } from '../utils/get-packaging-lot-name';
import { getRelatedPackagingLotCropCodes } from '../utils/get-related-packaging-lot-crop-codes';

interface Props {
  fieldName: string;
  className: string;
  harvestDates?: DateRangeValue;
  productCodes: LT.ProductCode[];
  location: LT.Location;
  setFieldValue: LT.SetFieldValueType;
}

export const LotCodes: React.FC<Props> = React.memo(props => {
  const startDate = props.harvestDates && props.harvestDates.begin;
  const endDate = props.harvestDates && props.harvestDates.end;
  const farmCode = props.location.farmCode || '';
  const cropsResult = useCrops(farmCode);
  const skusResult = useSkus(farmCode);
  const noCropsResultErrors = cropsResult.data && Array.isArray(cropsResult.data);
  const noSkusResultErrors = skusResult.data && Array.isArray(skusResult.data);

  let lotCodes: string[] = [];
  if (noCropsResultErrors && noSkusResultErrors) {
    const crops = cropsResult.data;
    const skus = skusResult.data;
    const childToParentCropsMapping = getChildToParentCropsMapping(crops);
    const allowedCropToPackagingLotCropCodesMapping = getAllowedCropToPackagingLotCropCodesMapping(skus);
    const relatedPackagingLotCropCodes = getRelatedPackagingLotCropCodes(
      props.productCodes.map(productCode => productCode.name),
      childToParentCropsMapping,
      allowedCropToPackagingLotCropCodesMapping
    );
    var packDate = new Date(startDate);
    while (packDate <= endDate) {
      lotCodes = lotCodes.concat(
        [...relatedPackagingLotCropCodes].map(packagingLotCropCode =>
          getPackagingLotName(farmCode, packagingLotCropCode, packDate)
        )
      );
      packDate.setDate(packDate.getDate() + 1);
    }
  }
  const apiResultErrors = Boolean(cropsResult.error || skusResult.error);

  React.useEffect(() => {
    props.setFieldValue(props.fieldName, lotCodes);
  }, [props.setFieldValue, props.fieldName, lotCodes]);

  return (
    <div className={props.className}>
      {lotCodes.length > 0 ? (
        lotCodes.map(code => <div key={code}>{code}</div>)
      ) : (
        <div>
          {apiResultErrors
            ? 'Problems fetching crops, skus or packing info. Try re-selecting Location and Harvest dates.'
            : 'Select: Location, Harvest dates and Product codes.'}
        </div>
      )}
    </div>
  );
});
