import { TNSHttpFormDataParam, TNSHttpFormDataResponse } from "./index";
import { Common } from "./TNSHttpFormData.common";

export class TNSHttpFormData extends Common {
    constructor() {
        super();
    }

    post(url: string, params: Array<TNSHttpFormDataParam>): Promise<TNSHttpFormDataResponse> {
        return new Promise((resolve, reject) => {
            let multipartFormData = OMGMultipartFormData.new();
            for (let param of params) {
                if (param.fileName && param.contentType) {
                    multipartFormData.addFileParameterNameFilenameContentType(
                        param.data, param.parameterName, param.fileName, param.contentType);
                } else {
                    multipartFormData.addTextParameterName(param.data, param.parameterName);
                }
            }

            let request: NSMutableURLRequest = OMGHTTPURLRQ.POSTError(url, multipartFormData);
            NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
                request, NSOperationQueue.currentQueue, (response: NSHTTPURLResponse, data: NSData, error: NSError) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    let responseData: TNSHttpFormDataResponse = {
                        headers: response.allHeaderFields,
                        statusCode: response.statusCode,
                        statusMessage: NSHTTPURLResponse.localizedStringForStatusCode(response.statusCode),
                        body: JSON.parse(NSString.alloc().initWithDataEncoding(data, NSASCIIStringEncoding).description)
                    }
                    resolve(responseData);
                });
        });
    }
}