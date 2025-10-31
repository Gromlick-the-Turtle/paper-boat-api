export default class BadRequestError extends Error {
    status = 400;
    prefix = "Bad Request";
}