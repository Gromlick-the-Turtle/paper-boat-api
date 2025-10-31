export default class UnauthorizedError extends Error {
    status = 401;
    prefix = "Unauthorized";
}