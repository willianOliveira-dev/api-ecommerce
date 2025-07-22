import fs from 'node:fs/promises';
import { createWriteStream, type WriteStream } from 'node:fs';
import path from 'node:path';

const createLogs = async (): Promise<WriteStream | undefined> => {
    try {
        const logFolder: string = path.join('./src', 'logs');
        try {
            await fs.access(logFolder, fs.constants.F_OK | fs.constants.W_OK);
        } catch (err: unknown) {
            await fs.mkdir(logFolder, { recursive: true });
        }
        const logFile: WriteStream = createWriteStream(
            path.join(logFolder, 'access.log'),
            { flags: 'a' }
        );
        return logFile;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        }
    }
};

export default createLogs;
