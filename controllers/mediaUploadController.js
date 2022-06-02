const formidable = require("formidable");
const fs = require('fs');
const Video = require("../models/Video");
const Podcast = require("../models/Podcast");

module.exports.post = async (req, res) => {
    //Er moet hier nog een checkje dat je wel een admin bent

    let title;
    let price;
    let description;

    const form = new formidable.IncomingForm({ maxFileSize: 100000000000/*Dit is 100 gB*/ });

    form.parse(req, async function (err, fields, files) {
        console.log(fields.title)
        title = fields.title;
        price = fields.price;
        description = fields.description;


        if (files.filetoupload.originalFilename.endsWith(".mp4"))//Kijk of het een filmje is
        {
            const oldpath = files.filetoupload.filepath;
            const oldpathThumbnail = files.thumbnail.filepath;

            const video = await Video.create({ title, price, description });//Zet alles in de database en doe dan de upload naar de server
            {
                const newpath = './media/videos/' + video._id + '.mp4';
                const videoUpload = fs.rename(oldpath, newpath, async function (err) {
                    if (err) throw err;
                    return true;
                });

                const newpathThumbnail = './public/images/thumbnails/' + video._id + '.jpg';
                const thumbnailUpload = fs.rename(oldpathThumbnail, newpathThumbnail, async function (err) {
                    if (err) throw err;
                    return true;
                });

                await (videoUpload && thumbnailUpload)//Deze await de upload van de video en de thumbnail
                {
                    res.status(200).json({ id: video._id });
                }
            }
        }
        else if (files.filetoupload.originalFilename.endsWith(".mp3"))//Kijk of het een podcast is
        {
            const oldpath = files.filetoupload.filepath;

            const podcast = await Podcast.create({ title, price, description });//Zet alles in de database
            {
                const newpath = './media/podcasts/' + podcast._id + '.mp3';
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    res.status(200).json({ id: podcast._id });
                });
            }
        }
        else//Gooi een error is het geen van beiden is
        {
            res.sendStatus(415);
        }
    })
};