// HTML
import {IState} from "./redux/index";
import {AccessRight} from "./access";
import {Record} from "./model/instances";
import {DbDefinition} from "../server/db/db";
import {DefaultMessages} from "./i18n/messages";

export const BASE_DB_PATH = "/db/";
export const CREATE_DB_PATH = "/create-db";
export const RECORDS_PATH = BASE_DB_PATH + ":db_name";
export const SINGLE_RECORD_PATH = BASE_DB_PATH + ":db_name/:id";


export const LANG_COOKIE_NAME = "lang";

export const COOKIE_DURATION = 31 * 24 * 3600 * 1000 // one month;

export function dbPassCookieName(dbName:string) {
    return `_db_pass_${dbName}`;
}

export function recordsLink(dbName: string) {
    return RECORDS_PATH.replace(':db_name', dbName);
}

export function singleRecordLink(dbName: string, recordId:string) {
    return SINGLE_RECORD_PATH
        .replace(':db_name', dbName)
        .replace(":id", recordId);
}


// REST
export const ADD_ITEM_URL = "/api/:db_name/create";
export const UPDATE_ITEM_URL = "/api/:db_name/update/";
export const DELETE_ITEM_URL = "/api/:db_name/delete/:id";
export const GET_ITEM_URL = "/api/:db_name/item/:id";
export const GET_ITEMS_URL = "/api/:db_name/items/";
export const GET_DB_DEFINITION_URL = "/api/:db_name/definition";

export const CREATE_DB_URL = "/api/create-db/";
export const CHECK_DB_NAME = "/api/check-db/:db_name";
export const UPDATE_DB_URL = "/api/update-db/:db_name";
export const UPDATE_SCHEMA_URL = "/api/update-schema/:db_name";


export const DOWNLOAD_XLS_URL  = "/xls/:db_name";
export const DOWNLOAD_JSON_URL  = "/json/:db_name";

export const VALIDATION_STATUS_CODE = 444;

// Marshalled JSN within the page
export interface IMarshalledContext {
    state: IState,
    messages : DefaultMessages,
    env:string,
    lang:string}

// Generic reader interface, implemented directly with DB access for SSR, or as rest client for Browser
export interface DataFetcher {
    getRecord(dbName: string, id : string) : Promise<Record>;
    getRecords(dbName: string) : Promise<Record[]>;
    getDbDefinition(dbName:string) : Promise<DbDefinition>;
}