import { sortBy } from 'lodash';
import React from 'react';

import { useProductCodes } from '../hooks';

import { AutocompleteField } from './autocomplete-field';
interface Props {
  selectedProductCodes: LT.ProductCode[];
  className: string;
  location: LT.Location;
  fieldName: string;
  setFieldValue: LT.SetFieldValueType;
  disabled: boolean;
}

export const ProductCodes: React.FC<Props> = props => {
  const { productCodes, errorMsg, isLoading } = useProductCodes(props.location);

  React.useEffect(() => {
    if (!props.location.path) {
      props.setFieldValue(props.fieldName, []);
    }
  }, [props.location]);

  let noOptionsText;
  if (errorMsg) {
    noOptionsText = `Error fetching product codes: ${errorMsg}.`;
  } else if (productCodes && productCodes.length === 0) {
    noOptionsText = 'No product codes for this location';
  } else if (!productCodes) {
    noOptionsText = 'No product codes: Please select a Location.';
  }

  const getOptionLabel = (option: LT.ProductCode) => {
    let productCode = option;
    // we do not have crop when creating items from results view since crop name
    // is not saved to backend (only code), so use varietal service product codes
    // to get crop name.
    if (!option.displayName && productCodes) {
      const matchingProductCode = productCodes.find(product => product.name === option.name);
      if (matchingProductCode) {
        productCode = matchingProductCode;
      }
    }
    return productCode.displayName || productCode.name;
  };

  const productCodeOptions = sortBy(productCodes, ['displayName']) || [];

  // if selected product codes includes some items that are not in options list, then produce an error.
  const invalidVarietalCodes = props.selectedProductCodes.reduce((prev, curr) => {
    if (!productCodeOptions.some(pc => pc.name === curr.name)) {
      prev.push(curr.name);
    }
    return prev;
  }, []);

  const error = invalidVarietalCodes.length > 0 ? `Invalid field(s): ${invalidVarietalCodes.join()}` : '';

  return (
    <AutocompleteField
      disabled={props.disabled}
      getOptionSelected={(option, value) => {
        return option.name === value.name;
      }}
      isLoading={isLoading}
      multiple={true}
      getOptionLabel={getOptionLabel}
      className={props.className}
      label="Product Codes"
      fieldName={props.fieldName}
      options={productCodeOptions}
      noOptionsText={noOptionsText}
      error={error}
    />
  );
};
