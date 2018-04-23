import { TNSHttpFormDataParam } from "./index";


export class TNSHttpFormData {
    constructor() {

    }

    // upload(url: string, data: NSData, parameterName: string, fileName: string, contentType) {
    upload(url: string, params: Array<TNSHttpFormDataParam>): Promise<boolean> {
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
                    const httpResponse: NSHTTPURLResponse = <NSHTTPURLResponse>response;
                    switch(httpResponse.statusCode) {
                        case 200:
                            resolve(true);
                        break;
                        case 500:
                            reject('Something went wrong on server');
                        break;
                        default:
                            resolve(false);
                        break;
                    } 
                });
        });
    }
}