
function mapNewSongType(songType) {
    songType = songType.toLowerCase()
    if(songType === 'chinese' || songType === 'china' || songType === 'mandarin') {
        return 7
    }
    if(songType === 'english') {
        return 96
    }
    if(songType === 'japanese' || songType === 'japan') {
        return 8
    }
    if(songType === 'korean' || songType === 'korea') {
        return 16
    }
    return 0
}

module.exports = {
    mapNewSongType: mapNewSongType
}