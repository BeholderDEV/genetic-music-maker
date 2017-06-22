
class GraphController {
  constructor () {
    this.geracao = 0
    this.colorNames = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    this.config = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Melhor Individuo da Geração',
          backgroundColor: this.colorNames[3],
          borderColor: this.colorNames[3],
          data: [
          ],
          fill: false
        },
        {
          label: 'Pior Individuo da Geração',
          backgroundColor: this.colorNames[0],
          borderColor: this.colorNames[0],
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
  }

  addToGraph (populacao) {
    var element = populacao.individuos
    element.sort(function (a, b) { return a.coincidence - b.coincidence })
    this.config.data.labels.push(this.geracao)
    this.geracao++
    this.config.data.datasets[0].data.push(element[0].coincidence)
    this.config.data.datasets[1].data.push(element[element.length - 1].coincidence)
  }

  drawChart (divId) {
    var ctx = $(divId).get(0).getContext('2d')
    window.myDoughnut = new Chart(ctx, this.config)
  }
}
