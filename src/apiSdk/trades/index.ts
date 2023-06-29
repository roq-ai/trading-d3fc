import axios from 'axios';
import queryString from 'query-string';
import { TradeInterface, TradeGetQueryInterface } from 'interfaces/trade';
import { GetQueryInterface } from '../../interfaces';

export const getTrades = async (query?: TradeGetQueryInterface) => {
  const response = await axios.get(`/api/trades${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTrade = async (trade: TradeInterface) => {
  const response = await axios.post('/api/trades', trade);
  return response.data;
};

export const updateTradeById = async (id: string, trade: TradeInterface) => {
  const response = await axios.put(`/api/trades/${id}`, trade);
  return response.data;
};

export const getTradeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trades/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTradeById = async (id: string) => {
  const response = await axios.delete(`/api/trades/${id}`);
  return response.data;
};
