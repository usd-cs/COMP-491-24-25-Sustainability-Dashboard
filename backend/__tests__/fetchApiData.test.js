/**
 * @file fetchApiData.test.js
 * @description Unit tests for fetching energy data from the Bloom Energy API and store it in the database.
 * Tests include cases for successful data fetching and storage, error handling, and API request failures.
 */

import axios from 'axios';
import { query } from '../database_connection.js';
import dotenv from 'dotenv';
import { fetchAndStoreEnergyData } from '../auth/upload/fetchApiData.js';

jest.mock('axios');
jest.mock('../database_connection.js');
dotenv.config();

describe('fetchApiData', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = process.env;
        process.env = {
            ...originalEnv,
            TOKEN_URL: 'http://mock-token-url',
            BLOOM_USERNAME: 'mock-username',
            BLOOM_PASSWORD: 'mock-password',
            BLOOM_SITE_ID: 'http://mock-site-id-url',
            BLOOM_SITE_DATA: 'http://mock-site-data-url'
        };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchAndStoreEnergyData', () => {
        it('should fetch and store energy data successfully', async () => {
            const mockTokenResponse = { data: { token: 'mock-token' } };
            const mockSiteIDResponse = { data: [{ id: 'mock-site-id' }] };
            const mockSiteDataResponse = {
                data: {
                    data: [{
                        recordedat: '2025-03-05T00:00:00Z',
                        total_output_factor: 90,
                        efficiency: 85,
                        energy: 1000,
                        fuel: 500,
                        co2_reduction: 200,
                        co2_production: 300,
                        nox_reduction: 50,
                        nox_production: 60,
                        so2_reduction: 10,
                        so2_production: 20
                    }]
                }
            };

            axios.post.mockResolvedValueOnce(mockTokenResponse);
            axios.get.mockResolvedValueOnce(mockSiteIDResponse);
            axios.post.mockResolvedValueOnce(mockSiteDataResponse);
            query.mockResolvedValueOnce();

            const result = await fetchAndStoreEnergyData();

            expect(result).toBe(true);
            expect(axios.post).toHaveBeenCalledTimes(2);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(query).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when fetching site ID', async () => {
            const mockTokenResponse = { data: { token: 'mock-token' } };
            axios.post.mockResolvedValueOnce(mockTokenResponse);
            axios.get.mockRejectedValueOnce(new Error('Site ID fetch error'));

            const result = await fetchAndStoreEnergyData();

            expect(result).toBe(false);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(query).not.toHaveBeenCalled();
        });

        it('should handle undefined site ID response', async () => {
            const mockTokenResponse = { data: { token: 'mock-token' } };
            axios.post.mockResolvedValueOnce(mockTokenResponse);
            axios.get.mockResolvedValueOnce(undefined);

            const result = await fetchAndStoreEnergyData();

            expect(result).toBe(false);
            expect(axios.post).toHaveBeenCalledTimes(0);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(query).not.toHaveBeenCalled();
        });

        it('should handle errors when fetching site data', async () => {
            const mockTokenResponse = { data: { token: 'mock-token' } };
            const mockSiteIDResponse = { data: [{ id: 'mock-site-id' }] };
            axios.post.mockResolvedValueOnce(mockTokenResponse);
            axios.get.mockResolvedValueOnce(mockSiteIDResponse);
            axios.post.mockRejectedValueOnce(new Error('Site data fetch error'));

            const result = await fetchAndStoreEnergyData();

            expect(result).toBe(false);
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(query).not.toHaveBeenCalled();
        });

        it('should handle errors when storing data in the database', async () => {
            const mockTokenResponse = { data: { token: 'mock-token' } };
            const mockSiteIDResponse = { data: [{ id: 'mock-site-id' }] };
            const mockSiteDataResponse = {
                data: {
                    data: [{
                        recordedat: '2025-03-05T00:00:00Z',
                        total_output_factor: 90,
                        efficiency: 85,
                        energy: 1000,
                        fuel: 500,
                        co2_reduction: 200,
                        co2_production: 300,
                        nox_reduction: 50,
                        nox_production: 60,
                        so2_reduction: 10,
                        so2_production: 20
                    }]
                }
            };

            axios.post.mockResolvedValueOnce(mockTokenResponse);
            axios.get.mockResolvedValueOnce(mockSiteIDResponse);
            axios.post.mockResolvedValueOnce(mockSiteDataResponse);
            query.mockRejectedValueOnce(new Error('Database error'));

            const result = await fetchAndStoreEnergyData();

            expect(result).toBe(false);
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(query).toHaveBeenCalledTimes(0);
        });
    });
});