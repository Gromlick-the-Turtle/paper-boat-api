export default class ServerError extends Error {
    status = 500;
    prefix = "Server Error";
}