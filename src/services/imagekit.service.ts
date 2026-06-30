import { ImageKit } from "@imagekit/nodejs/client.js";

const ImagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

// DUE TO SOME TECHNICAL ISSUE COULD NOT FINISH THE SEVICE 