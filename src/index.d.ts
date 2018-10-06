import { Common } from './TNSHttpFormData.common';

export declare class TNSHttpFormData extends Common {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here
  post(url: string, params: Array<TNSHttpFormDataParam>): Promise<TNSHttpFormDataResponse>;
}

export interface TNSHttpFormDataParam {
  data: any
  parameterName: string
  fileName?: string
  contentType?: string
}

export interface TNSHttpFormDataResponse {
  headers: any
  statusCode: number
  statusMessage: string
  body: any
}