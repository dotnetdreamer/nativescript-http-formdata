export class TNSHttpFormData {
    upload(url: string, params: Array<TNSHttpFormDataParam>): Promise<boolean>;
}

export interface TNSHttpFormDataParam {
    data: any
    parameterName: string
    fileName: string
    contentType: string
}