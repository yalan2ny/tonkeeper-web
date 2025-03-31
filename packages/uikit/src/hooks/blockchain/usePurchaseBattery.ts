import { useMutation, useQuery } from '@tanstack/react-query';
import { isAccountTonWalletStandard } from '@tonkeeper/core/dist/entries/account';

import { isTon, TonAsset } from '@tonkeeper/core/dist/entries/crypto/asset/ton-asset';
import { AssetAmount } from '@tonkeeper/core/dist/entries/crypto/asset/asset-amount';
import { useBatteryServiceConfig } from '../../state/battery';
import { useActiveAccount, useInvalidateActiveWalletQueries } from '../../state/wallet';
import { QueryKey } from '../../libs/queryKey';
import { DefaultRefetchInterval } from '../../state/tonendpoint';
import { useNotifyErrorHandle } from '../useNotification';
import { Address, beginCell } from '@ton/core';
import {
    BATTERY_SENDER_CHOICE,
    EXTERNAL_SENDER_CHOICE,
    useGetEstimationSender,
    useGetSender
} from './useSender';
import { useTonAssetTransferService } from './useBlockchainService';
import { useToQueryKeyPart } from '../useToQueryKeyPart';
import { TonEstimation } from '@tonkeeper/core/dist/entries/send';

export function useEstimatePurchaseBattery({
    assetAmount,
    giftRecipient,
    promoCode
}: {
    assetAmount: AssetAmount<TonAsset>;
    giftRecipient?: string;
    promoCode?: string;
}) {
    const notifyError = useNotifyErrorHandle();
    const batteryConfig = useBatteryServiceConfig();
    const transferService = useTonAssetTransferService();

    const payWithTon = isTon(assetAmount.asset.address);

    const getSender = useGetEstimationSender(
        payWithTon ? EXTERNAL_SENDER_CHOICE : BATTERY_SENDER_CHOICE
    );
    const getSenderKey = useToQueryKeyPart(getSender);

    return useQuery<TonEstimation, Error>(
        [
            QueryKey.estimateBatteryPurchase,
            assetAmount,
            payWithTon,
            getSenderKey,
            transferService,
            giftRecipient,
            promoCode,
            batteryConfig
        ],
        async () => {
            try {
                const needPayload = giftRecipient || promoCode || !payWithTon;
                return await transferService.estimate(await getSender!(), {
                    to: batteryConfig.fundReceiver,
                    amount: assetAmount,
                    payload: needPayload
                        ? {
                              type: 'raw',
                              value: encodePurchaseMessage({ giftRecipient, promoCode })
                          }
                        : undefined
                });
            } catch (e) {
                await notifyError(e);
                throw e;
            }
        },
        {
            refetchInterval: DefaultRefetchInterval,
            refetchOnMount: 'always',
            enabled: !!getSender
        }
    );
}

export const usePurchaseBattery = ({
    estimation,
    assetAmount,
    giftRecipient,
    promoCode
}: {
    estimation: TonEstimation;
    assetAmount: AssetAmount<TonAsset>;
    giftRecipient?: string;
    promoCode?: string;
}) => {
    const getSender = useGetSender();
    const account = useActiveAccount();
    const notifyError = useNotifyErrorHandle();
    const { mutateAsync: invalidateAccountQueries } = useInvalidateActiveWalletQueries();
    const batteryConfig = useBatteryServiceConfig();
    const transferService = useTonAssetTransferService();

    return useMutation<boolean, Error>(async () => {
        try {
            if (!isAccountTonWalletStandard(account) || account.type === 'ledger') {
                throw new Error("Can't send a transfer using this account");
            }

            const payWithTon = isTon(assetAmount.asset.address);

            const sender = await getSender(
                payWithTon ? EXTERNAL_SENDER_CHOICE : BATTERY_SENDER_CHOICE
            );

            const needPayload = giftRecipient || promoCode || !payWithTon;
            await transferService.send(sender, estimation, {
                to: batteryConfig.fundReceiver,
                amount: assetAmount,
                payload: needPayload
                    ? {
                          type: 'raw',
                          value: encodePurchaseMessage({ giftRecipient, promoCode })
                      }
                    : undefined
            });
        } catch (e) {
            await notifyError(e);
        }

        await invalidateAccountQueries();
        return true;
    });
};

const encodePurchaseMessage = ({
    giftRecipient,
    promoCode
}: {
    giftRecipient?: string;
    promoCode?: string;
}) => {
    const PURCHASE_OPCODE = 0xb7b2515f;
    let result = beginCell().storeUint(PURCHASE_OPCODE, 32);
    if (giftRecipient) {
        result = result.storeBit(1).storeAddress(Address.parse(giftRecipient));
    } else {
        result = result.storeBit(0);
    }

    return result.storeMaybeStringTail(promoCode).endCell();
};
