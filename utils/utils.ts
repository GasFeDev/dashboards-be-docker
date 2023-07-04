import { E_INTERNAL_SERVER, E_FATAL_SERVER } from "../constants/errors";

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function crashProvider(error: unknown) {
    const errorString = getErrorMessage(error);
    return (
        errorString.indexOf(E_INTERNAL_SERVER) !== -1 ||
        errorString.indexOf(E_FATAL_SERVER) !== -1
    );
}