import AbstractApplicationException, { ErrorType } from './abstract-application.exception';

export default class ResourceNotFoundException extends AbstractApplicationException {
    readonly error: ErrorType = 'Not Found';
    readonly code = 404;
}
