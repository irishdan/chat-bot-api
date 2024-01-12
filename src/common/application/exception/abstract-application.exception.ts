export type ErrorType = 'Not Found' | 'Bad Request';

export default abstract class AbstractApplicationException extends Error {
    abstract readonly error: ErrorType;
    abstract readonly code: number;
}
