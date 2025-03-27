/**
 * @file autoDB_refresh.test.js
 * @description Unit tests for the `autoDB_refresh` script, which automates updating the database with Bloom Energy API data at set intervals.
 * Tests include cases for scheduling the cron job, calling the fetchAndStoreEnergyData function, and logging messages.
 */

import cron from 'node-cron';
import { describe, expect, it, vi } from "vitest";
import { fetchAndStoreEnergyData } from '../auth/upload/fetchApiData.js';
import '../auth/upload/schedulers/autoDB_refresh.js';

vi.mock('node-cron');
vi.mock('../auth/upload/fetchApiData.js');

describe('autoDB_refresh', () => {
    it('should schedule a cron job to run every day at midnight', () => {
        expect(cron.schedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
    });

    it('should call fetchAndStoreEnergyData when the cron job runs', async () => {
        const scheduledTask = cron.schedule.mock.calls[0][1];
        await scheduledTask();
        expect(fetchAndStoreEnergyData).toHaveBeenCalled();
    });

    it('should log a message when the scheduled task starts and completes successfully', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
        const scheduledTask = cron.schedule.mock.calls[0][1];
        await scheduledTask();
        expect(console.log).toHaveBeenCalledWith('Running scheduled task: fetchAndStoreEnergyData');
        expect(console.log).toHaveBeenCalledWith('Scheduled task completed successfully');
    });

    it('should log an error message if the scheduled task fails', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        fetchAndStoreEnergyData.mockImplementationOnce(() => {
            throw new Error('Test error');
        });
        const scheduledTask = cron.schedule.mock.calls[0][1];
        await scheduledTask();
        expect(console.error).toHaveBeenCalledWith('Error running scheduled task:', 'Test error');
    });
});
