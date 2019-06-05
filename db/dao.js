var fs = require('fs')

function saveHotSongs(data) {
    console.log(__dirname)
    fs.writeFile(__dirname + '/hotSongs.json', JSON.stringify(data), function(err){
        if(err) console.log(err)
        else console.log('Hot songs saved!')
    })
}

module.exports = {
    saveHotSongs: saveHotSongs
}