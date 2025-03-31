import { useMutation } from '@tanstack/react-query';
import { CalculatedSwap } from './useCalculatedSwap';
import type { SwapService } from '@tonkeeper/core/dist/swapsApi';
import { assertUnreachable, NonNullableFields } from '@tonkeeper/core/dist/utils/types';
import { Address } from '@ton/core';
import { useSwapsConfig } from './useSwapsConfig';
import BigNumber from 'bignumber.js';
import { useSwapOptions } from './useSwapOptions';
import { useActiveConfig, useActiveTonWalletConfig, useActiveWallet } from '../wallet';
import {
    TON_CONNECT_MSG_VARIANTS_ID,
    TonConnectTransactionPayload
} from '@tonkeeper/core/dist/entries/tonConnect';
import { useBatteryBalance, useBatteryServiceConfig } from '../battery';

export function useEncodeSwap() {
    const wallet = useActiveWallet();
    const { swapService } = useSwapsConfig();
    const config = useActiveConfig();
    const { data: swapOpaitons } = useSwapOptions();
    const referral = config.web_swaps_referral_address;

    return useMutation<
        { value: string; to: string; body: string },
        Error,
        NonNullableFields<CalculatedSwap> & { excessAddress?: string }
    >(swap => {
        if (!swapOpaitons) {
            throw new Error('SwapOptions query was not resolved yet');
        }
        return swapService.encodeSwap({
            swap: swapToProviderSwap(swap),
            options: {
                senderAddress: wallet.rawAddress,
                slippage: new BigNumber(swapOpaitons.slippagePercent)
                    .div(100)
                    .decimalPlaces(5)
                    .toString(),
                ...(referral && { referralAddress: Address.parse(referral).toRawString() }),
                ...(swap.excessAddress && { excessAddress: swap.excessAddress })
            }
        });
    });
}

export function useEncodeSwapToTonConnectParams(options: { forceCalculateBattery?: boolean } = {}) {
    const { mutateAsync: encode } = useEncodeSwap();
    const { data: batteryBalance } = useBatteryBalance();
    const { excessAccount: batteryExcess } = useBatteryServiceConfig();
    const { data: activeWalletConfig } = useActiveTonWalletConfig();

    return useMutation<TonConnectTransactionPayload, Error, NonNullableFields<CalculatedSwap>>(
        async swap => {
            const resultsPromises = [encode(swap)];

            const batterySwapsEnabled = activeWalletConfig
                ? activeWalletConfig.batterySettings.enabledForSwaps
                : true;
            if (
                options.forceCalculateBattery ||
                (batteryBalance?.batteryUnitsBalance.gt(0) && batterySwapsEnabled)
            ) {
                resultsPromises.push(
                    encode({ ...swap, excessAddress: Address.parse(batteryExcess).toRawString() })
                );
            }

            const results = await Promise.all(resultsPromises);
            const gasMessage = results[0];

            const tonConnectPayload: TonConnectTransactionPayload = {
                valid_until: (Date.now() + 10 * 60 * 1000) / 1000,
                messages: [
                    {
                        address: Address.parse(gasMessage.to).toString({ bounceable: true }),
                        amount: gasMessage.value,
                        payload: gasMessage.body
                    }
                ]
            };

            const batteryMessage = results[1];
            if (batteryMessage) {
                tonConnectPayload.messagesVariants = {
                    [TON_CONNECT_MSG_VARIANTS_ID.BATTERY]: [
                        {
                            address: Address.parse(batteryMessage.to).toString({
                                bounceable: true
                            }),
                            amount: batteryMessage.value,
                            payload: batteryMessage.body
                        }
                    ]
                };
            }

            return tonConnectPayload;
        }
    );
}

const swapToProviderSwap = (
    swap: NonNullableFields<CalculatedSwap>
): Parameters<typeof SwapService.encodeSwap>[0]['swap'] => {
    if (swap.provider === 'stonfi') {
        return {
            provider: 'stonfi',
            stonfiTrade: swap.trade.rawTrade as {
                fromAsset: string;
                toAsset: string;
                fromAmount: string;
                toAmount: string;
                routerAddress: string;
            }
        };
    }
    if (swap.provider === 'dedust') {
        return {
            provider: 'dedust',
            dedustTrade: swap.trade.rawTrade as Array<{
                fromAsset: string;
                toAsset: string;
                fromAmount: string;
                toAmount: string;
                poolAddress: string;
            }>
        };
    }

    assertUnreachable(swap);
};
