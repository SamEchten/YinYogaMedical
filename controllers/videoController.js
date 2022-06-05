// in the imports above
const fs = require("fs");
const path = require("path");
const Video = require("../models/Video");

module.exports.streamFile = async (req, res) => {
    const { id } = req.params;

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)
    const videoPath = "./media/videos/" + id + ".mp4";
    const videoSize = fs.statSync("./media/videos/" + id + ".mp4").size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
};

// Render video page
module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/video"), { isAdmin: false });
}

module.exports.get = async (req, res) => {
    const { id } = req.params;

    //Get single user by given Id ->
    if (id) {
        try {
            let video = await Video.findOne({ _id: id });
            if (video) {
                res.status(200).json({
                    title: video.title,
                    price: video.price,
                    description: video.description
                });
            } else {
                res.status(404).json({ message: "Geen video gevonden met dit id" });
            }
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err.message });
        }
    } else {
        //Get all videos ->
        try {
            let videos = await Video.find();
            let allVideos = [];
            for (videoIndex in videos) {
                let video = videos[videoIndex];
                allVideos.push({
                    id: video._id,
                    title: video.title,
                    price: video.price,
                    description: video.description,
                    thumbnailPath: video.thumbnailPath,
                    videoPath: video.videoPath
                });
            }
            res.status(200).json(allVideos);
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err });
        }
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const thumbnailPathServer = path.join(__dirname,"../public/thumbnails/");
    const videoPathServer = path.join(__dirname,"../videos/");

    try {
        let video = await Video.findOne({_id : id});
        if(video){
            video.remove();
            try {
                let thumbnailPath = thumbnailPathServer + video.thumbnailPath;
                let videoPath = videoPathServer + video.videoPath;
                console.log(thumbnailPath);
                console.log(videoPath);
                fs.unlink(thumbnailPath, function(err) {
                    if(err && err.code == "ENOENT") {
                        res.status(400).json({message: "File does not exist"});
                    }else {
                        console.log("Thumbnail removed");
                    }
                });
                fs.unlink(videoPath, function(err) {
                    if(err && err.code == "ENOENT") {
                        res.status(400).json({message: "File does not exist"});
                    }else {
                        console.log("video removed");
                    }
                });
                res.status(200).json({message: "Video verwijderd"});
                
            } catch(err) {
                res.status(400).send(err);
            } 
        } else {    
            res.status(400).json({message: "Video met opgegeven ID niet gevonden"});
        }
    } catch (err) {
        res.status(400).json({message: "Gegeven ID niet correct ID format"});
    }
}

module.exports.update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        Video.findOne({ _id: id }, async (err, product) => {
            if (product) {
                await Video.updateOne({ _id: id }, { $set: body });
                res.status(200).json({message: "Video gewijzigd"});
            } else {
                res.status(404).json({ message: "Er is geen Video gevonden met dit id" });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}