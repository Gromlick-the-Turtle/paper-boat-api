export default class NotFoundError extends Error {
    status = 404;
    prefix = "Not Found";
}