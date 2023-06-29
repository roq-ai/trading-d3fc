import { BusinessInterface } from 'interfaces/business';
import { GetQueryInterface } from 'interfaces';

export interface TradeInterface {
  id?: string;
  trade_date: any;
  profit_or_loss: number;
  business_id?: string;
  created_at?: any;
  updated_at?: any;

  business?: BusinessInterface;
  _count?: {};
}

export interface TradeGetQueryInterface extends GetQueryInterface {
  id?: string;
  business_id?: string;
}
