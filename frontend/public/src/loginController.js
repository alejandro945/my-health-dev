let mode;

let modes;

function getMode() {
  if (!sessionStorage.getItem('patientUImode')) {
    const url = './mode';

    const http = new XMLHttpRequest();

    http.open('GET', url, true);

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        const patientdata = JSON.parse(http.responseText);
        console.log(http.responseText);
        const response = JSON.parse(http.responseText);
        modes = response.modes;
        mode = response.mode;
        sessionStorage.setItem('patientUImode', mode);
        sessionStorage.setItem('patientUImodes', modes);
      }
    };
    http.send(null);
  } else {
    mode = sessionStorage.getItem('patientUImode');
  }
}

function field_focus(field, email) {
  if (field.value == email) {
    field.value = '';
  }
}

function field_blur(field, email) {
  if (field.value == '') {
    field.value = email;
  }
}

function login() {
  console.log('In login');

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (mode != 1) {
    const url = './login';
    const params = `username=${username}&password=${password}`;

    const http = new XMLHttpRequest();
    console.log(`a esto va a hacerle open${url}?`);
    http.open('POST', `${url}?${params}`, true);
    console.log(params);
    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        console.log('antes de parsear');
        console.log(`=== ${http.responseText}`);
        const patientid = http.responseText;
        console.log('despues de parsear');
        if (patientid) {
          console.log('entro a almacenar paciente');
          sessionStorage.setItem('patientid', patientid);
          sessionStorage.setItem('patientusername', username);
        }

        window.location = '/';
      }
    };
    http.send(null);
  } else {
    sessionStorage.setItem('patientid', username);
    sessionStorage.setItem('patientusername', username);
    window.location = '/';
  }
}

function logout() {
  sessionStorage.removeItem('patientid');
  sessionStorage.removeItem('patientusername');
  window.location = '/login.html';
}
