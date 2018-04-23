Android work is in progress. 

#### Add the plugin
```
tns plugin add nativescript-http-formdata
```
#### TypeScript

```
import { TNSHttpFormData, TNSHttpFormDataParam } from 'nativescript-http-formdata';
```
use the ImagePicker plugin or any other.
https://github.com/NativeScript/nativescript-imagepicker

```
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
      item.getImageAsync((image: UIImage, error) => {
        // console.dir(image);
        let imageData = UIImagePNGRepresentation(image);
        let fo = new TNSHttpFormData();

        //create params. You can upload an array of params i.e multiple data. For every parameter you need to give unique name
        //so you can get it on server. Check below how to grab it in ASP.Net MVC
        let params = [];
        let param: TNSHttpFormDataParam = {
          data: imageData,  //must be NSData on iOS
          contentType: 'image/png',
          fileName: 'test.png',
          parameterName: 'file1'
        };
        params.push(param);

        fo.upload('http://10.10.10.154:10011/home/fileupload', params)
        .then((isUploaded) => {
          console.log('isUploaded: ' + isUploaded);
        }, (error) => {
          console.log(error);
        });
      });
    }).catch(function (e) {
        alert(e);
    });
  }
  ```
Now on server to grab the file(s) in ASP.Net MVC, you can follow https://stackoverflow.com/a/16256106/859968 or following
```
[HttpPost]
//file1 and file2 are parameters name as given in NativeScript object. They must match
public ActionResult FileUpload(HttpPostedFileBase file1, HttpPostedFileBase file2)
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
