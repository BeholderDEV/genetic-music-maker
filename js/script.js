(function (root) {
  var mySynth2 = new Synthos()

  $(document).ready(function () {
    mySynth2.setType('square')
    mySynth2.setBpm(200)
    var out = ''
    for (var index = 0; index < music.length; index++) {
      out += music[index]
      if (index !== music.length - 1) {
        out += ', '
      }
    }
    $('#exp_ind').append('<tr><td>' + out + '</td><td>' + 0 + '</td></tr>')
    var amb = new Ambiente()
    amb.evoluirPopulacao(50)
  })

  $('#original').on('click', function () {
    mySynth2.setFrequencies(music)
    mySynth2.setDurations(dr)
    mySynth2.play()
  })

  $('#generated').on('click', function () {
    mySynth2.setFrequencies(maiorIndividuoHistorico.individuo.frequencies)
    mySynth2.setDurations(maiorIndividuoHistorico.individuo.durations)
    console.log(maiorIndividuoHistorico.individuo.frequencies)
    console.log('Gerado ' + maiorIndividuoHistorico.individuo.durations)
    console.log('Original ' + dr)
    mySynth2.play()
  })

  $('#worst').on('click', function () {
    mySynth2.setFrequencies(worst.frequencies)
    mySynth2.setDurations(worst.durations)
    mySynth2.play()
  })
})(window)
