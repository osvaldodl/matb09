"use strict";

function recuperarUsuarios() {
  console.log('chamou');
  recuperarJson('http://localhost:3000/usuario').then(function (response) {
    return criarTabela(response.data);
  })["catch"](function (error) {
    return console.warn(error);
  });
}

function conectar() {
  var dbcon = {
    host: document.getElementById('host').value,
    port: document.getElementById('port').value,
    user: document.getElementById('user').value,
    password: document.getElementById('password').value,
    base: document.getElementById('base').value
  };
  Promise.all([sendJson('http://localhost:3000/connect', JSON.stringify(dbcon))]).then(function (response) {
    return recuperarUsuarios();
  })["catch"](function (error) {
    return console.warn(error);
  });
}

function sendJson(url, json) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Concluido');
          resolve('OK');
        } else {
          reject('Erro na requisição');
        }
      }
    };
  });
}

function recuperarJson(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('OK');
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject('Erro na requisição');
        }
      }
    };
  });
}

function criarTabela(data) {
  document.getElementById("form").innerHTML = "";
  console.log(data);
  var col = [];

  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  var table = document.createElement("table");
  var tr = table.insertRow(-1);

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  for (var i = 0; i < data.length; i++) {
    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = data[i][col[j]];
    }
  }

  console.log(data);
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}
