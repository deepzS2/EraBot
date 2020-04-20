const Client = require('ftp');
const fs = require('fs');
const c = new Client();

require('dotenv').config();

module.exports = {
  getDemo: async (guild) => {
    // Connect FTP
    c.connect({
      host: process.env.FTP_HOST,
      port: process.env.FTP_PORT,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD
    });

    c.on('ready', function() {
      // Search for the folder
      c.list('csgo', function(err, list) {
        if (err) throw err;
  
        // If the item ends with .dem
        if (list[1].name.endsWith('.dem')) {
          // Get the item
          c.get(`csgo/${list[3].name}`, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() {
              console.log('Success!');
            });
            // Save him
            stream.pipe(fs.createWriteStream(`${list[3].name}`));
  
            // Decodify file name
            const title = decodifyName(list[3].name);
  
            // Send to the guild channel
            guild.channels.get("701853994418700298").send(title, {
              files: [`./${list[3].name}`]
            });
          });
  
          // After that deletes from the FTP and from the actual storage
          c.delete(`csgo/${list[3].name}`, function (err) {
            if (err) throw err;
            fs.unlinkSync(`./${list[3].name}`);
          });
        }
  
        // Ends connection
        c.end();
      });
    });
  }
}

// Function
function decodifyName(name) {
  const splited = name.split('-');

  const year = splited[1].substring(0, 4);
  const month = splited[1].substring(4, 6);
  const day = splited[1].substring(6, 8);

  const hour = splited[2].substring(0, 2);
  const minute = splited[2].substring(2, 4);
  const seconds = splited[2].substring(4, 6);

  const date = new Date(year, month - 1, day, hour, minute, seconds).toLocaleString('pt-PT', { timeZone: 'UTC' });

  const map = splited[4];
  const text = `>*Main server*\n\`\`\`yaml\nDate -> ${date}\nMap -> ${map}\n\`\`\``;
  return text;
}