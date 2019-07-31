import { TNSHttpFormDataParam, TNSHttpFormDataRequestOptions, TNSHttpFormDataResponse } from "./index";
import { Common } from "./TNSHttpFormData.common";
export declare class TNSHttpFormData extends Common {
    constructor();
    post(url: string, params: Array<TNSHttpFormDataParam>, options?: TNSHttpFormDataRequestOptions): Promise<TNSHttpFormDataResponse>;
}
