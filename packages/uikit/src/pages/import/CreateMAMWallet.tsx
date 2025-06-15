import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { IconPage } from '../../components/Layout';
import { UpdateWalletName } from '../../components/create/WalletName';
import { Check, Words } from '../../components/create/Words';
import { Button } from '../../components/fields/Button';
import {
    CheckLottieIcon,
    GearLottieIcon,
    WriteLottieIcon
} from '../../components/lottie/LottieIcons';
import { useTranslation } from '../../hooks/translation';
import { FinalView } from './Password';
import { Account, AccountMAM } from '@tonkeeper/core/dist/entries/account';
import {
    useCreateAccountMAM,
    useMutateActiveAccountConfig,
    useMutateRenameAccount,
    useMutateRenameAccountDerivations
} from '../../state/wallet';
import { TonKeychainRoot } from '@ton-keychain/core';
import { useConfirmDiscardNotification } from '../../components/modals/ConfirmDiscardNotificationControlled';
import { AddWalletContext } from '../../components/create/AddWalletContext';
import {
    NotificationFooter,
    NotificationFooterPortal,
    OnCloseInterceptor,
    useSetNotificationOnBack,
    useSetNotificationOnCloseInterceptor
} from '../../components/Notification';
import { SelectWalletNetworks } from '../../components/create/SelectWalletNetworks';
import { defaultAccountConfig } from '@tonkeeper/core/dist/service/wallet/configService';
import { useIsTronEnabledGlobally } from '../../state/tron/tron';
import { Subscribe } from './Subscribe';
import { useAppSdk } from '../../hooks/appSdk';

export const CreateMAMWallet: FC<{ afterCompleted: () => void }> = ({ afterCompleted }) => {
    const { t } = useTranslation();
    const { mutateAsync: createWalletsAsync, isLoading: isCreateWalletLoading } =
        useCreateAccountMAM();
    const { mutateAsync: renameAccount, isLoading: renameAccountLoading } =
        useMutateRenameAccount();
    const { mutateAsync: renameDerivations, isLoading: renameDerivationsLoading } =
        useMutateRenameAccountDerivations();

    const [mnemonic, setMnemonic] = useState<string[] | undefined>();
    const [createdAccount, setCreatedAccount] = useState<
        { account: Account; childrenMnemonics: string[][] } | undefined
    >(undefined);

    const [creatingAnimationPassed, setCreatingAnimationPassed] = useState(false);
    const [infoPagePassed, setInfoPagePassed] = useState(false);
    const [wordsPagePassed, setWordsPagePassed] = useState(false);
    const [editNamePagePassed, setEditNamePagePassed] = useState(false);
    const [selectNetworksPassed, setSelectNetworksPassed] = useState(false);

    const [wordsShown, setWordsShown] = useState(false);
    const { mutate: mutateActiveAccountConfig } = useMutateActiveAccountConfig();
    const isTronEnabledGlobally = useIsTronEnabledGlobally();
    const sdk = useAppSdk();
    const [notificationsSubscribePagePassed, setPassNotification] = useState(false);

    const onSelectNetworks = ({ tron }: { tron: boolean }) => {
        if (tron !== (defaultAccountConfig.enableTron && isTronEnabledGlobally)) {
            mutateActiveAccountConfig({
                enableTron: tron
            });
        }

        setSelectNetworksPassed(true);
    };

    useEffect(() => {
        if (infoPagePassed) {
            setWordsShown(true);
        }
    }, [infoPagePassed]);

    const onRename = async (form: { name: string; emoji: string }) => {
        const derivationIndexes = (
            createdAccount!.account as AccountMAM
        ).allAvailableDerivations.map(d => d.index);
        await renameAccount({
            id: createdAccount!.account.id,
            ...form
        });
        const newAcc = await renameDerivations({
            id: createdAccount!.account.id,
            derivationIndexes,
            emoji: form.emoji
        });

        setEditNamePagePassed(true);
        setCreatedAccount({
            account: newAcc,
            childrenMnemonics: createdAccount!.childrenMnemonics
        });
    };

    useEffect(() => {
        setTimeout(() => {
            TonKeychainRoot.generate().then(value => setMnemonic(value.mnemonic));
        }, 1500);
    }, []);

    useEffect(() => {
        if (mnemonic) {
            setTimeout(() => {
                setCreatingAnimationPassed(true);
            }, 1500);
        }
    }, [mnemonic]);

    const { onOpen: openConfirmDiscard } = useConfirmDiscardNotification();
    const { navigateHome } = useContext(AddWalletContext);
    const onBack = useMemo(() => {
        if (!infoPagePassed) {
            if (!wordsShown) {
                return navigateHome;
            }
            return () =>
                openConfirmDiscard({
                    onClose: discard => {
                        if (discard) {
                            navigateHome?.();
                        }
                    }
                });
        }

        if (!wordsPagePassed) {
            return () => setInfoPagePassed(false);
        }

        if (!createdAccount) {
            return () => setWordsPagePassed(false);
        }

        if (editNamePagePassed && !selectNetworksPassed) {
            return () => setEditNamePagePassed(false);
        }

        return undefined;
    }, [
        wordsShown,
        openConfirmDiscard,
        navigateHome,
        infoPagePassed,
        wordsPagePassed,
        createdAccount,
        editNamePagePassed,
        selectNetworksPassed
    ]);
    useSetNotificationOnBack(onBack);

    const onCloseInterceptor = useMemo<OnCloseInterceptor>(() => {
        if (!wordsShown) {
            return undefined;
        }

        if (createdAccount) {
            return undefined;
        }

        return (closeModal, cancelClose) => {
            openConfirmDiscard({
                onClose: discard => {
                    if (discard) {
                        closeModal();
                    } else {
                        cancelClose();
                    }
                }
            });
        };
    }, [wordsShown, openConfirmDiscard, createdAccount]);
    useSetNotificationOnCloseInterceptor(onCloseInterceptor);

    if (!mnemonic) {
        return <IconPage icon={<GearLottieIcon />} title={t('create_wallet_generating')} />;
    }

    if (!creatingAnimationPassed) {
        return <IconPage icon={<CheckLottieIcon />} title={t('create_wallet_generated')} />;
    }

    if (!infoPagePassed) {
        return (
            <IconPage
                icon={<WriteLottieIcon />}
                title={t('create_wallet_title')}
                description={t('create_wallet_caption')}
                button={
                    <NotificationFooterPortal>
                        <NotificationFooter>
                            <Button
                                size="large"
                                fullWidth
                                primary
                                marginTop
                                onClick={() => setInfoPagePassed(true)}
                            >
                                {t('continue')}
                            </Button>
                        </NotificationFooter>
                    </NotificationFooterPortal>
                }
            />
        );
    }

    if (!wordsPagePassed) {
        return <Words mnemonic={mnemonic} onCheck={() => setWordsPagePassed(true)} />;
    }

    if (!createdAccount) {
        return (
            <Check
                mnemonic={mnemonic}
                onConfirm={() => {
                    createWalletsAsync({
                        mnemonic,
                        selectedDerivations: [0],
                        selectAccount: true
                    }).then(setCreatedAccount);
                }}
                isLoading={isCreateWalletLoading}
            />
        );
    }

    if (!editNamePagePassed) {
        return (
            <UpdateWalletName
                name={createdAccount.account.name}
                submitHandler={onRename}
                walletEmoji={createdAccount.account.emoji}
                isLoading={renameAccountLoading || renameDerivationsLoading}
                buttonText={t('continue')}
            />
        );
    }

    if (!selectNetworksPassed) {
        return <SelectWalletNetworks onContinue={onSelectNetworks} />;
    }

    if (sdk.notifications && !notificationsSubscribePagePassed) {
        return (
            <Subscribe
                mnemonicType="ton"
                wallet={createdAccount.account.activeTonWallet}
                mnemonic={createdAccount.childrenMnemonics[0]}
                onDone={() => setPassNotification(true)}
            />
        );
    }

    return <FinalView afterCompleted={afterCompleted} />;
};
