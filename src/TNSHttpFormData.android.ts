import { Common } from './TNSHttpFormData.common';
import { TNSHttpFormDataParam } from './index';

declare const okhttp3: any;

export class TNSHttpFormData extends Common {
    constructor() {
        super();
    }

    post(url: string, params: Array<TNSHttpFormDataParam>): Promise<any> {
        return new Promise((resolve, reject) => {
            try {                
                let client = new okhttp3.OkHttpClient();
                let builder = new okhttp3.MultipartBody.Builder()
                        .setType(okhttp3.MultipartBody.FORM);

                for(let param of params) {
                    if(param.fileName && param.contentType) {
                        const MEDIA_TYPE = okhttp3.MediaType.parse(param.contentType);
                        builder.addFormDataPart(param.parameterName, param.fileName, okhttp3.RequestBody.create(MEDIA_TYPE, param.data));   
                    } else {
                        builder.addFormDataPart(param.parameterName, param.data);
                    }
                }
                let requestBody = builder.build();
                let request = new okhttp3.Request.Builder()
                        .url(url)
                        .post(requestBody)
                        .build();

                let callback = new okhttp3.Callback({
                    onResponse: (call, response: Response) => {
                        resolve(response);
                    },
                    onFailure: (call, e) => {
                        reject(e);
                    }
                });

                client.newCall(request).enqueue(callback);
            } catch (e) {
                reject(e);
            }
        });
    }
}
