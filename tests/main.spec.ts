import { Result } from '@src/main';

describe('Result should', () => {
    it('Create an empty result', async () => {
        const r = Result.emptyOk();

        expect(r).toEqual({ type: 'Ok', data: undefined });

        expect(Result.isOk(r)).toBe(true);

        expect(Result.isError(r)).toBe(false);

        expect(r.data).toBe(undefined);
    });

    it('Create an Ok result', async () => {
        const data = { a: 1, b: 2 };

        const r = Result.ok(data);

        expect(r).toEqual({ type: 'Ok', data });

        expect(Result.isOk(r)).toBe(true);

        expect(Result.isError(r)).toBe(false);

        expect(r.data).toBe(data);
    });

    it("Invalid errors shouldn't be errors", async () => {
        expect(Result.isError(undefined)).toBe(false);

        expect(Result.isError(null)).toBe(false);

        expect(Result.isError(0)).toBe(false);

        expect(Result.isError('message')).toBe(false);

        expect(Result.isError({})).toBe(false);

        expect(Result.isError({ type: 'error' })).toBe(false);

        expect(Result.isError({ type: 'error', error: () => undefined })).toBe(
            false
        );

        expect(Result.isError({ type: 'error', error: {} })).toBe(false);

        expect(Result.isError({ type: 'error', error: null })).toBe(false);

        expect(Result.isError({ type: 'error', error: undefined })).toBe(false);
    });

    it('invalids Ok responses should not be Ok', async () => {
        expect(Result.isOk(undefined)).toBe(false);

        expect(Result.isOk(null)).toBe(false);

        expect(Result.isOk(0)).toBe(false);

        expect(Result.isOk('message')).toBe(false);

        expect(Result.isOk({})).toBe(false);

        expect(Result.isOk({ type: 'DOMError' })).toBe(false);
    });

    it('Create a basic Err result', async () => {
        // Create a matchable error generator

        const genError = Result.matchableError(() => {
            return {
                code: 'ErroBasicCode'
            } as const;
        });

        // Create an error instance

        const err = genError();

        // Create an Err result

        const r = Result.err(err);

        expect(Result.isError(r)).toBe(true);

        expect(genError.match(r.error)).toBe(true);
    });

    it('Create a complex Err result', async () => {
        // Create a matchable error generator

        const genError = Result.matchableError((data: string) => {
            return {
                code: 'ComplexErrorCode',
                payload: {
                    data
                }
            } as const;
        });

        // Create an error instance

        const err = genError("I'm a complex error");

        // Create an Err result

        const r = Result.err(err);

        expect(Result.isError(r)).toBe(true);

        expect(genError.match(r.error)).toBe(true);
    });
});
