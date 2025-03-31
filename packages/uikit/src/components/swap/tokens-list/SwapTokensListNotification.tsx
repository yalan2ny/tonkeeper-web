import { Notification } from '../../Notification';
import { FC, Ref, useCallback, useEffect, useRef } from 'react';
import { atom, useAtom } from '../../../libs/atom';
import { TonAsset } from '@tonkeeper/core/dist/entries/crypto/asset/ton-asset';
import { css, styled } from 'styled-components';
import { SwapSearchInput } from './SwapSearchInput';
import { SwapTokensList } from './SwapTokensList';
import {
    useSwapTokensFilter,
    useWalletFilteredSwapAssets
} from '../../../state/swap/useSwapAssets';
import { SpinnerIcon } from '../../Icon';
import { useTranslation } from '../../../hooks/translation';

const swapTokensListOpened$ = atom<{ onClose: (token: TonAsset | undefined) => void } | undefined>(
    undefined
);
export const useOpenSwapTokensList = (onClose: (token: TonAsset | undefined) => void) => {
    const [_, setIsOpen] = useAtom(swapTokensListOpened$);

    return useCallback(
        () =>
            setIsOpen(() => ({
                onClose
            })),
        [setIsOpen, onClose]
    );
};

const NotificationStyled = styled(Notification)`
    padding-bottom: 0;
`;

export const SwapTokensListNotification: FC = () => {
    const { t } = useTranslation();
    const [onSelect, setIsOpen] = useAtom(swapTokensListOpened$);

    const onClose = (asset: TonAsset | undefined) => {
        onSelect?.onClose(asset);
        setIsOpen(undefined);
    };

    return (
        <>
            <NotificationStyled
                isOpen={!!onSelect}
                handleClose={() => onClose(undefined)}
                title={t('swap_tokens')}
                footer={<div />}
            >
                {() => <SwapTokensListContent onSelect={onClose} />}
            </NotificationStyled>
        </>
    );
};

const SwapSearchInputStyled = styled(SwapSearchInput)`
    margin-bottom: 1rem;
`;

const SwapTokensListContentWrapper = styled.div`
    ${p =>
        p.theme.displayType === 'full-width'
            ? css`
                  height: 580px;
              `
            : css`
                  height: calc(var(--app-height) - 8rem);
              `}
`;

const Divider = styled.div`
    width: calc(100% + 2rem);
    margin: 0 -1rem;
    height: 1px;
    background-color: ${p => p.theme.separatorCommon};
`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

const SwapTokensListContent: FC<{ onSelect: (token: TonAsset | undefined) => void }> = ({
    onSelect
}) => {
    const walletSwapAssets = useWalletFilteredSwapAssets();
    const inputRef = useRef<HTMLInputElement | undefined>();
    const [_, setFilter] = useSwapTokensFilter();

    useEffect(() => {
        setTimeout(() => inputRef?.current?.focus(), 100);
        return () => setFilter('');
    }, []);

    return (
        <SwapTokensListContentWrapper>
            <SwapSearchInputStyled
                ref={inputRef as Ref<HTMLInputElement> | undefined}
                isDisabled={!walletSwapAssets}
            />
            <Divider />
            {walletSwapAssets ? (
                <SwapTokensList onSelect={onSelect} walletSwapAssets={walletSwapAssets} />
            ) : (
                <SpinnerContainer>
                    <SpinnerIcon />
                </SpinnerContainer>
            )}
        </SwapTokensListContentWrapper>
    );
};
