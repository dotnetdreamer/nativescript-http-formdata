import { Component, OnInit } from "@angular/core";

import * as imagepicker from "nativescript-imagepicker";
import { TNSHttpFormData, TNSHttpFormDataParam } from 'nativescript-http-formdata';
require('../helpers');

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onButtonTapped() {
        this.test();
    }
    
    private test() {
        let context = imagepicker.create({
            mode: "single" // use "multiple" for multiple selection
        });
        context.authorize()
        .then(function() {
            return context.present();
        })
        .then((selection) => {
          let item = selection[0];
          //UIImage for iOS and android.graphics.Bitmap for Android
          item.getImageAsync(async (image, error) => {
            let fd = new TNSHttpFormData();
    
            //create params. You can upload an array of params i.e multiple data. For every parameter you need to give unique name
            //so you can get it on server. Check below how to grab it in ASP.Net MVC
            let params = [];

            let imageData: any;
            if(image) {
                if(image.ios) {
                    imageData = UIImagePNGRepresentation(image);
                } else {
                    //can be one of these overloads https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html
                    let bitmapImage: android.graphics.Bitmap = image;
                    let stream = new java.io.ByteArrayOutputStream();
                    bitmapImage.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream);
                    let byteArray = stream.toByteArray();
                    bitmapImage.recycle();

                    imageData = byteArray;
                }
            }
            let param: TNSHttpFormDataParam = {
                data: imageData,
                contentType: 'image/png',
                fileName: 'test.png',
                parameterName: 'file1'
            };
            params.push(param);
            let param2: TNSHttpFormDataParam = {
              data: "John Doe",
              parameterName: "firstName"
            };
            params.push(param2);
    
            try { 
                const response = await fd.post('http://10.10.10.149:10025/home/fileupload', params, {
                    headers: {
                        test1: "test1 value",
                        "x-version-no": "2.0"
                    }
                });
                console.log(response);
            } catch (e) {
                console.log('---------------app.ts---------------');
                console.log(e);
            }
          });
        }).catch(function (e) {
            console.log('-------------------error----------------')
            console.log(e);
        });
      }
}
