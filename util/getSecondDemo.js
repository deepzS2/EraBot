const Client = require('ftp');
const fs = require('fs');
const c = new Client();

// Utils
const { decodifyName } = require('./decodifyName');

require('dotenv').config();

module.exports = {
  getSecondDemo: (guild) => {
    // Connect FTP
    c.connect({
      host: process.env.FTP_HOST_SECOND,
      port: process.env.FTP_PORT_SECOND,
      user: process.env.FTP_USER_SECOND,
      password: process.env.FTP_PASSWORD_SECOND
    });

    // Check folder
    c.on('ready', function() {
      c.list('csgo - verygames/csgo', function(err, list) {
        if (err) throw err;

        const name = list[5].name;

        // If the item ends with .dem
        if (name.endsWith('.dem')) {
          // Get the item
          c.get(`csgo - verygames/csgo/${name}`, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() {
              console.log('Success!');
            });
            // Save him
            stream.pipe(fs.createWriteStream(`${name}`));

            // Decodify file name
            const title = `>*Clanwar/1v1 server*${decodifyName(name)}`;

            // Send to the guild channel
            guild.channels.get("701853994418700298").send(title, {
              files: [`./${name}`]
            });
          });

          // After that deletes from the FTP and from the actual storage
          c.delete(`csgo - verygames/csgo/${name}`, function (err) {
            if (err) throw err;

            try {
              fs.unlinkSync(`./${name}`);
            } catch (e) {
              console.log("Not such file lol");
            }
          });
        }
      });

      // Ends connection
      c.end();
    });
  }
}