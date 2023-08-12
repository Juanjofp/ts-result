import { Result } from '../../src/main';

const BasicError = Result.matchableError(() => {
    return {
        code: 'ErroBasicCode'
    } as const;
});

const CompleteError = Result.matchableError(() => {
    return {
        code: 'ErrorCompleteCode',
        message: 'Message of complete error'
    } as const;
});

const ComplexError = Result.matchableError((filename: string, path: string) => {
    return {
        code: 'ERR_LOAD_FILE_DATABASE',

        message: `Error loading file database ${filename} at ${path}`,

        payload: {
            filename,

            path
        }
    } as const;
});

const AnotherError = Result.matchableError(
    (data: Record<string, unknown>, filename: string, path: string) => {
        return {
            code: 'ERR_SAVE_FILE_DATABASE',

            message: `Error saving ${JSON.stringify(
                data
            )} in file database ${filename} at ${path}`,

            payload: {
                filename,

                path,

                data
            }
        } as const;
    }
);

export const Errors = {
    BasicError,
    CompleteError,
    ComplexError,
    AnotherError
} as const;
