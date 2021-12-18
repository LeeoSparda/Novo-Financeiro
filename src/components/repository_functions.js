//recebe uma data e retorna ela em uma string
export function stringDate(value) {

    var days = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sabádo',
    ];
    var mounth = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    let date = new Date(value);
    let string_date =
      days[date.getDay()] +
      ' ' +
      date.getUTCDate() +
      ' ' +
      mounth[date.getMonth()] +
      ' às ' +
      date.getHours() +
      'h' +
      date.getUTCMinutes();
    return string_date;
  }
  export  function formatarMoeda(valor) {
    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");
  
    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
  
    return valor;
  }