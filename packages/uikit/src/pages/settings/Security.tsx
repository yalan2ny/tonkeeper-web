import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InnerBody } from '../../components/Body';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SubHeader } from '../../components/SubHeader';
import { Label1 } from '../../components/Text';
import { ChangePasswordNotification } from '../../components/create/ChangePassword';
import { Switch } from '../../components/fields/Switch';
import { KeyIcon, LockIcon } from '../../components/settings/SettingsIcons';
import { SettingsItem, SettingsList } from '../../components/settings/SettingsList';
import { useTranslation } from '../../hooks/translation';
import { useIsFullWidthMode } from '../../hooks/useIsFullWidthMode';
import { AppRoute, SettingsRoute } from '../../libs/routes';
import { useIsActiveWalletKeystone } from '../../state/keystone';
import { useIsActiveWalletLedger } from '../../state/ledger';
import {
    useCanPromptTouchId,
    useLookScreen,
    useMutateLookScreen,
    useMutateTouchId,
    useTouchIdEnabled
} from '../../state/password';
import { useIsActiveWalletWatchOnly, useIsPasswordSet } from '../../state/wallet';
import styled from 'styled-components';

const LockSwitch = () => {
    const { t } = useTranslation();

    const isPasswordSet = useIsPasswordSet();

    const { data } = useLookScreen();
    const { mutate: toggleLock } = useMutateLookScreen();

    if (isPasswordSet) {
        return (
            <ListBlock>
                <ListItem hover={false}>
                    <ListItemPayload>
                        <Label1>{t('Lock_screen')}</Label1>
                        <Switch checked={!!data} onChange={toggleLock} />
                    </ListItemPayload>
                </ListItem>
            </ListBlock>
        );
    } else {
        return <></>;
    }
};

const Label1Capitalised = styled(Label1)`
    text-transform: capitalize;
`;

const TouchIdSwitch = () => {
    const { t } = useTranslation();
    const { data: canPrompt } = useCanPromptTouchId();

    const { data: touchIdEnabled } = useTouchIdEnabled();
    const { mutate } = useMutateTouchId();

    if (!canPrompt) {
        return null;
    }

    return (
        <ListBlock>
            <ListItem hover={false}>
                <ListItemPayload>
                    <Label1Capitalised>{t('biometry_default')}</Label1Capitalised>
                    <Switch checked={!!touchIdEnabled} onChange={mutate} />
                </ListItemPayload>
            </ListItem>
        </ListBlock>
    );
};

const ChangePassword = () => {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);

    const isPasswordSet = useIsPasswordSet();
    const items = useMemo(() => {
        const i: SettingsItem[] = [
            {
                name: t('Change_password'),
                icon: <LockIcon />,
                action: () => setOpen(true)
            }
        ];
        return i;
    }, []);

    if (isPasswordSet) {
        return (
            <>
                <SettingsList items={items} />
                <ChangePasswordNotification isOpen={isOpen} handleClose={() => setOpen(false)} />
            </>
        );
    } else {
        return <></>;
    }
};

const ShowPhrases = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isLedger = useIsActiveWalletLedger();
    const isKeystone = useIsActiveWalletKeystone();
    const isReadOnly = useIsActiveWalletWatchOnly();
    const isFullWidthMode = useIsFullWidthMode();

    const items = useMemo(() => {
        const i: SettingsItem[] = [
            {
                name: t('settings_backup_seed'),
                icon: <KeyIcon />,
                action: () => navigate(AppRoute.settings + SettingsRoute.recovery)
            }
        ];
        return i;
    }, []);

    if (isLedger || isKeystone || isReadOnly || isFullWidthMode) {
        return <></>;
    }

    return <SettingsList items={items} />;
};

export const SecuritySettings = () => {
    const { t } = useTranslation();
    return (
        <>
            <SubHeader title={t('settings_security')} />
            <InnerBody>
                <LockSwitch />
                <TouchIdSwitch />
                <ChangePassword />
                <ShowPhrases />
            </InnerBody>
        </>
    );
};

export const useShouldShowSecurityPage = () => {
    const { data: canPromptTouchId } = useCanPromptTouchId();
    const isPasswordSet = useIsPasswordSet();

    const isLedger = useIsActiveWalletLedger();
    const isKeystone = useIsActiveWalletKeystone();
    const isReadOnly = useIsActiveWalletWatchOnly();
    const isFullWidthMode = useIsFullWidthMode();
    const hidePhrasePage = isLedger || isKeystone || isReadOnly || isFullWidthMode;

    return canPromptTouchId || isPasswordSet || !hidePhrasePage;
};
