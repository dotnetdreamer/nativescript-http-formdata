import { TNSHttpFormDataParam } from "./index";
import { Common } from "./TNSHttpFormData.common";


export class TNSHttpFormData extends Common {
    constructor() {
        super();
    }

    post(url: string, params: Array<TNSHttpFormDataParam>): Promise<boolean> {
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
            NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
                request, NSOperationQueue.currentQueue, (response, data, error) => {
                    if(error) {
                        reject(error);
                        return;
                    }
                    resolve(<NSHTTPURLResponse>response);
                });
        });
    }
}