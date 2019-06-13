import { Common } from './TNSHttpFormData.common';
import { TNSHttpFormDataParam, TNSHttpFormDataRequestOptions, TNSHttpFormDataResponse } from './index';

declare const okhttp3: any;

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
            try
            {
                let client = new okhttp3.OkHttpClient();
                let builder = new okhttp3.MultipartBody.Builder()
                    .setType(okhttp3.MultipartBody.FORM);

                for (let param of params)
                {
                    if (param.fileName && param.contentType)
                    {
                        const MEDIA_TYPE = okhttp3.MediaType.parse(param.contentType);
                        builder.addFormDataPart(param.parameterName, param.fileName, okhttp3.RequestBody.create(MEDIA_TYPE, param.data));
                    } else
                    {
                        builder.addFormDataPart(param.parameterName, param.data);
                    }
                }
                let requestBody = builder.build();
                let reqWithURL = new okhttp3.Request.Builder()
                    .url(url);

                if (options && options.headers)
                {
                    for (let k in options.headers)
                    {
                        reqWithURL.addHeader(k, options.headers[k]);
                    }
                }
                const request = reqWithURL
                    .post(requestBody)
                    .build();
                let callback = new okhttp3.Callback({
                    // all server errors will arrive here
                    onResponse: (call, response) =>
                    {
                        let body;
                        let raw;
                        try
                        {
                            raw = response.body().string();
                            body = JSON.parse(response.body().string());
                        } catch (e)
                        {
                            body = null;
                        }

                        let customResponse: TNSHttpFormDataResponse = {
                            headers: response.headers().toString(),
                            statusCode: response.code(),
                            statusMessage: response.message(),
                            body: body,
                            raw: raw
                        }
                        resolve(customResponse);
                    },
                    // incase of timeout etc, this will be called
                    onFailure: (call, response) =>
                    {
                        reject(response);
                    }
                });

                client.newCall(request).enqueue(callback);
            } catch (e)
            {
                reject(e);
            }
        });
    }
}
