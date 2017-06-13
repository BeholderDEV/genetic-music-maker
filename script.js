//             A    B   C    D   E  F
var pesos = [
              [-01, 05, 10, 15, 25, 10], // A
              [ 05,-01, 13, 11, 18, 12], // B
              [ 10, 13,-01, 06, 14, 02], // C
              [ 15, 11, 06,-01, 20, 23], // D
              [ 25, 18, 14, 20,-01, 08],  // E
              [ 10, 12, 02, 23, 08,-01]  // F
            ]

var cidades = ['A','B','C','D','E','F']

var tamanho_populacao = cidades.length * 2
var fator_de_mutacao = 0.05
var fatorCrossover = 0.9

var menor_de_todos = 999999999999
$(document).ready(function(){
  // var pop = new Populacao()
  // pop.makeATable()
  var amb = new Ambiente()
  amb.evoluirPopulacao(8001)

})

class Ambiente {
  constructor() {
    this.pop = new Populacao()
    this.pop.makeATable('#ind')
  }

  evoluirPopulacao(iteracoes){
    // console.log("aa")
    for (var i = 0; i < iteracoes; i++) {
      var melhoresIndTorneio = []
      var k = 0
      for (var j = 0; j < tamanho_populacao / 2; j++) {
        melhoresIndTorneio[j] = this.findBestIndividuo(this.pop.vetor_individuos[k], this.pop.vetor_individuos[k + 1])
        k = k + 2
        if(melhoresIndTorneio[j].custo < menor_de_todos){
          menor_de_todos = melhoresIndTorneio[j].custo
        }
      }

      // Considerar depois que crossover pode não ocorrer
      for (var j = 0; j < melhoresIndTorneio.length; j = j + 2) {
        var crossChance = Math.random()
        if(j === melhoresIndTorneio.length - 1){
          if(melhoresIndTorneio.length % 2 === 1){
            this.crossover(melhoresIndTorneio[j], melhoresIndTorneio[j - 1], j)
            break
          }
        }
        if(crossChance < fatorCrossover){
          this.crossover(melhoresIndTorneio[j], melhoresIndTorneio[j + 1], j)
        }else{
          this.pop.setIndividuo(j + 1, melhoresIndTorneio[j])
          this.pop.setIndividuo(j + 2, melhoresIndTorneio[j + 1])
        }

      }

      for (var j = 0; j < tamanho_populacao; j++) {
        this.pop.vetor_individuos[j].mutate()
      }
    }

    this.pop.makeATable('#ind2')
    console.log(menor_de_todos)
  }

  findBestIndividuo (ind1, ind2){
    if(ind1.custo < ind2.custo){
      return ind1
    }
    return ind2
  }


//http://www.theprojectspot.com/tutorial-post/applying-a-genetic-algorithm-to-the-travelling-salesman-problem/5
  crossover (i1, i2, posicaoPop){
    var vet1 = i1.vetor_caminho
    var vet2 = i2.vetor_caminho
    var novoInd1 = new Individuo()
    var novoInd2 = new Individuo()
    novoInd1.resetCaminho()
    novoInd2.resetCaminho()
    this.gerarNovoCaminho(novoInd1, vet1, vet2)
    this.gerarNovoCaminho(novoInd2, vet2, vet1)
    this.pop.setIndividuo(posicaoPop + 1, novoInd1)
    this.pop.setIndividuo(posicaoPop + 2, novoInd2)
  }

  encontrarMenorFita(caminhoPai1){
    var size = caminhoPai1.length / 2
    var menor = 99999999999
    var melhorFita = caminhoPai1.length
    for (var i = 0; i < caminhoPai1.length/ 2 ; i++) {
      var custo = 0
      for (var j = i; j < i+size-1 ; j++) {
        custo += pesos[caminhoPai1[j]][caminhoPai1[j+1]]
      }
      if(custo < menor){
        menor = custo
        //console.log('cust '+custo+' fita = '+(i+size-1))
        melhorFita = i+size-1
      }
    }
    return melhorFita
  }

  gerarNovoCaminho(novoInd, caminhoPai1, caminhoPai2){
    var pos = this.encontrarMenorFita(caminhoPai1)
    //console.log(pos)
    for (var i = 0; i < caminhoPai1.length / 2; i++) {
      novoInd.setParteCaminho(pos - i ,caminhoPai1[pos - i])
    }
    for (var i = 0; i < caminhoPai2.length; i++) {
      if(novoInd.caminho[i] === -1){
        for (var j = 0; j < caminhoPai2.length; j++) {
          if(!this.validarNovaParteCaminho(novoInd.caminho, caminhoPai2[j])){
            novoInd.setParteCaminho(i, caminhoPai2[j])
          }
        }

      }
    }
  }

  validarNovaParteCaminho(caminhoNovo, novaParteCaminho){
    for (var i = 0; i < caminhoNovo.length; i++) {
      if(caminhoNovo[i] === novaParteCaminho){
        return true
      }
    }
    return false
  }

}
class Populacao {
  constructor() {
    this.individuos = []
    for(var i = 0 ; i < tamanho_populacao ; i++) {
      this.individuos[i] = new Individuo()
    }
  }

  get vetor_individuos(){
    return this.individuos
  }

  setIndividuo(posicao, Individuo){
    this.individuos[posicao] = Individuo
  }

  makeATable(id) {
    this.individuos.sort(function(a, b){return a.custo-b.custo})
    var sum = 0
    for(var i = 0 ; i < tamanho_populacao ; i++) {
      sum += this.individuos[i].custo
      $(id).append('<tr><th scope="row">'+i+'</th><td>'+this.individuos[i].percurso+'</td><td>'+this.individuos[i].custo+'</td></tr>')
    }
    $(id).append('<tr><th scope="row" colspan="2">TOTAL</th><td>'+sum+'</td></tr>')
  }
}
class Individuo {
  constructor() {
    this.caminho = []

    for(var i = 0 ; i < cidades.length ; i++) {
      this.caminho[i] = i
    }
    this.caminho.sort(function(a, b){
      var j = Math.random()*100
      if(j <= 30){
        return -1
      }else if(j <= 60){
        return 0
      }
      else{
        return 1
      }
    })

  }

  get custo(){
    var out = 0
    for(var i = 0 ; i < cidades.length-1 ; i++) {
      out += pesos[this.caminho[i]][this.caminho[i+1]]
    }
    out += pesos[this.caminho[cidades.length-1]][this.caminho[0]]
    return out
  }

  get percurso(){
    var out = ''
    for(var i = 0 ; i < cidades.length ; i++) {
      out = out +' '+ this.caminho[i]
    }
    return out
  }

  get vetor_caminho(){
    return this.caminho
  }

  setParteCaminho(posicao, alteracao){
    this.caminho[posicao] = alteracao
  }

  resetCaminho(){
    for (var i = 0; i < this.caminho.length; i++) {
      this.caminho[i] = -1
    }
  }

  mutate() {
    var mutateChance = Math.random()
    if(mutateChance > fator_de_mutacao){
      return
    }
    var i
    var j
    do{
      i = Math.random()*100 % cidades.length
      j = Math.random()*100 % cidades.length
    }while(i == j)
    var aux = this.caminho[i]
    this.caminho[i] = this.caminho[j]
    this.caminho[j] = aux
  }
}
