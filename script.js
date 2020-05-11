document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';

  let container = document.getElementById('container');

  let selectedPage = 1;

  let diffDays = 0;

  function extractData(page) {
    fetch(url)
    .then(response => response.json())
    // retorna uma promise              
    .then(result => {      
      showItens(result, page);
    })
    .catch(err => {
      // trata se alguma das promises falhar
      console.error('Failed retrieving information', err);
    });
  }

  extractData(selectedPage, diffDays);

  function clearPage() {
    let cont = document.getElementById('content');
    let foot = document.getElementById('pagination');

    cont.parentNode.removeChild(cont);
    foot.parentNode.removeChild(foot);
  };
  // fim limpar dados

  //paginacao
  function listItems(items, pageActual, limitItems) {
    let result = [];
    let totalPage = Math.ceil(items.length / limitItems);
    let count = (pageActual * limitItems) - limitItems;
    let delimiter = count + limitItems;

    if (pageActual <= totalPage) {
      for (let i = count; i < delimiter; i++) {
        if (items[i] != null) {
          result.push(items[i]);
        }
        count++;
      }
    }

    return result;
  };
  // fim paginacao

  //troca de pagina  
  function changePage(page) {    
    clearPage();
    extractData(page);
  }
  //fim troca de pagina

  //Geração de dados
  function showItens(result, selectedPage) {
    let cont = document.createElement('div');
    container.appendChild(cont);

    cont.setAttribute('id', 'content');
    cont.classList.add('content');

    let pagination = listItems(result, selectedPage, 6);
    let totalPages = Math.ceil(result.length / 6);

    for (const res of pagination) {
      let div = document.createElement('div');
      let img = document.createElement('img');

      let info = document.createElement('div');
      let name = document.createElement('h4');    
      let price = document.createElement('p');

      cont.appendChild(div);
      div.appendChild(img);

      div.appendChild(info);
      info.appendChild(name);
      info.appendChild(price);

      name.innerText = res.name;
      img.src = res.photo;
      price.innerText = `Valor diária: R$ ${res.price},00`;

      if (diffDays > 1) {
        let totalPrice = document.createElement('p');
        info.appendChild(totalPrice);
        totalPrice.innerText = `Estadia de ${diffDays} dias: R$ ${res.price * diffDays},00`;
      }

      div.classList.add('card');
      info.classList.add('cardInfo');
    }

    let foot = document.getElementById('footer');
    let div = document.createElement('div');

    foot.appendChild(div);

    div.setAttribute('id', 'pagination');

    for (let i = 1; i <= totalPages; i++) {      

      let page = document.createElement('button');

      div.appendChild(page);
      page.innerText = i;
      page.setAttribute('id', i);

      page.onclick = () => {
        changePage(i);
      };

      page.classList.add('pagination');
    }
  }

  let btnDate = document.getElementById('btnDate');
  btnDate.onclick = () => {
    let initDate = document.getElementById('initDate').value;
    let finalDate = document.getElementById('finalDate').value;

    diffDays = Math.ceil(Math.abs(Date.parse(finalDate) - Date.parse(initDate)) / (1000 * 60 * 60 * 24)); 

    clearPage();
    extractData(selectedPage);
  }
})
