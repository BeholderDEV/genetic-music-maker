var C = 1054.94
var C1 = 995.73
var D = 939.85
var D1 = 887.10
var E = 837.31
var F = 790.31
var F1 = 745.96
var G = 704.09
var G1 = 664.57
var A = 627.27
var A1 = 592.07
var B = 558.84

$(document).ready(function () {
  var music = [F, C, A1, C, F, C, A1, C, F, C, A1, C, F, C, A1, C, F, A1, C, F, A1, G, C]
  for (var index = 0; index < music.length; index++) {
    music[index] = music[index] / 2
  }
  var mySynth = new Synthos()
  mySynth.setType('sine')
  mySynth.setBpm(200)
  for (var index = 0; index < music.length; index++) {
    mySynth.addFrequency(music[index])
  }
  mySynth.play()
})
