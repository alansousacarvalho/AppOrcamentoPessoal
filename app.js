class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == null || this[i] == "") {
        return false
      }
    }
    return true
  }

}

class Bd {

  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem('id') //null

    return parseInt(proximoId) + 1
  }

  gravar(d) {

    let id = this.getProximoId()
    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)

  }

  recuperarTodosRegistros() {
    //Array de despesas
    let despesas_array = Array()

    //Atribui os IDs existentes em LocalStorage na var. 'id'
    let id = localStorage.getItem('id')

    //recuperar todas as despesas cadastradas em LocalStorage
    for (let i = 1; i <= id; i++) {
      //recupera as despesas e transforma o JSON em Obj. Literal
      let despesa = JSON.parse(localStorage.getItem(i))

      //Possibilidade de índices pulados/removidos
      //Nesse caso, vamos pular esses índices
      if (despesa === null) {
        continue
      }

      despesa.id = i
      despesas_array.push(despesa)
    }
    return despesas_array
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()

    console.log(despesa)

    console.log(despesasFiltradas)

    //Ano
    if (despesa.ano != '') {
      console.log('Filtro do ano')
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //Mês
    if (despesa.mes != '') {
      console.log('Filtro do mês')
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //Dia
    if (despesa.dia != '') {
      console.log('Filtro do dia')
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }

    //Tipo
    if (despesa.tipo != '') {
      console.log('Filtro do tipo')
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }

    //Descrição
    if (despesa.descricao != '') {
      console.log('Filtro da descricao')
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }

    //Valor
    if (despesa.valor != '') {
      console.log('Filtro do valor')
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }

    return despesasFiltradas
  }

  remover(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

function cadastrarDespesa() {

  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if (despesa.validarDados()) {
    bd.gravar(despesa)
    modificarEstilo2()
    $('#modalRegistraDespesa').modal('show')

  } else {
    modificarEstilo1()
    $('#modalRegistraDespesa').modal('show')
  }


}

function modificarEstilo1() {
  document.getElementById('modal_titulo').innerHTML = "Erro na gravação"
  document.getElementById('modal_descricao').innerHTML = 'Existem campos obrigatórios que não foram preenchidos.'
  document.getElementById('modal_titulo-div').className = 'modal-header text-danger'
  document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
  document.getElementById('modal_btn').className = 'btn btn-danger'
}

function modificarEstilo2() {
  document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
  document.getElementById('modal_descricao').innerHTML = 'despesa cadastrada com sucesso.'
  document.getElementById('modal_titulo-div').className = 'modal-header text-success'
  document.getElementById('modal_btn').innerHTML = 'Voltar'
  document.getElementById('modal_btn').className = 'btn btn-success'

  //Limpa os dados após confirmar.
  let a = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor']
  for (let i in a) {
    document.getElementById(a[i]).value = ''
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros()
  }


  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''

  //Percorre o array despesas, listando cada 1 de forma dinâmica
  despesas.forEach(function (d) {

    //Cria a linha <tr>
    let linha = listaDespesas.insertRow()
    //Cria a linha <td>
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

    //Ajustar o tipo
    switch (d.tipo) {
      case '1': d.tipo = 'Alimentação'
        break;
      case '2': d.tipo = 'Educação'
        break;
      case '3': d.tipo = 'Lazer'
        break;
      case '4': d.tipo = 'Saúde'
        break;
      case '5': d.tipo = 'Transporte'
        break;
    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //botão exclusão
    let btn = document.createElement("button")
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function () {
      //remover despesa

      let id = this.id.replace('id_despesa_', '')
      //

      bd.remover(id)

      window.location.reload()
    }
    linha.insertCell(4).append(btn)
  })

  /*  
      <tr>
        0 = <td>15/03/2021</td>
        1 = <td>Alimentação</td>
        2 = <td>Compras do mês</td>
      </tr>
    */
}

function pesquisarDespesas() {
  ano = document.getElementById('ano').value
  mes = document.getElementById('mes').value
  dia = document.getElementById('dia').value
  tipo = document.getElementById('tipo').value
  descricao = document.getElementById('descricao').value
  valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)
}


