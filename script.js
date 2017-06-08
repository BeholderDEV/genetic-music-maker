//             A    B   C    D   E
var pesos = [
              [-01, 05, 10, 15, 25], // A
              [ 05,-01, 13, 11, 18], // B
              [ 10, 13,-01, 06, 14], // C
              [ 15, 11, 06,-01, 20], // D
              [ 25, 18, 14, 20,-01]  // E
            ]

var cidades = ['A','B','C','D','E']

var tamanho_populacao = 16
var fator_de_mutacao = 0.5



$(document).ready(function(){
  var pop = new Populacao()
  pop.makeATable()
})

class Ambiente {
  constructor() {
    this.pop = new Populacao()
    this.pop.makeATable()
  }

  crossover (i1, i2){
    var vet1 = i1.vetor_individuos
    var vet2 = i2.vetor_individuos
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

  mutate( ) {
    var i = Math.random()*100 % cidades.length
    var j = Math.random()*100 % cidades.length
  }
}
