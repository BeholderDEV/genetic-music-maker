var collect = require('collect.js')
var chart = require('chart.js')

var note = new Note()
var music = [note.C, note.D, note.E, note.F]
var fatorDeMutacao = 0.05
$(document).ready(function () {
  var mySynth2 = new Synthos()
  mySynth2.setType('sine')
  mySynth2.setBpm(200)
  $('#exp_ind').append('<tr><td>' +  collect(music).implode(' - ') + '</td><td>' + 0 + '</td></tr>')
  var amb = new Ambiente()
  amb.evoluirPopulacao(75)
  mySynth2.setFrequencies(menorIndividuoHistorico.individuo.frequencies)
  mySynth2.play()
})
var tamanhoPopulacao = 16

var menorDeTodos = Number.POSITIVE_INFINITY
var menorIndividuoHistorico = {}

var colorNames = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
var config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Melhor Individuo da Geração',
      backgroundColor: colorNames[3],
      borderColor: colorNames[3],
      data: [
      ],
      fill: false
    },
    {
      label: 'Pior Individuo da Geração',
      backgroundColor: colorNames[0],
      borderColor: colorNames[0],
      data: [
      ],
      fill: false
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Population History'
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Generation'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Path Cost'
        }
      }]
    }
  }
}

var geracao = 0

function addToGraph (populacao) {
  var element = populacao.individuos
  element.sort(function (a, b) { return a.coincidence - b.coincidence })
  config.data.labels.push(geracao)
  geracao++
  config.data.datasets[0].data.push(element[0].coincidence)
  config.data.datasets[1].data.push(element[element.length - 1].coincidence)
}

class Ambiente {
  constructor () {
    this.pop = new Populacao()
    this.pop.makeATable('#ind')
    addToGraph(this.pop)
  }

  drawChart (divId) {
    var ctx = $(divId).get(0).getContext('2d')
    window.myDoughnut = new Chart(ctx, config)
  }

  findBestIndividuo (ind1, ind2) {
    if (ind1.coincidence < ind2.coincidence) {
      return ind1
    }
    return ind2
  }

  evoluirPopulacao (iteracoes) {
    // console.log("aa")
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
          menorIndividuoHistorico.individuo = melhoresIndTorneio[j]
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
      addToGraph(this.pop)
    }

    this.pop.makeATable('#ind2')
    this.drawChart('#chart-area')
    $('#melhor_ind').append('<tr><th scope="row">' + menorIndividuoHistorico.geracao + '</th><td>' +  collect(menorIndividuoHistorico.individuo.frequencies).map(function (item) {
      return Math.round(item * 100) / 100
    }).implode(' - ') + '</td><td>' + menorIndividuoHistorico.individuo.coincidence + '</td></tr>')
  }
  crossover (i1, i2, posicaoPop) {
    var vet1 = i1.frequencies
    var vet2 = i2.frequencies
    var novoInd1 = new Individuo(4)
    var novoInd2 = new Individuo(4)
    novoInd1.resetTrack()
    novoInd2.resetTrack()
    this.gerarNovoCaminho(novoInd1, vet1, vet2)
    this.gerarNovoCaminho(novoInd2, vet2, vet1)
    this.pop.individuos[posicaoPop] = novoInd1
    this.pop.individuos[posicaoPop + 1] = novoInd2
    this.pop.individuos[posicaoPop + 2] = i1
    this.pop.individuos[posicaoPop + 3] = i2
  }

  gerarNovoCaminho (novoInd, caminhoPai1, caminhoPai2) {
    var pos = 0
    // console.log(pos)
    for (var i = 0; i < caminhoPai1.length / 2; i++) {
      novoInd.frequencies[pos - i] = caminhoPai1[pos - i]
    }
    for (var k = 0; k < caminhoPai2.length; k++) {
      if (novoInd.frequencies[k] === -1) {
        for (var j = 0; j < caminhoPai2.length; j++) {
          if (!this.validarNovaParteCaminho(novoInd.frequencies, caminhoPai2[j])) {
            novoInd.frequencies[k] = caminhoPai2[j]
          }
        }
      }
    }
  }

  validarNovaParteCaminho (caminhoNovo, novaParteCaminho) {
    for (var i = 0; i < caminhoNovo.length; i++) {
      if (caminhoNovo[i] === novaParteCaminho) {
        return true
      }
    }
    return false
  }
}

class Populacao {
  constructor () {
    this.individuos = []
    for (var i = 0; i < tamanhoPopulacao; i++) {
      this.individuos[i] = new Individuo(4)
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
      this.frequencies[i] = note.B + (Math.random() * (note.C - note.B))
    }
  }
  resetTrack () {
    for (var i = 0; i < this.frequencies.size; i++) {
      this.frequencies[i] = -1
    }
  }
  get coincidence () {
    var sum = 0
    for (var index = 0; index < this.frequencies.length; index++) {
      sum += Math.abs(music[index] - this.frequencies[index])
    }
    return sum
  }

  mutate () {
    var mutateChance = Math.random()
    if (mutateChance > fatorDeMutacao) {
      return
    }
    const collection = collect([0, 1, 2, 3])
    var pos = collection.random()
    this.frequencies[pos] = note.B + (Math.random() * (note.C - note.B))
  }
}
