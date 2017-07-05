(function (root) {
  var mySynth2 = new Synthos()
  var numeroGeracoes = 50

  $(document).ready(function () {
    mySynth2.setType('square')
    mySynth2.setBpm(200)
    var out = ''

    realizarTestes(false, 5, 1)

    for (var index = 0; index < music.length; index++) {
      out += music[index]
      if (index !== music.length - 1) {
        out += ', '
      }
    }
    $('#exp_ind').append('<tr><td>' + out + '</td><td>' + 0 + '</td></tr>')
  })

  function realizarTestes(musicaAleatoria, numeroNotas, numeroTestes){
  	var resultadoExperimento = ''
  	for (var j = 1; j <= numeroTestes; j++) {
	  	if(musicaAleatoria){
	  		music = []
		  	dr = []
		  	for (var i = 0; i < numeroNotas; i++) {
		  		music[i] = notes[Math.floor(Math.random() * 100 % notes.length)]
		  		dr[i] = Math.floor(Math.random() * 10) / 10
		  		if(dr[i] === 0){
		        	dr[i] = 0.1
		    	}
		  	}
  		}
  		var amb = new Ambiente()
    	amb.evoluirPopulacao(numeroGeracoes)
    	resultadoExperimento = resultadoExperimento + numeroNotas +', ' +  numeroGeracoes + ', ' + worst.coincidence + ', ' + maiorIndividuoHistorico.individuo.coincidence + ', ' + maiorIndividuoHistorico.geracao +'\n'
  		if(j % 10 === 0){
  			console.log(j)
  		}
  		if(j !== numeroTestes){
  			$('#ind').empty()
  			$('#ind2').empty()
  			$('#melhor_ind').empty()
  			gController.clearGraph()
  		}
  	}
  	console.log(resultadoExperimento)
  	// download(resultadoExperimento)
  }

  function download(resultado){
  	var file = new Blob([resultado], {type: 'text/plain'});
  	var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'Experimento.txt';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
  }

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
