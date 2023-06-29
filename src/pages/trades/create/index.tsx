import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTrade } from 'apiSdk/trades';
import { Error } from 'components/error';
import { tradeValidationSchema } from 'validationSchema/trades';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BusinessInterface } from 'interfaces/business';
import { getBusinesses } from 'apiSdk/businesses';
import { TradeInterface } from 'interfaces/trade';

function TradeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TradeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTrade(values);
      resetForm();
      router.push('/trades');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TradeInterface>({
    initialValues: {
      trade_date: new Date(new Date().toDateString()),
      profit_or_loss: 0,
      business_id: (router.query.business_id as string) ?? null,
    },
    validationSchema: tradeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Trade
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="trade_date" mb="4">
            <FormLabel>Trade Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.trade_date ? new Date(formik.values?.trade_date) : null}
                onChange={(value: Date) => formik.setFieldValue('trade_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="profit_or_loss" mb="4" isInvalid={!!formik.errors?.profit_or_loss}>
            <FormLabel>Profit Or Loss</FormLabel>
            <NumberInput
              name="profit_or_loss"
              value={formik.values?.profit_or_loss}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('profit_or_loss', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.profit_or_loss && <FormErrorMessage>{formik.errors?.profit_or_loss}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BusinessInterface>
            formik={formik}
            name={'business_id'}
            label={'Select Business'}
            placeholder={'Select Business'}
            fetcher={getBusinesses}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'trade',
    operation: AccessOperationEnum.CREATE,
  }),
)(TradeCreatePage);
