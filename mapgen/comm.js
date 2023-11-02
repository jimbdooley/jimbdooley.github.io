
function get(url, time_limit_ms=5000) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

    xhttp.open("GET", url);
    xhttp.send(); 
    setTimeout(() => {
      reject(`error GETting "${url}" after ${time_limit_ms} ms`);
    }, time_limit_ms);
  });
}

function post(url, dataStr, time_limit_ms=5000) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

    xhttp.open("POST", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(dataStr); 
    setTimeout(() => {
      reject(`error POSTing "${url}" after ${time_limit_ms} ms`);
    }, time_limit_ms);
  });
}

async function comm_test() {
  const p_get = document.createElement('p');
  p_get.textContent = await get('get_test');
  document.body.appendChild(p_get);
  const p_post = document.createElement('p');
  p_post.textContent = await post('post_test', JSON.stringify({msg: "This sentence is written on a client side js file."}));
  document.body.appendChild(p_post);
  const p3 = document.createElement('p');
  p3.textContent = "comment out the execution of 'comm_test' at the bottom of comm.js";
  document.body.appendChild(p3);
}
//comm_test();