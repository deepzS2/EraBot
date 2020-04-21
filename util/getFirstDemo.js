const Client = require('ftp');
const fs = require('fs');
const c = new Client();

// Utils
const { decodifyName } = require('./decodifyName');

require('dotenv').config();

module.exports = {
  getFirstDemo: (guild) => {
    // Connect FTP
    c.connect({
      host: process.env.FTP_HOST,
      port: process.env.FTP_PORT,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD
    });

    // Check folder
    c.on('ready', function() {
      c.list('csgo', function(err, list) {
        if (err) throw err;

        const name = list[1].name;

        // If the item ends with .dem
        if (name.endsWith('.dem')) {
          // Get the item
          c.get(`csgo/${name}`, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() {
              console.log('Success!');
            });
            // Save him
            stream.pipe(fs.createWriteStream(`${name}`));

            // Decodify file name
            const title = `>*Main server*${decodifyName(name)}`;

            // Send to the guild channel
            guild.channels.get("701853994418700298").send(title, {
              files: [`./${name}`]
            });
          });

          // After that deletes from the FTP and from the actual storage
          c.delete(`csgo/${name}`, function (err) {
            if (err) throw err;

            try {
              fs.unlinkSync(`./${name}`);
            } catch (e) {
              console.log("Not such file lol");
            }
          });
        }
      })

      // Ends connection
      c.end();
    });
  }
}