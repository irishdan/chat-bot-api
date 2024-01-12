import AbstractApplicationException, { ErrorType } from './abstract-application.exception';

export default class SubResourceMismatchException extends AbstractApplicationException {
    readonly error: ErrorType = 'Bad Request';
    readonly code: number = 400;
}
