$(document).ready(function () {
  var note = new Note()
  var tamanho = 4
  var music = [note.C, note.D, note.E, note.F]
  var individuo = new Individuo(tamanho)
  var mySynth2 = new Synthos()
  mySynth2.setType('sine')
  mySynth2.setBpm(200)
  for (var index = 0; index < tamanho; index++) {
    //mySynth2.addFrequency(music[index])
    mySynth2.addFrequency(individuo.frequencies[index])
  }
  mySynth2.play()
})

class Individuo {
  constructor (size) {
    this.frequencies = []
    this.note = new Note()

    for (var i = 0; i < size; i++) {
      this.frequencies[i] = this.note.B + (Math.random() * (this.note.C - this.note.B))
    }
  }
}
