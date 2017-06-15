$(document).ready(function () {
  var player = new Tone.Player('audio/sky.mp3', function () {
    console.log('deu boa')
    player.start()
  }).toMaster()
})
