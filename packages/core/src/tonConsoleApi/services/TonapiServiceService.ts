/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppTier } from '../models/AppTier';
import type { LiteproxyKey } from '../models/LiteproxyKey';
import type { LiteproxyPrivateKey } from '../models/LiteproxyPrivateKey';
import type { LiteproxyTier } from '../models/LiteproxyTier';
import type { Ok } from '../models/Ok';
import type { ProjectLiteproxyTierDetail } from '../models/ProjectLiteproxyTierDetail';
import type { ProjectTonApiToken } from '../models/ProjectTonApiToken';
import type { Tier } from '../models/Tier';
import type { TokenCapability } from '../models/TokenCapability';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TonapiServiceService {
    /**
     * Get project TonAPI tokens
     * @param projectId Project ID
     * @returns any Project TonAPI tokens
     * @throws ApiError
     */
    public static getProjectTonApiTokens(
        projectId: number,
    ): CancelablePromise<{
        items: Array<ProjectTonApiToken>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/tokens',
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Generate project TonAPI token
     * @param projectId Project ID
     * @param requestBody Data that is expected
     * @returns any Project TonAPI token
     * @throws ApiError
     */
    public static generateProjectTonApiToken(
        projectId: number,
        requestBody?: {
            name: string;
            limit_rps?: number | null;
            origins?: Array<string>;
            capabilities?: Array<TokenCapability>;
        },
    ): CancelablePromise<{
        token: ProjectTonApiToken;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/services/tonapi/generate/token',
            query: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Update project TonAPI token
     * @param projectId Project ID
     * @param id Token ID
     * @param requestBody Data that is expected
     * @returns Ok Ok
     * @throws ApiError
     */
    public static updateProjectTonApiToken(
        projectId: number,
        id: number,
        requestBody?: {
            name: string;
            limit_rps?: number | null;
            origins?: Array<string>;
            capabilities?: Array<TokenCapability>;
        },
    ): CancelablePromise<Ok> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/services/tonapi/token/{id}',
            path: {
                'id': id,
            },
            query: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Delete project TonAPI token
     * @param projectId Project ID
     * @param id Token ID
     * @returns Ok Ok
     * @throws ApiError
     */
    public static deleteProjectTonApiToken(
        projectId: number,
        id: number,
    ): CancelablePromise<Ok> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/services/tonapi/token/{id}',
            path: {
                'id': id,
            },
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get project TonAPI tier
     * @param projectId Project ID
     * @returns any Project tier
     * @throws ApiError
     */
    public static getProjectTonApiTier(
        projectId: number,
    ): CancelablePromise<{
        tier: AppTier;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/tier',
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Update project TonAPI tier
     * @param projectId Project ID
     * @param requestBody Data that is expected
     * @returns any Project tier
     * @throws ApiError
     */
    public static updateProjectTonApiTier(
        projectId: number,
        requestBody?: {
            tier_id: number;
        },
    ): CancelablePromise<{
        tier: AppTier;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/services/tonapi/tier',
            query: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Valid change TonAPI tier for project
     * @param id Tier ID
     * @param projectId Project ID
     * @returns any Valid change TonAPI tier for project
     * @throws ApiError
     */
    public static validChangeTonApiTier(
        id: number,
        projectId: number,
    ): CancelablePromise<{
        /**
         * is valid
         */
        valid: boolean;
        unspent_money?: number;
        details?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/tier/valid/buy/{id}',
            path: {
                'id': id,
            },
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get active TonAPI tiers
     * @returns any Active TonAPI tiers
     * @throws ApiError
     */
    public static getTonApiTiers(): CancelablePromise<{
        items: Array<Tier>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/tiers',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get project TonAPI stats
     * To filter the stats, are expected start and end query parameters in unix format, where end is the day closer to the current one, for example start=1675958400&end=1676908800,
     * @param projectId Project ID
     * @param start Start date
     * @param end End date
     * @param step Step
     * @param detailed Show more detailed information
     * @param dashboard
     * @returns any Project TonApi stats
     * @throws ApiError
     */
    public static getProjectTonApiStats(
        projectId: number,
        start: number,
        end: number,
        step?: number,
        detailed?: boolean,
        dashboard: 'tonapi_token' | 'tonapi_webhook' = 'tonapi_token',
    ): CancelablePromise<{
        stats: any;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/stats',
            query: {
                'project_id': projectId,
                'start': start,
                'end': end,
                'step': step,
                'detailed': detailed,
                'dashboard': dashboard,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get private keys for the liteproxy server
     * @param server Liteproxy server address
     * @returns any Private keys for the liteproxy server
     * @throws ApiError
     */
    public static adminGetLiteproxyPrivateKeys(
        server: string,
    ): CancelablePromise<{
        keys: Array<LiteproxyPrivateKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/liteproxy/private_keys',
            query: {
                'server': server,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Create liteproxy keys
     * @param projectId Project ID
     * @returns any Keys for connecting to liteproxy servers
     * @throws ApiError
     */
    public static createLiteproxyKeys(
        projectId: number,
    ): CancelablePromise<{
        keys: Array<LiteproxyKey>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/services/tonapi/liteproxy/keys',
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get keys for connecting to liteproxy servers
     * @param projectId Project ID
     * @returns any Keys for connecting to liteproxy servers
     * @throws ApiError
     */
    public static getLiteproxyKeys(
        projectId: number,
    ): CancelablePromise<{
        keys: Array<LiteproxyKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/liteproxy/keys',
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get list of active tiers for the liteproxy server
     * @returns any Active tiers for the liteproxy server
     * @throws ApiError
     */
    public static getLiteproxyTiers(): CancelablePromise<{
        tiers: Array<LiteproxyTier>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/liteproxy/tiers',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Get the current tier for liteproxy server
     * @param projectId Project ID
     * @returns any Active the project tier for the liteproxy server
     * @throws ApiError
     */
    public static getProjectLiteproxyTier(
        projectId: number,
    ): CancelablePromise<{
        tier: ProjectLiteproxyTierDetail;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/services/tonapi/liteproxy/tier',
            query: {
                'project_id': projectId,
            },
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
    /**
     * Switch to a new tier for liteproxy server
     * @param projectId Project ID
     * @param requestBody Data that is expected
     * @returns Ok Ok
     * @throws ApiError
     */
    public static updateLiteproxyTier(
        projectId: number,
        requestBody?: {
            tier_id: number;
        },
    ): CancelablePromise<Ok> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/services/tonapi/liteproxy/tier',
            query: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Something went wrong on client side`,
                403: `Access token is missing or invalid`,
                404: `The specified resource was not found`,
                500: `Something went wrong on server side`,
            },
        });
    }
}
