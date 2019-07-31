import { Common } from './TNSHttpFormData.common';
import { TNSHttpFormDataParam, TNSHttpFormDataRequestOptions, TNSHttpFormDataResponse } from './index';
export declare class TNSHttpFormData extends Common {
    constructor();
    post(url: string, params: Array<TNSHttpFormDataParam>, options?: TNSHttpFormDataRequestOptions): Promise<TNSHttpFormDataResponse>;
}
