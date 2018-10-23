import { TNSHttpFormDataParam, TNSHttpFormDataRequestOptions } from "./index";
import { Common } from "./TNSHttpFormData.common";


export class TNSHttpFormData extends Common {
    constructor() {
        super();
    }

    post(url: string, params: Array<TNSHttpFormDataParam>, options?: TNSHttpFormDataRequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            let multipartFormData = OMGMultipartFormData.new();    
            for(let param of params) {
                if(param.fileName && param.contentType) {
                    multipartFormData.addFileParameterNameFilenameContentType(
                        param.data, param.parameterName, param.fileName, param.contentType);    
                } else {
                    multipartFormData.addTextParameterName(param.data, param.parameterName);
                }
            }

            let request: NSMutableURLRequest = OMGHTTPURLRQ.POSTError(url, multipartFormData);
            if (options && options.headers) {
                for(let k in options.headers) {
                    //https://stackoverflow.com/a/4265260
                    request.addValueForHTTPHeaderField(options.headers[k], k);
                }
                // Log the output to make sure our new headers are there    
                console.log(request.allHTTPHeaderFields);
            }       
            NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
                request, NSOperationQueue.currentQueue, (response, data, error) => {
                    if(error) {
                        reject(error);
                        return;
                    }
                    const httpResponse: NSHTTPURLResponse = <NSHTTPURLResponse>response;
                    resolve(httpResponse);
                });
        });
    }
}