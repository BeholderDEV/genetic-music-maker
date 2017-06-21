var collect = require('collect.js')

var gController = new graphController()

var note = new Note()
// Vetor com notas (incluir isso na lib Synthos)
var notes = [note.C, note.E, note.D, note.Cs, note.Ds, note.F, note.Fs, note.G, note.Gs, note.A, note.As, note.B, note.E5, note.Ds5, note.C5,note.B4]


// var music = [note.E, note.E, note.E, note.C]
// var music = [note.C, note.D, note.E, note.F]
var music = [note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C]
var fatorDeMutacao = 0.05
var worst
var mySynth2 = new Synthos()

$(document).ready(function () {
  mySynth2.setType('sine')
  mySynth2.setBpm(200)
  $('#exp_ind').append('<tr><td>' + collect(music).implode(' - ') + '</td><td>' + 0 + '</td></tr>')
  var amb = new Ambiente()
  amb.evoluirPopulacao(50)
})

$('#original').on('click', function () {
  mySynth2.setFrequencies(music)
  mySynth2.play()
})

$('#generated').on('click', function () {
  mySynth2.setFrequencies(menorIndividuoHistorico.individuo.frequencies)
  mySynth2.play()
})

$('#worst').on('click', function () {
  mySynth2.setFrequencies(worst.frequencies)
  mySynth2.play()
})



var tamanhoPopulacao = music.length * 10

var menorDeTodos = Number.POSITIVE_INFINITY
var menorIndividuoHistorico = {}

class Ambiente {
  constructor () {
    this.pop = new Populacao()
    this.pop.makeATable('#ind')
    worst = this.pop.individuos[this.pop.individuos.length - 1]
    gController.addToGraph(this.pop)
    menorIndividuoHistorico.individuo = new Individuo(music.length)
  }

  findBestIndividuo (ind1, ind2) {
    if (ind1.coincidence < ind2.coincidence) {
      return ind1
    }
    return ind2
  }

  evoluirPopulacao (iteracoes) {
    for (var i = 0; i < iteracoes; i++) {
      
      this.pop.individuos.sort(function (a, b) {
        var j = Math.random() * 100
        if (j <= 30) {
          return -1
        } else if (j <= 60) {
          return 0
        } else {
          return 1
        }
      })


      var melhoresIndTorneio = []
      var k = 0
      for (var j = 0; j < tamanhoPopulacao / 2; j++) {
        melhoresIndTorneio[j] = this.findBestIndividuo(this.pop.individuos[k], this.pop.individuos[k + 1])
        k = k + 2
        if (melhoresIndTorneio[j].coincidence < menorDeTodos) {
          menorDeTodos = melhoresIndTorneio[j].coincidence
          console.log(i + ' - ' + menorDeTodos)
          // menorIndividuoHistorico.individuo = melhoresIndTorneio[j]
          menorIndividuoHistorico.individuo.copyIndividuo(melhoresIndTorneio[j])
          menorIndividuoHistorico.geracao = i
        }
      }

      for (var m = 0; m < melhoresIndTorneio.length; m++) {
        if (m % 2 === 0) {
          this.crossover(melhoresIndTorneio[m], melhoresIndTorneio[m + 1], m * 2)
        }
        if (m === melhoresIndTorneio.length - 1 && melhoresIndTorneio.length % 2 === 1) {
          this.crossover(melhoresIndTorneio[m], melhoresIndTorneio[m - 1], m * 2)
          break
        }
      }

      for (var l = 0; l < tamanhoPopulacao; l++) {
        this.pop.individuos[l].mutate()
      }

      gController.addToGraph(this.pop)
    }

    this.pop.makeATable('#ind2')
    gController.drawChart('#chart-area')
    $('#melhor_ind').append('<tr><th scope="row">' + menorIndividuoHistorico.geracao + '</th><td>' + collect(menorIndividuoHistorico.individuo.frequencies).map(function (item) {
      return Math.round(item * 100) / 100
    }).implode(' - ') + '</td><td>' + menorIndividuoHistorico.individuo.coincidence + '</td></tr>')
  }


  crossover (i1, i2, posicaoPop) {
    var vet1 = i1.frequencies
    var vet2 = i2.frequencies
    var novoInd1 = new Individuo(music.length)
    var novoInd2 = new Individuo(music.length)
    novoInd1.resetTrack()
    novoInd2.resetTrack()
    this.gerarMusica(novoInd1, vet1, vet2)
    this.gerarMusica(novoInd2, vet2, vet1)
    this.pop.individuos[posicaoPop] = novoInd1
    this.pop.individuos[posicaoPop + 1] = novoInd2
    this.pop.individuos[posicaoPop + 2] = i1
    this.pop.individuos[posicaoPop + 3] = i2
  }

  gerarMusica (novoInd, freqPai1, freqPai2) {
      var localCoincidence
      var vetFreq = []
      var novaFreq = novoInd.getFrequencies()
      for (var i = 0; i < freqPai1.length; i++) {
        localCoincidence = {}
        localCoincidence.value = Math.abs(music[i] - freqPai1[i])
        localCoincidence.location = i
        vetFreq[i] = localCoincidence
      }

      vetFreq.sort(function (a, b) {
        if(a.value === b.value){
          return 0
        }
        return (a.value < b.value) ? -1 : 1;
      })

      for (var i = 0; i < vetFreq.length / 2; i++) {
        novaFreq[vetFreq[i].location] = freqPai1[vetFreq[i].location]
      }

      for (var i = 0; i < freqPai2.length; i++) {
        if(novaFreq[i] === -1){
          novaFreq[i] = freqPai2[i]
        }
      }
  }

}

class Populacao {
  constructor () {
    this.individuos = []
    for (var i = 0; i < tamanhoPopulacao; i++) {
      this.individuos[i] = new Individuo(music.length)
    }
  }

  setIndividuo (posicao, Individuo) {
    this.individuos[posicao] = Individuo
  }

  makeATable (id) {
    this.individuos.sort(function (a, b) { return a.coincidence - b.coincidence })
    for (var i = 0; i < tamanhoPopulacao; i++) {
      $(id).append('<tr><th scope="row">' + i + '</th><td>' + collect(this.individuos[i].frequencies).map(function (item) {
        return Math.round(item * 100) / 100
      }).implode(' - ') + '</td><td>' + this.individuos[i].coincidence + '</td></tr>')
    }
  }
}

class Individuo {
  constructor (size) {
    this.frequencies = []
    for (var i = 0; i < size; i++) {
      // this.frequencies[i] = note.B + (Math.random() * (note.C - note.B))
      this.frequencies[i] = notes[Math.floor(Math.random() * 100 % notes.length)]
    }
  }

  resetTrack () {
    for (var i = 0; i < this.frequencies.length; i++) {
      this.frequencies[i] = -1
    }
  }

  copyIndividuo (old) {
    var oldFreq = old.getFrequencies()
    for (var i = 0; i < oldFreq.length; i++) {
      this.frequencies[i] = oldFreq[i]
    }
  }

  get coincidence () {
    var sum = 0
    for (var index = 0; index < this.frequencies.length; index++) {
      sum += Math.abs(music[index] - this.frequencies[index])
    }
    return sum
  }

  getFrequencies () {
    return this.frequencies
  }


  mutate () {
    var mutateChance = Math.random()
    if (mutateChance > fatorDeMutacao) {
      return
    }
    const collection = collect([0, 1, 2, 3])
    var pos = collection.random()
    // this.frequencies[pos] = note.B + (Math.random() * (note.C - note.B))
    this.frequencies[pos] = notes[Math.floor(Math.random() * 100 % notes.length)]
  }
}
