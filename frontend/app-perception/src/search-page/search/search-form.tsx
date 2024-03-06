import { useSites } from '@plentyag/app-perception/src/api/use-sites';
import { FormRenderer } from '@plentyag/brand-ui/src/components/form-gen';
import { makeStyles, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FormikConfig } from 'formik';
import React from 'react';

import { SearchFields } from '../../common/types/interfaces';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
  },
  heading: {
    marginTop: '20px',
  },
  form: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formField: {
    minWidth: '80%',
    marginBottom: '5px',
    display: 'flex',
  },
  formSubmit: {
    marginTop: '1rem',
  },
});

interface SearchForm {
  searchFields: SearchFields;
  setSearchFields: (searchFields: SearchFields) => void;
  setCurrentPage: (page: number) => void;
}

export const SearchForm: React.FC<SearchForm> = ({ searchFields, setSearchFields, setCurrentPage }) => {
  const classes = useStyles({});
  const sites = useSites();
  const autocompleteFields: string[] = ['area', 'line', 'machine'];

  /**
   * Parse initial values for search for from url (if they exist)
   */
  const initialValues: FormikConfig<unknown>['initialValues'] = React.useMemo(() => {
    const searchValues: any = {};
    // adding an inital sorting value until full sorting support SD-6433 is completed
    // also provides a hint to users about how to change sort ordering as needed
    let initialValues: any = { advancedSearch: 'ordering=-dt_utc' };
    if (!location.search) {
      return initialValues;
    }
    const searchParams = new URLSearchParams(location.search);
    searchParams.forEach(function (value, param) {
      if (param === 'page') {
        setCurrentPage(+value);
      } else {
        searchValues[param] = decodeURIComponent(value);
      }
    });
    if (!searchFields) {
      setSearchFields(searchValues);
    }

    initialValues = { ...searchValues };
    // convert autocomplete field comma separated list into an array
    autocompleteFields.forEach(field => {
      if (initialValues[field]) {
        initialValues[field] = initialValues[field].split(',');
      }
    });
    return initialValues;
  }, []);

  /**
   * Perform any necessary data cleaning and processing of the form values
   *
   * @param values form values
   */
  const processSearchValues = (values: any) => {
    // collapse array for autocomplete  fields into comma separated list
    autocompleteFields.forEach(field => {
      if (values[field]) {
        values[field] = values[field].join(',');
      }
    });
    return values;
  };

  const searchForm = (
    <FormRenderer
      formId={'perceptionSearch'}
      enableReinitialize
      initialValues={initialValues}
      classes={{ input: classes.formField, submit: classes.formSubmit }}
      onSubmit={values => {
        const searchValues = Object.assign({}, values);
        setCurrentPage(1);
        setSearchFields(processSearchValues(searchValues));
      }}
      formGenConfig={{
        fields: [
          {
            type: 'DatePicker',
            name: 'startTime',
            label: 'Start Time',
            datePickerProps: {
              clearable: true,
            },
          },
          {
            type: 'DatePicker',
            name: 'endTime',
            label: 'End Time',
            datePickerProps: {
              clearable: true,
            },
          },
          {
            type: 'Select',
            name: 'site',
            label: 'Site',
            options: sites.sort((a, b) => -b.localeCompare(a)),
          },
          {
            computed: values => [
              {
                type: 'AutocompleteRemote',
                name: 'area',
                label: 'Area',
                url: `/api/plentyservice/farm-def-service/search-object?kind=area&site=${values.site}`,
                transformResponse: response => response.map(item => ({ label: item.name, value: item.name })),
                autocompleteProps: { multiple: true },
              },
              {
                type: 'AutocompleteRemote',
                name: 'line',
                label: 'Line',
                url: `/api/plentyservice/farm-def-service/search-object?kind=line&site=${values.site}`,
                transformResponse: response => response.map(item => ({ label: item.name, value: item.name })),
                autocompleteProps: { multiple: true },
              },
              {
                type: 'AutocompleteRemote',
                name: 'machine',
                label: 'Machine',
                url: `/api/plentyservice/farm-def-service/search-object?kind=machine&site=${values.site}`,
                transformResponse: response => response.map(item => ({ label: item.name, value: item.name })),
                autocompleteProps: { multiple: true },
              },
            ],
          },
          {
            type: 'TextField',
            name: 'owner',
            label: 'Owner',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'containerID',
            label: 'Container ID',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'deviceSerial',
            label: 'Device Serial',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'tags',
            label: 'Tags',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'labels',
            label: 'Labels',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'trialNumber',
            label: 'Trial Number',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'treatmentNumber',
            label: 'Treatment Number',
            textFieldProps: {
              multiline: true,
            },
          },
          {
            type: 'TextField',
            name: 'advancedSearch',
            label: 'Advanced Search',
            textFieldProps: {
              multiline: true,
            },
          },
        ],
      }}
    />
  );

  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <Typography variant={'h5'}>Image Search</Typography>
      </div>
      <div className={classes.form}>{searchForm}</div>
    </div>
  );
};
