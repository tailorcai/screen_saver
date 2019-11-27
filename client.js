var fs = require("fs");
var request = require("request")

var formData = {
    // Pass a simple key-value pair
    file_path: 'my_value',
    // Pass data via Buffers
    my_buffer: Buffer.from([1, 2, 3]),
    // Pass data via Streams
    // image: fs.createReadStream(__dirname + '/test.jpg'),
    // Pass multiple values /w an Array
    // attachments: [
    //   fs.createReadStream(__dirname + '/attachment1.jpg'),
    //   fs.createReadStream(__dirname + '/attachment2.jpg')
    // ],
    // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
    // Use case: for some types of streams, you'll need to provide "file"-related information manually.
    // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    image: {
      value:  fs.createReadStream(__dirname + '/test.jpg'),
      options: {
        filename: 'a_b_c.jpg',
        path:'a/b',
        contentType: 'image/jpeg'
      }
    }
  };
  request.post({
        url:'http://127.0.0.1:8010/upload', 
        formData: formData
    }, 
    function optionalCallback(err, httpResponse, body) {
        if (err) {
        return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
  });