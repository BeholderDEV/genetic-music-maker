//             A    B   C    D   E
var pesos = [
              [-01, 05, 10, 15, 25], // A
              [ 05,-01, 13, 11, 18], // B
              [ 10, 13,-01, 06, 14], // C
              [ 15, 11, 06,-01, 20], // D
              [ 25, 18, 14, 20,-01]  // E
            ]

var cidades = ['A','B','C','D','E']

var tamanho_populacao = cidades.length * 2 - 1
var fator_de_mutacao = 0.05
var fatorCrossover = 0.9


$(document).ready(function(){
  // var pop = new Populacao()
  // pop.makeATable()
  var amb = new Ambiente()
  amb.evoluirPopulacao(1)
})

class Ambiente {
  constructor() {
    this.pop = new Populacao()
  }

  evoluirPopulacao(iteracoes){
    for (var i = 0; i < iteracoes; i++) {
      var melhoresIndTorneio = []
      var k = 0
      for (var j = 0; j < tamanho_populacao / 2 - 1; j++) {
        melhoresIndTorneio[j] = this.findBestIndividuo(this.pop.vetor_individuos[k], this.pop.vetor_individuos[k + 1])
        k = k + 2
      }
      this.pop.setIndividuo(0, this.pop.vetor_individuos[tamanho_populacao - 1]);

      // Considerar depois que crossover pode não ocorrer
      for (var j = 0; j < melhoresIndTorneio.length; j = j + 2) {
        this.crossover(melhoresIndTorneio[j], melhoresIndTorneio[j + 1])
      }

      for (var j = 0; j < tamanho_populacao; j++) {
        this.pop.vetor_individuos[i].mutate()
      }
    }

  }

  findBestIndividuo (ind1, ind2){
    if(ind1.custo < ind2.custo){
      return ind1
    }
    return ind2
  }


//http://www.theprojectspot.com/tutorial-post/applying-a-genetic-algorithm-to-the-travelling-salesman-problem/5
  crossover (i1, i2){
    var vet1 = i1.vetor_caminho
    var vet2 = i2.vetor_caminho
    var novoInd1 = new Individuo()
    var novoInd2 = new Individuo()
    novoInd1.resetCaminho()
    novoInd2.resetCaminho()
    this.gerarNovoCaminho(novoInd1, vet1, vet2)
    this.gerarNovoCaminho(novoInd2, vet2, vet1)
  }

  gerarNovoCaminho(novoInd, caminhoPai1, caminhoPai2){
    for (var i = 0; i < caminhoPai1.length / 2; i++) {
      novoInd.setParteCaminho(caminhoPai1.length - 1 - i ,caminhoPai1[caminhoPai1.length - 1 - i])
    }
    for (var i = 0; i < caminhoPai2.length; i++) {
      if(novoInd.caminho[i] === -1){
        if(!this.validarNovaParteCaminho(novoInd.caminho, caminhoPai2[i])){
          novoInd.setParteCaminho(i, caminhoPai2[i])
        }
      }
    }
  }

  validarNovaParteCaminho(caminhoNovo, novaParteCaminho){
    for (var i = 0; i < caminhoNovo.length; i++) {
      if(caminhoNovo[i] == novaParteCaminho){
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

  makeATable() {
    for(var i = 0 ; i < tamanho_populacao ; i++) {
      $('#ind').append('<tr><th scope="row">'+i+'</th><td>'+this.individuos[i].percurso+'</td><td>'+this.individuos[i].custo+'</td></tr>')
    }
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
