import { useQuery } from '@tanstack/react-query';
import { Account } from '@tonkeeper/core/dist/entries/account';
import { throttle } from '@tonkeeper/core/dist/utils/common';
import { Analytics, AnalyticsGroup, toWalletType } from '@tonkeeper/uikit/dist/hooks/analytics';
import { QueryKey } from '@tonkeeper/uikit/dist/libs/queryKey';
import { useEffect } from 'react';
import { useActiveTonNetwork } from '@tonkeeper/uikit/dist/state/wallet';
import { getTabletOS, TABLET_APPLICATION_ID } from "./appSdk";
import { AptabaseWeb } from "@tonkeeper/uikit/dist/hooks/analytics/aptabase-web";

export const useAppHeight = () => {
    useEffect(() => {
        const appHeight = throttle(() => {
            const doc = document.documentElement;
            doc.style.setProperty('--app-height', `${window.innerHeight}px`);
        }, 50);
        window.addEventListener('resize', appHeight);
        appHeight();

        return () => {
            window.removeEventListener('resize', appHeight);
        };
    }, []);
};

export const useAppWidth = () => {
    useEffect(() => {
        const appWidth = throttle(() => {
            const doc = document.documentElement;
            const app = (document.getElementById('root') as HTMLDivElement).childNodes.item(
                0
            ) as HTMLDivElement;

            doc.style.setProperty('--app-width', `${app.clientWidth}px`);
        }, 50);
        window.addEventListener('resize', appWidth);

        appWidth();

        return () => {
            window.removeEventListener('resize', appWidth);
        };
    }, []);
};

export const useAnalytics = (version: string, activeAccount?: Account, accounts?: Account[]) => {
    const network = useActiveTonNetwork();

    return useQuery<Analytics>(
        [QueryKey.analytics],
        async () => {
            const tracker = new AnalyticsGroup(
                  new AptabaseWeb(
                    import.meta.env.VITE_APP_APTABASE_HOST,
                    import.meta.env.VITE_APP_APTABASE,
                    version
                  )
            );

            tracker.init({
                application: 'Tablet',
                walletType: toWalletType(activeAccount?.activeTonWallet),
                activeAccount: activeAccount!,
                accounts: accounts!,
                network,
                version,
                platform: `${TABLET_APPLICATION_ID}-${await getTabletOS()}`
            });

            return tracker;
        },
        { enabled: accounts != null && activeAccount !== undefined }
    );
};
