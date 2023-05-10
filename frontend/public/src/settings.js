const urlfield = document.getElementById('url');
const nodebutton = document.getElementById('nodebutton');
const javabutton = document.getElementById('javabutton');
const localbutton = document.getElementById('localbutton');

const MODE = {
  TEST: 1,
  Z: 2,
  OPENSHIFT: 3,
};

function checkurl() {
  if (validURL(urlfield.value)) {
    nodebutton.style.opacity = 1;
    javabutton.style.opacity = 1;
  } else {
    nodebutton.style.opacity = 0.3;
    javabutton.style.opacity = 0.3;
  }

  getMode();
}

function setRunMode(text) {
  const rm = document.getElementById('runmode');
  rm.innerHTML = text;
}

function getMode() {
  const url = './mode';

  const http = new XMLHttpRequest();

  http.open('GET', url, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      const patientdata = JSON.parse(http.responseText);
      console.log(http.responseText);
      const response = JSON.parse(http.responseText);
      const mode = parseInt(response.mode);

      switch (mode) {
        case MODE.TEST:
          highlightLocal();
          break;

        case MODE.NODE:
          highlightNode();
          break;

        case MODE.OPENSHIFT:
          highlightJava();
          break;
      }
    }
  };
  http.send(null);
}

getMode();

function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
  + '((([a-z-\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' // domain name
  + '((\\d{1,3}\\.){3}\\d{1,3}))' // ip (v4) address
  + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port
  + '(\\?[;&amp;a-z\\d%_.~+=-]*)?' // query string
  + '(\\#[-a-z\\d_]*)?$', 'i');

  return !!pattern.test(str);
}

function highlightJava() {
  localbutton.classList.remove('settingsbuttonselected');
  nodebutton.classList.remove('settingsbuttonselected');
  javabutton.classList.add('settingsbuttonselected');
  javabutton.style.opacity = 1;
  setRunMode('Currently reading data from a Java OpenShift microservice');
}

function chooseJava() {
  if (validURL(urlfield.value)) {
    highlightJava();
    setModeOnServer(MODE.OPENSHIFT);
    console.log('clicked java');
  }
}

function highlightNode() {
  localbutton.classList.remove('settingsbuttonselected');
  javabutton.classList.remove('settingsbuttonselected');
  nodebutton.classList.add('settingsbuttonselected');
  nodebutton.style.opacity = 1;
  setRunMode('Currently reading data from a Node.js application');
}

function setModeOnServer(mode) {
  const url = './mode';
  const params = `mode=${mode}&url=${urlfield.value}`;
  console.log(`esto es params ${params}`);
  const http = new XMLHttpRequest();

  http.open('POST', `${url}?${params}`, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      // sessionStorage.removeItem(patientid);
      // sessionStorage.removeItem(patientusername);
      sessionStorage.setItem('patientUImode', mode);

      window.location = '/login.html';
    }
  };
  http.send(null);
}

function chooseNode() {
  if (validURL(urlfield.value)) {
    setModeOnServer(MODE.NODE);
    highlightNode();
    console.log('clicked node');
  }
}

function highlightLocal() {
  localbutton.classList.add('settingsbuttonselected');
  javabutton.classList.remove('settingsbuttonselected');
  nodebutton.classList.remove('settingsbuttonselected');
  setRunMode('Currently reading data from a Node OpenShift microservice - demo mode');
}

function chooseLocal() {
  setModeOnServer(MODE.TEST);
  highlightLocal();
  console.log('clicked local');
}
