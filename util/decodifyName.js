module.exports = {
  decodifyName: (name) => {
    const splited = name.split('-');
  
    const year = splited[1].substring(0, 4);
    const month = splited[1].substring(4, 6);
    const day = splited[1].substring(6, 8);
  
    const hour = splited[2].substring(0, 2);
    const minute = splited[2].substring(2, 4);
    const seconds = splited[2].substring(4, 6);
  
    const date = new Date(year, month - 1, day, hour, minute, seconds).toLocaleString('pt-PT', { timeZone: 'UTC' });
    const map = splited[4];
    
    const text = `\n\`\`\`yaml\nDate -> ${date}\nMap -> ${map}\n\`\`\``;
    return text;
  }
}