/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: support@tonkeeper.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface AccountInfoByStateInit
 */
export interface AccountInfoByStateInit {
    /**
     * 
     * @type {string}
     * @memberof AccountInfoByStateInit
     */
    publicKey: string;
    /**
     * 
     * @type {string}
     * @memberof AccountInfoByStateInit
     */
    address: string;
}

/**
 * Check if a given object implements the AccountInfoByStateInit interface.
 */
export function instanceOfAccountInfoByStateInit(value: object): value is AccountInfoByStateInit {
    if (!('publicKey' in value) || value['publicKey'] === undefined) return false;
    if (!('address' in value) || value['address'] === undefined) return false;
    return true;
}

export function AccountInfoByStateInitFromJSON(json: any): AccountInfoByStateInit {
    return AccountInfoByStateInitFromJSONTyped(json, false);
}

export function AccountInfoByStateInitFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountInfoByStateInit {
    if (json == null) {
        return json;
    }
    return {
        
        'publicKey': json['public_key'],
        'address': json['address'],
    };
}

export function AccountInfoByStateInitToJSON(json: any): AccountInfoByStateInit {
    return AccountInfoByStateInitToJSONTyped(json, false);
}

export function AccountInfoByStateInitToJSONTyped(value?: AccountInfoByStateInit | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'public_key': value['publicKey'],
        'address': value['address'],
    };
}

