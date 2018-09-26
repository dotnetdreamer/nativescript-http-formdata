A NativeScript plugin to post/upload file as multipart/form-data to server for iOS and Android

#### Add the plugin
```
tns plugin add nativescript-http-formdata
```
#### TypeScript

```typescript
import { TNSHttpFormData, TNSHttpFormDataParam } from 'nativescript-http-formdata';
```
use the ImagePicker plugin or any other.
https://github.com/NativeScript/nativescript-imagepicker

```typescript
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
                const isUploaded = await fd.post('http://url.com/fileupload', params);
                console.log('isUploaded: ' + isUploaded);
            } catch (e) {
                console.log('---------------app.ts---------------');
                console.log(e);
            }
          });
        }).catch(function (e) {
            console.log(e);
        });
    }
  ```
Now on server to grab the file(s) in ASP.Net MVC, you can follow https://stackoverflow.com/a/16256106/859968 or following
```csharp
[HttpPost]
//file1 and file2 are parameters name as given in NativeScript object. They must match
public ActionResult FileUpload(HttpPostedFileBase file1, HttpPostedFileBase file2, string firstName)
{
    if (file1 != null)
    {
        string pic = System.IO.Path.GetFileName(file1.FileName);
        string path = System.IO.Path.Combine(Server.MapPath("~/App_Data"), pic);
        // file is uploaded
        file1.SaveAs(path);
    }
    if (file2 != null)
    {
        string pic = System.IO.Path.GetFileName(file2.FileName);
        string path = System.IO.Path.Combine(Server.MapPath("~/App_Data"), pic);
        // file is uploaded
        file2.SaveAs(path);
    }

    // after successfully uploading redirect the user
    return RedirectToAction("Index", "Home");
}
```
