import { TNSHttpFormDataParam, TNSHttpFormDataRequestOptions, TNSHttpFormDataResponse } from "./index";
import { Common } from "./TNSHttpFormData.common";


export class TNSHttpFormData extends Common
{
    constructor()
    {
        super();
    }

    post(url: string, params: Array<TNSHttpFormDataParam>, options?: TNSHttpFormDataRequestOptions)
        : Promise<TNSHttpFormDataResponse>
    {
        return new Promise((resolve, reject) =>
        {
            let multipartFormData = OMGMultipartFormData.new();
            for (let param of params)
            {
                if (param.fileName && param.contentType)
                {
                    multipartFormData.addFileParameterNameFilenameContentType(
                        param.data, param.parameterName, param.fileName, param.contentType);
                } else
                {
                    multipartFormData.addTextParameterName(param.data, param.parameterName);
                }
            }

            let request: NSMutableURLRequest = OMGHTTPURLRQ.POSTError(url, multipartFormData);
            if (options && options.headers)
            {
                for (let k in options.headers)
                {
                    //https://stackoverflow.com/a/4265260
                    request.addValueForHTTPHeaderField(options.headers[k], k);
                }
                // Log the output to make sure our new headers are there    
                console.log(request.allHTTPHeaderFields);
            }
            NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
                request, NSOperationQueue.currentQueue, (response: NSHTTPURLResponse, data: NSData, error: NSError) =>
                {
                    if (error)
                    {
                        reject(error);
                        return;
                    }
                    let desc;
                    let raw;
                    try
                    {
                        const temp = NSString.alloc().initWithDataEncoding(data, NSASCIIStringEncoding);
                        raw = temp.description;
                        desc = JSON.parse(temp.description);
                    } catch (e)
                    {
                        desc = null;
                    }

                    let customResponse: TNSHttpFormDataResponse = {
                        headers: response.allHeaderFields,
                        statusCode: response.statusCode,
                        statusMessage: NSHTTPURLResponse.localizedStringForStatusCode(response.statusCode),
                        body: desc,
                        raw: raw
                    }
                    resolve(customResponse);
                });
        });
    }
}