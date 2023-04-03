const axios = require('axios')
const fs = require('fs')
const request = require('request');
const { exec } = require('child_process');

const {
  YoutubeInfoSchema
} = require("../schema.js")


const commonHeaders = {
   "Accept": "application/json"
}

class CobaltAPIClient {

  /** Query the api if its awake and get the stream id.
   *
   * @param {string} url Requesting To download my remote resource.
   * @throws error when you need to wake it up again.
   */
 async postNewStream(url) {
   const reqBody = {
      url,
      isAudioOnly: true
   }
   try {
     let resp = await axios
     .post(
       "http://localhost:9000/api/json",
       reqBody,
       {headers: commonHeaders}
     )
     return resp.data["url"]
   } catch(e){
     var self = this;
    console.log(`Suspicious that the server isnt ready. Error: ${e}`);
    exec('cd cobalt && npm start', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(`Servier is in fact runningo`)
      } else {
        self.downloadFile(url)
      }
    });

  }

 }
 /** https://github.com/Exerra/node-musickit-api
  *
  * @param {string} url Jungled string from soundcloud, youtube
  */
 async downloadAndTuckInsideTemp(resourceUrl) {
   let outputURL = "./temp/BufferToExport.mp3";

   //delete file if exisits,
  if (fs.existsSync(outputURL)) {
    await fs.promises.unlink(outputURL)
  }


  await this.downloadFile(resourceUrl, outputURL)

   //write file buffer.

   return
 }


 async downloadFile(resourceUrl, path) {
   /* Create an empty file where we can save data */
   let file = fs.createWriteStream(path);
  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
      let stream = request({
          /* Here you should specify the exact link to the file you are trying to download */
          uri: resourceUrl,
          headers: {
              'Accept': 'audio/mpeg3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
              'Cache-Control': 'max-age=0',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
          },
          /* GZIP true for most of the websites now, disable it if you don't need it */
          gzip: true
      })
      .pipe(file)
      .on('finish', () => {
          resolve();
      })
      .on('error', (error) => {
          reject(error);
      })
    })
}

// main interface. downloads an mp3 file
 async processDownload(url) {
   try {
     let resourceUrl = await this.postNewStream(url)
     await this.downloadAndTuckInsideTemp(resourceUrl)

    } catch (error) {
      console.error("ERROR: Task failed successfuly", error);
      return undefined;

      // Expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
 }


}

module.exports = {
  CobaltAPIClient,
}
