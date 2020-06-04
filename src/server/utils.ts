import * as Express from "express";
import {SECRET_COOKIE, VALIDATION_ERROR_STATUS_CODE} from "../shared/api";
import {AccessRight} from "../shared/access";
import {getDbDef} from "./db/db";
import {isIn} from "../shared/utils";
import {Request} from "express-serve-static-core"
import {ValidationException} from "../shared/validators/validators";
import {HttpError} from "./exceptions";
import {config} from "./config";

export interface ContentWithStatus {
    statusCode:number,
    content:any
}

// Same as #returnPromiseWithCode, code being known in advance
export function returnPromise(res: Express.Response, promise: Promise<{}>, code=200) {
    returnPromiseWithCode(res, promise.then(content => ({content, statusCode:code})));
}

// Handy function returing 200 and the payload result of the promise, or returning 500 on error
// It wraps the Promise API around Express API
export async function returnPromiseWithCode(res: Express.Response, promise: Promise<ContentWithStatus>) {
    try {
        let result = await promise;
        console.debug("status", result.statusCode, "content", result.content);
        res.status(result.statusCode).send(result.content);
    } catch (error) {
        console.error("Error occured in promise : ", error);

        if (error instanceof ValidationException) {

            // Send list of errors back to client, with custom error codes
            res.status(VALIDATION_ERROR_STATUS_CODE).send(error.validationErrors);

        } else if (error instanceof HttpError) {

            res.status(error.code).send(error.message);

        } else {

            res.status(501).send(error);

        }
    }
}

export async function getAccessRights(dbStr: string, pass:string) {
    let dbDef = await getDbDef(dbStr);
    if (pass) {
        if (pass==dbDef.secret) {
            return [AccessRight.DELETE, AccessRight.EDIT, AccessRight.ADMIN, AccessRight.VIEW];
        } else {
            // FIXME: return nice 403, localized page
            throw new HttpError(403, "Bad password");
        }
    } else {
        // FIXME default rights defined in the DB
        if (dbDef.anonRights) {
            return dbDef.anonRights;
        } else {
            // Default anonymous user access : wiki
            return [AccessRight.EDIT, AccessRight.VIEW];
        }
    }
}

export async function requiresRight(req:Request, right : AccessRight) {
    let rights = await getAccessRights(
        dbNameSSR(req),
        req.cookies[SECRET_COOKIE(dbNameSSR(req))]);
    if (isIn(rights, right)) {
        return true;
    } else {
        throw new HttpError(403, "Forbidden");
    }
}


// Resursively applies a function on a JSON tree
export function traverse(o: any, fn: (obj: any, prop: string, value: any) => void) {
    for (const i in o) {
        fn.apply(null, [o, i, o[i]]);
        if (o[i] !== null && typeof(o[i]) === 'object') {
            traverse(o[i], fn);
        }
    }
}

// XXX we might not need this : we still pass dbname to api REST services, even for single base mode
export function dbNameSSR(req:Request) {
    if (config.SINGLE_BASE) {
        return config.SINGLE_BASE
    } else {
        return req.params.db_name;
    }
}

