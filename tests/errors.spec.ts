import { Result } from '@src/main';
import { Errors } from './test-utils';

describe('Result should', () => {
    it('Handle basic error', async () => {
        const basicError = Errors.BasicError();

        expect(Errors.BasicError.match(basicError)).toBe(true);
    });

    it('Handle complete error', async () => {
        const completeError = Errors.CompleteError();

        expect(Errors.CompleteError.match(completeError)).toBe(true);

        expect(completeError.message).toBe('Message of complete error');
    });

    it('Handle complex error', async () => {
        expect.assertions(4);

        function doSomething() {
            return Result.err(
                Errors.ComplexError('file.json', '/path/to/file.json')
            );
        }

        const complexError = doSomething();

        if (!Result.isError(complexError)) return;

        expect(Errors.ComplexError.match(complexError.error)).toBe(true);

        expect(Errors.BasicError.match(complexError.error)).toBe(false);

        if (Errors.ComplexError.match(complexError.error)) {
            expect(complexError.error.message).toBe(
                'Error loading file database file.json at /path/to/file.json'
            );

            expect(complexError.error.payload).toEqual({
                filename: 'file.json',
                path: '/path/to/file.json'
            });
        }
    });

    it('Handle another error', async () => {
        expect.assertions(6);

        const data = { a: 1, b: 2, c: 3 };

        function doSomething(data: Record<string, unknown>) {
            return Result.err(
                Errors.AnotherError(data, 'file.json', '/path/to/file.json')
            );
        }

        const anotherError = doSomething(data);

        if (!Result.isError(anotherError)) return;

        expect(Errors.BasicError.match(anotherError.error)).toBe(false);

        expect(Errors.ComplexError.match(anotherError.error)).toBe(false);

        expect(Errors.AnotherError.match(anotherError.error)).toBe(true);

        if (Errors.AnotherError.match(anotherError.error)) {
            expect(anotherError.error.payload.filename).toEqual('file.json');

            expect(anotherError.error.payload.path).toEqual(
                '/path/to/file.json'
            );

            expect(anotherError.error.payload.data).toEqual(data);
        }
    });
});
