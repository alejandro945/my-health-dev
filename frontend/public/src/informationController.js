function retrievePatientInformation() {
  if (!sessionStorage.getItem('patientid')) {
    console.log('Redirecting to login');
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX');

    window.location = '/login.html';
    return;
  }

  const url = './info';
  const params = `id=${sessionStorage.getItem('patientid')}`;
  console.log(`esto es params de information ${params}`);
  const http = new XMLHttpRequest();

  http.open('GET', `${url}?${params}`, true);
  console.log('hizo un get =================');
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      const patientdata = JSON.parse(http.responseText);
      console.log(http.responseText);
      fillUI(patientdata);
    }
  };
  http.send(null);
}

function retrieveDummyData() {
  const patientdata = {
    personal: {
      name: 'Ralph DAlmeida',
      age: 38,
      gender: 'male',
      street: '34 Main Street',
      city: 'Toronto',
      zipcode: 'M5H 1T1',
    },
    medications: ['Metoprolol', 'ACE inhibitors', 'Vitamin D'],
    appointments: ['2018-01-15 1:00 - Dentist', '2018-02-14 4:00 - Internal Medicine', '2018-09-30 8:00 - Pediatry'],
  };
  fillUI(patientdata);
}

function fillUI(patientdata) {
  const patientname = document.getElementById('name');
  patientname.innerHTML = patientdata.personal.name;

  const patientdetails = document.getElementById('details');
  patientdetails.innerHTML = `${patientdata.personal.age} years old`;

  const patientstreet = document.getElementById('street');
  patientstreet.innerHTML = patientdata.personal.street;

  const patientcity = document.getElementById('city');
  patientcity.innerHTML = patientdata.personal.city;

  const patientzipcode = document.getElementById('zipcode');
  patientzipcode.innerHTML = patientdata.personal.zipcode;

  const appointments = document.getElementById('appointments');

  patientdata.appointments.forEach((appointment) => {
    const box = document.createElement('div');
    box.className = 'boxitem';
    box.innerHTML = `<img class="stethascope" src="/images/stethascope.svg"><div class="boxitemlabel">${appointment}</div>`;
    appointments.appendChild(box);
  });

  const medications = document.getElementById('medications');

  patientdata.medications.forEach((medication) => {
    const box = document.createElement('div');
    box.className = 'boxitem';
    box.innerHTML = `<img class="beaker" src="/images/beaker.svg"><div class="boxitemlabel">${medication}</div>`;
    medications.appendChild(box);
  });

  const patientlogout = document.getElementById('logout');
  patientlogout.innerHTML = `${sessionStorage.getItem('patientusername')}/logout`;
}
