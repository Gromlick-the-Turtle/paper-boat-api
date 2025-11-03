export default class ForbiddenError extends Error {
    status = 403;
    prefix = "Forbidden";
}