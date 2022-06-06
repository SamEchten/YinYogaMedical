const formidable = require("formidable");
const fs = require('fs');
const path = require("path");
const Video = require("../models/Video");
const Podcast = require("../models/Podcast");
const {compareSync} = require("bcryptjs");

module.exports.upload = async (req, res) => {
    //Er moet hier nog een checkje dat je wel een admin bent
    const thumbnailUploadPath = path.join(__dirname, "../public/thumbnails/");
    const videoUploadPath = path.join(__dirname, "../videos/");
    const podcastUploadPath = path.join(__dirname, "../podcasts/");
    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.options.maxFileSize = 100 * 1024 * 1024 * 10;;
    form.maxFileSize = 100 * 1024 * 1024 * 10;

    form.parse(req, async (err, fields, files) => {
        if (!err) {
            const title = fields.title;
            const price = fields.price;
            const description = fields.description;
            const thumbnail = files.thumbnail;
            const media = files.media;
            const parsePrice = parseInt(price);

            // check if inputfields are filled in ->
            if (title != "" && price != "" && description != "") {
                // check if price is a integer ->
                if (!isNaN(parsePrice)) {
                    if (media.size != 0) {
                        let id;
                        // check if file is podcast or video ->
                        if (media.mimetype == "audio/mpeg") {
                            // write podcast to the database ->
                            try {
                                pod = await Video.create({
                                    title: title,
                                    price: convertPrice(price),
                                    description: description
                                });
                                id = pod._id;
                            } catch (err) {
                                console.log(err)
                                res.status(400).send(err);
                            }

                            // write media to folder ->
                            try {
                                const newpath = './media/podcasts/' + id + '.mp3';
                                fs.renameSync(media.filepath, newpath);
                            } catch (err) {
                                //If the media can't be uploaded, it will be removed from the database
                                Podcast.findOne({ _id: id }, (err, podcast) => {
                                    if (podcast)
                                        podcast.delete();
                                });
                                console.log(err)
                                res.status(400).json({message: "Bestanden niet correct geüpload, vraag de beheerder voor meer informatie"});
                            };
                        } else if (media.mimetype == "video/mp4") {
                            // write video and thumbnail to the database ->
                            try {
                                vid = await Video.create({
                                    title: title,
                                    price: convertPrice(price),
                                    description: description
                                });
                                id = vid._id;
                            } catch (err) {
                                //If the media can't be uploaded, it will be removed from the database
                                Video.findOne({ _id: id }, (err, video) => {
                                    if (video)
                                        video.delete();
                                });
                                console.log(err)
                                res.status(400).send(err);
                            }

                            // write media to folder ->
                            try {
                                const newpath = './media/videos/' + id + '.mp4';
                                fs.renameSync(media.filepath, newpath);
                            } catch (err) {
                                console.log(err)
                                res.status(400).json({message: "Bestanden niet correct geüpload, vraag de beheerder voor meer informatie"});
                            }
                        } else {
                            res.status(400).json({message: "Media om te uploaden moet een mp4-video of mp3-podcast zijn"});
                        }
                        if (thumbnail.size != 0)
                        {
                            if (thumbnail.mimetype == "image/jpeg" || thumbnail.mimetype != "image/jpg") {
                                const newpath = './public/images/thumbnails/' + id + '.jgp';
                                fs.renameSync(media.filepath, newpath);
                                res.status(200).json({message: "Media geüpload met thumbnail"});
                            }
                            else if (thumbnail.mimetype == "image/png") {
                                const newpath = './public/images/thumbnails/' + id + '.png';
                                fs.renameSync(media.filepath, newpath);
                                res.status(200).json({message: "Media geüpload met thumbnail"});
                            }
                            else {
                                res.status(400).json({message: "Alleen png- en jgp-thumbnails zijn toegestaan"})
                            }
                        }
                        else {
                            res.status(200).json({message: "Meda geüpload zonder thumbnail"});
                        }
                    } else {
                        res.status(400).json({message: "Geen media geüpload"})
                    }
                } else {
                    res.status(400).json({message: "Prijs moet een getal zijn"});
                }
            } else {
                res.status(400).json({message: "Vul alle velden in voordat u een video aanmaakt"});
            }
        } else {
            console.log(err)
            res.status(400).json({message: "Bestand te groot om te uploaden"});
        }
    });
};

function checkMimeType(thumbnail, video) {
    if (thumbnail.mimetype != "image/jpeg" && thumbnail.mimetype != "image/png" && thumbnail.mimetype != "image/jpg") {
        return false;
    }
    if (video.mimetype != "video/mp4") {
        return false;
    }
    return true
}

function createUniqueFileName(media) {
    const unix = Math.round((new Date()).getTime() / 1000);
    const fileName = unix.toString().concat(media);
    return fileName;
}

// Convert price(String) to valid price string
const convertPrice = (price) => {
    const length = price.length;
    price = price.toString();
    if (length != 5) {
        if (!price.includes(".")) {
            price += ".00";
        } else {
            const num = price.split(".")[0];
            const decimals = price.split(".")[1];
            if (decimals.length != 2) {
                price = num + "." + "" + decimals[0] + "" + decimals[1];
            }
        }
    }

    return price;
}