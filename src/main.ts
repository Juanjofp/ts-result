// ~~~~~~ Result like rust

// It create a custom error domain, with a custom error creator
// and a custom error matcher.

export type DomError = {
    code: string;
    message?: string;
};

function isDomError(error: unknown): error is DomError {
    if (!error) return false;

    if (typeof error !== 'object') return false;

    if (!('code' in error)) return false;

    return true;
}

// ~~~~~~ Error matchable

type ErrorCreator = (...args: unknown[]) => DomError;

type ErrorMatchableCreator<EC extends ErrorCreator = ErrorCreator> = EC & {
    match(error: DomError): error is ReturnType<EC>;
};

type ErrorMatchable = ReturnType<ErrorMatchableCreator>;

function createECMatchableCreator<EC extends ErrorCreator = ErrorCreator>(
    errorCreator: EC
): ErrorMatchableCreator<EC>;

function createECMatchableCreator<EC extends ErrorCreator = ErrorCreator>(
    errorCreator: EC
) {
    const matchableErrorCreator = Object.assign(errorCreator, {
        match: (action: DomError) => errorCreator().code === action.code
    });

    return matchableErrorCreator;
}

// ~~~~~~ Result

// Resut is a type that allows to return a value or an error matchable

// Err is wrapper for a ErrorMatchable

export type Err<E extends ErrorMatchable> = {
    type: 'DomError';
    error: E;
};

// Ok is a wrapper for a value

export type Ok<T> = {
    type: 'Ok';
    data: T;
};

export type Result<T, E extends ErrorMatchable = ErrorMatchable> =
    | Ok<T>
    | Err<E>;

function ok<T>(value: T): Ok<T> {
    return {
        type: 'Ok',
        data: value
    } as const;
}

function err<E extends ErrorMatchable = ErrorMatchable>(error: E): Err<E> {
    return {
        type: 'DomError',
        error
    } as const;
}

function isError<E extends DomError>(result: unknown): result is Err<E> {
    if (!result) return false;

    if (typeof result !== 'object') return false;

    if (!('type' in result)) return false;

    if (!('error' in result)) return false;

    if (!isDomError(result.error)) return false;

    return result.type === 'DomError';
}

function isOk<T>(result: unknown): result is Ok<T> {
    if (!result) return false;

    if (typeof result !== 'object') return false;

    if (!('type' in result)) return false;

    if (!('data' in result)) return false;

    return result.type === 'Ok';
}

export const Result = {
    ok,

    emptyOk: () => ok(undefined),

    err,

    matchableError: createECMatchableCreator,

    isError,

    isOk
} as const;
