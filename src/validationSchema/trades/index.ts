import * as yup from 'yup';

export const tradeValidationSchema = yup.object().shape({
  trade_date: yup.date().required(),
  profit_or_loss: yup.number().integer().required(),
  business_id: yup.string().nullable(),
});
