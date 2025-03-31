import { shell, systemPreferences, app } from 'electron';
import keytar from 'keytar';
import { Message } from '../libs/message';
import { mainStorage } from './storageService';
import { cookieJar } from './cookie';
import { tonConnectSSE } from './sseEvetns';

const service = 'tonkeeper.com';

export const handleBackgroundMessage = async (message: Message): Promise<unknown> => {
    switch (message.king) {
        case 'storage-set':
            return mainStorage.set(message.key, message.value);
        case 'storage-get':
            return mainStorage.get(message.key);
        case 'storage-set-batch':
            return mainStorage.setBatch(message.value);
        case 'storage-delete':
            return mainStorage.delete(message.key);
        case 'storage-clear':
            return mainStorage.clear();
        case 'open-page':
            return shell.openExternal(message.url);
        case 'set-keychain':
            return await keytar.setPassword(
                service,
                `Wallet-${message.publicKey}`,
                message.mnemonic
            );
        case 'get-keychain':
            return await keytar.getPassword(service, `Wallet-${message.publicKey}`);
        case 'reconnect':
            return await tonConnectSSE.reconnect();
        case 'ton-connect-send-disconnect':
            return await tonConnectSSE.sendDisconnect(message.connection);
        case 'can-prompt-touch-id':
            try {
                return !!systemPreferences?.canPromptTouchID?.();
            } catch (e) {
                console.error(e);
                return false;
            }
        case 'prompt-touch-id':
            return systemPreferences.promptTouchID(message.reason);
        case 'get-preferred-system-languages':
            return app.getPreferredSystemLanguages();
        case 'clean-cookie': {
            return cookieJar.removeAllCookies();
        }
        default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
    }
};
