import { useCallback } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useMarketFeed }      from '../mock/useMarketFeed';
import { useTransactionFeed } from '../mock/useTransactionFeed';
import type { AssetPrice, Transaction } from '../types/finance';

export default function LiveFeedProvider() {
  const assetPrices       = useFinanceStore(s => s.assetPrices);
  const addTransaction    = useFinanceStore(s => s.addTransaction);
  const updateAssetPrice  = useFinanceStore(s => s.updateAssetPrice);

  const handlePrice = useCallback(
    (updated: AssetPrice) => updateAssetPrice(updated),
    [updateAssetPrice]
  );

  const handleTransaction = useCallback(
    (tx: Transaction) => addTransaction(tx),
    [addTransaction]
  );

  useMarketFeed(assetPrices, handlePrice);
  useTransactionFeed(handleTransaction);

  return null;
}
