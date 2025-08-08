export default class Forbidden extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'Forbidden';
        Error.captureStackTrace(this, this.constructor);
    }
}
