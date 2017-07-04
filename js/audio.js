var gController = new GraphController()
var note = new Note()
// Vetor com notas (incluir isso na lib Synthos)
var notes = [note.C, note.E, note.D, note.Cs, note.Ds, note.F, note.Fs, note.G, note.Gs, note.A, note.As, note.B, note.E5, note.Ds5, note.C5, note.B4]

var music = [note.E, note.E, note.E, note.C, note.E, note.G, note.C, note.G, note.E, note.A, note.B, note.As, note.A, note.G, note.E, note.G, note.A, note.F, note.G, note.E, note.C, note.D, note.D, note.C]
var dr = [0.1, 0.1, 0.1, 0.3, 0.4, 0.5, 0.6, 0.1, 0.1, 0.1, 0.2, 0.3, 0.2, 0.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.1, 0.2, 0.2]
//       [0.1, 0.2, 0.8, 0.1, 0.4, 0.6, 0.4, 0.9, 0.1, 0.4, 0.1, 0.1, 0.2, 0.6, 0.5, 0.1, 0.1, 0.4, 0.7, 0.2, 0.2, 0.3, 0.2, 0.1]
// var music = [note.C, note.D, note.E, note.C]
//var music = [note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C, note.C]

var fatorDeMutacao = 0.05
var worst

var tamanhoPopulacao = music.length * 4
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
    $('#melhor_ind').append('<tr><th scope="row">' + menorIndividuoHistorico.geracao + '</th><td>' + menorIndividuoHistorico.individuo.toString + '</td><td>' + menorIndividuoHistorico.individuo.coincidence + '</td></tr>')
  }

  crossover (i1, i2, posicaoPop) {
    var novoInd1 = new Individuo(music.length)
    var novoInd2 = new Individuo(music.length)
    novoInd1.resetTrack()
    novoInd2.resetTrack()
    this.gerarMusica(novoInd1, i1, i2)
    this.gerarMusica(novoInd2, i2, i1)
    this.pop.individuos[posicaoPop] = novoInd1
    this.pop.individuos[posicaoPop + 1] = novoInd2
    this.pop.individuos[posicaoPop + 2] = i1
    this.pop.individuos[posicaoPop + 3] = i2
  }

  gerarMusica (novoInd, pai1, pai2) {
    var localCoincidence
    var vetMusic = []
    for (var i = 0; i < pai1.frequencies.length; i++) {
      localCoincidence = {}
      localCoincidence.value = Math.abs(music[i] - pai1.frequencies[i]) + Math.abs(dr[i] - pai1.durations[i])
      localCoincidence.location = i
      vetMusic[i] = localCoincidence
    }

    vetMusic.sort(function (a, b) {
      if (a.value === b.value) {
        return 0
      }
      return (a.value < b.value) ? -1 : 1
    })

    for (var i = 0; i < vetMusic.length / 2; i++) {
      novoInd.frequencies[vetMusic[i].location] = pai1.frequencies[vetMusic[i].location]
      this.definirNovoTempo(novoInd, pai1, vetMusic[i].location)
    }

    for (var i = 0; i < pai2.frequencies.length; i++) {
      if (novoInd.frequencies[i] === -1) {
        novoInd.frequencies[i] = pai2.frequencies[i]
        this.definirNovoTempo(novoInd, pai2, i)
      }
    }
  }



  definirNovoTempo (novoInd, paiInd, pos){
    if(paiInd.durations[pos] > dr[pos]){
      novoInd.durations[pos] = paiInd.durations[pos] - 0.1
    }else if(paiInd.durations[pos] < dr[pos]){
      novoInd.durations[pos] = paiInd.durations[pos] + 0.1
    }else{
      novoInd.durations[pos] = paiInd.durations[pos]
    }
    novoInd.durations[pos] = this.round(novoInd.durations[pos], 1)
  }

  round(num, decimals) {
    var multiplier = Math.pow(10, decimals);
    if (typeof(num) != "number") {
      return null;
    }
    if (decimals > 0) {
      return Math.round(num * multiplier) / multiplier;
    } else {
      return Math.round(num);
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
      $(id).append('<tr><th scope="row">' + i + '</th><td>' + this.individuos[i].toString + '</td><td>' + this.individuos[i].coincidence + '</td></tr>')
    }
  }
}

class Individuo {
  constructor (size) {
    this.frequencies = []
    this.durations = []
    for (var i = 0; i < size; i++) {
      this.frequencies[i] = notes[Math.floor(Math.random() * 100 % notes.length)]
      this.durations[i] = Math.floor(Math.random() * 10) / 10
      if(this.durations[i] === 0){
        this.durations[i] = 0.1
      }
    }
  }

  resetTrack () {
    for (var i = 0; i < this.frequencies.length; i++) {
      this.frequencies[i] = -1
      this.durations[i] = -1
    }
  }

  copyIndividuo (old) {
    for (var i = 0; i < old.frequencies.length; i++) {
      this.frequencies[i] = old.frequencies[i]
      this.durations[i] = old.durations[i]
    }
  }

  get coincidence () {
    var sum = 0
    for (var index = 0; index < this.frequencies.length; index++) {
      sum += Math.abs(music[index] - this.frequencies[index]) + Math.abs(dr[index] - this.durations[index]) 
    }
    return sum
  }

  getFrequencies () {
    return this.frequencies
  }

  get toString () {
    var out = ''
    for (var index = 0; index < this.frequencies.length; index++) {
      out += this.frequencies[index]
      if (index !== this.frequencies.length - 1) {
        out += ', '
      }
    }
    return out
  }

  mutate () {
    var mutateChance = Math.random()
    if (mutateChance > fatorDeMutacao) {
      return
    }
    var pos = Math.floor(Math.random() * 100 % this.frequencies.length)
    // this.frequencies[pos] = note.B + (Math.random() * (note.C - note.B))
    this.frequencies[pos] = notes[Math.floor(Math.random() * 100 % notes.length)]
    this.durations[pos] = Math.floor(Math.random() * 10) / 10
    if(this.durations[pos] === 0){
        this.durations[pos] = 0.1
      }
  }
}
