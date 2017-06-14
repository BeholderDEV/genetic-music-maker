// A    B   C    D   E  F
var pesos = [
  [-1, 5, 10, 15, 25, 10], // A
  [5, -1, 13, 11, 18, 12], // B
  [10, 13, -1, 6, 14, 2], // C
  [15, 11, 6, -1, 20, 23], // D
  [25, 18, 14, 20, -1, 8],  // E
  [10, 12, 2, 23, 8, -1]  // F
]

var cidades = ['A', 'B', 'C', 'D', 'E', 'F']

var tamanhoPopulacao = cidades.length * 2
var fatorDeMutacao = 0.05
var fatorCrossover = 0.9

var menorDeTodos = Number.POSITIVE_INFINITY
var menorIndividuoHistorico = {}

$(document).ready(function () {
  // var pop = new Populacao()
  // pop.makeATable()
  var amb = new Ambiente()
  amb.evoluirPopulacao(50)
})

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
      text: 'Chart.js Line Chart'
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
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    }
  }
}

var geracao = 0

function addToGraph (populacao) {
  var element = populacao.vetorIndividuos
  element.sort(function (a, b) { return a.custo - b.custo })
  config.data.labels.push(geracao)
  geracao++
  config.data.datasets[0].data.push(element[0].custo)
  config.data.datasets[1].data.push(element[element.length-1].custo)
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

  evoluirPopulacao (iteracoes) {
    // console.log("aa")
    for (var i = 0; i < iteracoes; i++) {
      var melhoresIndTorneio = []
      var k = 0
      for (var j = 0; j < tamanhoPopulacao / 2; j++) {
        melhoresIndTorneio[j] = this.findBestIndividuo(this.pop.vetorIndividuos[k], this.pop.vetorIndividuos[k + 1])
        k = k + 2
        if (melhoresIndTorneio[j].custo < menorDeTodos) {
          menorDeTodos = melhoresIndTorneio[j].custo
          menorIndividuoHistorico.individuo = melhoresIndTorneio[j]
          menorIndividuoHistorico.geracao = i
        }
      }

      // Considerar depois que crossover pode não ocorrer
      for (var m = 0; m < melhoresIndTorneio.length; m = m + 2) {
        var crossChance = Math.random()
        if (m === melhoresIndTorneio.length - 1) {
          if (melhoresIndTorneio.length % 2 === 1) {
            this.crossover(melhoresIndTorneio[m], melhoresIndTorneio[m - 1], m)
            break
          }
        }
        if (crossChance < fatorCrossover) {
          this.crossover(melhoresIndTorneio[m], melhoresIndTorneio[m + 1], m)
        } else {
          this.pop.setIndividuo(m + 1, melhoresIndTorneio[m])
          this.pop.setIndividuo(m + 2, melhoresIndTorneio[m + 1])
        }
      }

      for (var l = 0; l < tamanhoPopulacao; l++) {
        this.pop.vetorIndividuos[l].mutate()
      }
      addToGraph(this.pop)
    }

    this.pop.makeATable('#ind2')
    this.drawChart('#chart-area')
    $('#melhor_ind').append('<tr><th scope="row">' + menorIndividuoHistorico.geracao + '</th><td>' + menorIndividuoHistorico.individuo.percurso + '</td><td>' + menorIndividuoHistorico.individuo.custo + '</td></tr>')
  }

  findBestIndividuo (ind1, ind2) {
    if (ind1.custo < ind2.custo) {
      return ind1
    }
    return ind2
  }

// http://www.theprojectspot.com/tutorial-post/applying-a-genetic-algorithm-to-the-travelling-salesman-problem/5
  crossover (i1, i2, posicaoPop) {
    var vet1 = i1.vetorCaminho
    var vet2 = i2.vetorCaminho
    var novoInd1 = new Individuo()
    var novoInd2 = new Individuo()
    novoInd1.resetCaminho()
    novoInd2.resetCaminho()
    this.gerarNovoCaminho(novoInd1, vet1, vet2)
    this.gerarNovoCaminho(novoInd2, vet2, vet1)
    this.pop.setIndividuo(posicaoPop + 1, novoInd1)
    this.pop.setIndividuo(posicaoPop + 2, novoInd2)
  }

  encontrarMenorFita (caminhoPai1) {
    var size = caminhoPai1.length / 2
    var menor = Number.POSITIVE_INFINITY
    var melhorFita = caminhoPai1.length
    for (var i = 0; i < caminhoPai1.length / 2; i++) {
      var custo = 0
      for (var j = i; j < i + size - 1; j++) {
        custo += pesos[caminhoPai1[j]][caminhoPai1[j + 1]]
      }
      if (custo < menor) {
        menor = custo
        // console.log('cust '+custo+' fita = '+(i+size-1))
        melhorFita = i + size - 1
      }
    }
    return melhorFita
  }

  gerarNovoCaminho (novoInd, caminhoPai1, caminhoPai2) {
    var pos = this.encontrarMenorFita(caminhoPai1)
    // console.log(pos)
    for (var i = 0; i < caminhoPai1.length / 2; i++) {
      novoInd.setParteCaminho(pos - i, caminhoPai1[pos - i])
    }
    for (var k = 0; k < caminhoPai2.length; k++) {
      if (novoInd.caminho[k] === -1) {
        for (var j = 0; j < caminhoPai2.length; j++) {
          if (!this.validarNovaParteCaminho(novoInd.caminho, caminhoPai2[j])) {
            novoInd.setParteCaminho(k, caminhoPai2[j])
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
      this.individuos[i] = new Individuo()
    }
  }

  get vetorIndividuos () {
    return this.individuos
  }

  setIndividuo (posicao, Individuo) {
    this.individuos[posicao] = Individuo
  }

  makeATable (id) {
    var element = this.vetorIndividuos
    element.sort(function (a, b) { return a.custo - b.custo })
    var sum = 0
    for (var i = 0; i < tamanhoPopulacao; i++) {
      sum += this.individuos[i].custo
      $(id).append('<tr><th scope="row">' + i + '</th><td>' + this.individuos[i].percurso + '</td><td>' + this.individuos[i].custo + '</td></tr>')
    }
    $(id).append('<tr><th scope="row" colspan="2">TOTAL</th><td>' + sum + '</td></tr>')
  }
}

class Individuo {
  constructor () {
    this.caminho = []

    for (var i = 0; i < cidades.length; i++) {
      this.caminho[i] = i
    }
    this.caminho.sort(function (a, b) {
      var j = Math.random() * 100
      if (j <= 30) {
        return -1
      } else if (j <= 60) {
        return 0
      } else {
        return 1
      }
    })
  }

  get custo () {
    var out = 0
    for (var i = 0; i < cidades.length - 1; i++) {
      out += pesos[this.caminho[i]][this.caminho[i + 1]]
    }
    out += pesos[this.caminho[cidades.length - 1]][this.caminho[0]]
    return out
  }

  get percurso () {
    var out = ''
    for (var i = 0; i < cidades.length; i++) {
      out = out + ' ' + cidades[this.caminho[i]]
    }
    return out
  }

  get vetorCaminho () {
    return this.caminho
  }

  setParteCaminho (posicao, alteracao) {
    this.caminho[posicao] = alteracao
  }

  resetCaminho () {
    for (var i = 0; i < this.caminho.length; i++) {
      this.caminho[i] = -1
    }
  }

  mutate () {
    var mutateChance = Math.random()
    if (mutateChance > fatorDeMutacao) {
      return
    }
    var i
    var j
    do {
      i = Math.random() * 100 % cidades.length
      j = Math.random() * 100 % cidades.length
    } while (i === j)
    var aux = this.caminho[i]
    this.caminho[i] = this.caminho[j]
    this.caminho[j] = aux
  }
}
