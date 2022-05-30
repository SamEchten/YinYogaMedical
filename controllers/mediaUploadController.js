// module.exports.post = async (req, res) => {
//     console.log("Video komt binnen")
//     console.log(req.files)
//     try {
//         if(!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
//             let avatar = req.files.avatar;
//
//             //Use the mv() method to place the file in upload directory (i.e. "uploads")
//             avatar.mv('./uploads/' + avatar.name);
//
//             //send response
//             res.send({
//                 status: true,
//                 message: 'File is uploaded',
//                 data: {
//                     name: avatar.name,
//                     mimetype: avatar.mimetype,
//                     size: avatar.size
//                 }
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// };


const formidable = require("formidable");
const fs = require('fs');

module.exports.post = async (req, res) => {
    var form = new formidable.IncomingForm({maxFileSize: 100000000000/*Dit is 100 gB*/});
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.filepath;
        var newpath = './uploads/' + files.filetoupload.originalFilename;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    })
};
