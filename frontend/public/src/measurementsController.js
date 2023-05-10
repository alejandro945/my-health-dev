function retrieveMeasurementInformation() {
  if (!sessionStorage.getItem('patientid')) {
    console.log('Redirecting to login');
    window.location = '/login.html';
    return;
  }

  const url = './measurements';
  const params = `id=${sessionStorage.getItem('patientid')}`;

  const http = new XMLHttpRequest();

  http.open('GET', `${url}?${params}`, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      console.log('MEDIDAS-----');
      console.log(http.responseText);
      const measurementdata = JSON.parse(http.responseText);
      console.log(measurementdata);

      const smoker = document.getElementById('smoker');
      smoker.innerHTML = measurementdata.smokerstatus;

      const height = document.getElementById('height');
      height.innerHTML = `${measurementdata.height}m`;

      const weight = document.getElementById('weight');
      weight.innerHTML = `Weight: ${measurementdata.weight} kg`;

      const bmi = document.getElementById('bmi');
      const bmicalc = Math.round(measurementdata.weight / (measurementdata.height * measurementdata.height));

      bmi.innerHTML = `BMI: ${bmicalc} [${measurementdata.bmirange}]`;

      drawBloodPressureChart(measurementdata.sys, measurementdata.dia);

      const patientlogout = document.getElementById('logout');
      patientlogout.innerHTML = `${sessionStorage.getItem('patientusername')}/logout`;
    }
  };
  http.send(null);
}

function drawBloodPressureChart(sys, dia) {
  const c = document.getElementById('canvas');

  if (c != undefined) {
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#99DDE5';
    ctx.beginPath();
    ctx.stroke();
    ctx.lineWidth = 0.8;

    const xbaseline = 57.5;
    const ybaseline = 59.5;
    const numberOfBoxes = 6;
    let boxcount = 0;
    const increment = 30;
    const widthLimit = 240;
    const heightLimit = 200;

    const selectedBox = 3;

    const yLabels = ['120', '130', '140', '160', '180', ''];
    const yLabelsRail = 20;

    const labels = ['Grade 3 Hypertension', 'Grade 2 Hypertension', 'Grade 1 Hypertension', 'High-Normal', 'Normal', 'Optimal'];

    const labelRail = 75;

    for (boxcount = 0; boxcount < numberOfBoxes; boxcount++) {
      if (boxcount == selectedBox) {
        ctx.fillStyle = '#CCEEF2';
      } else {
        ctx.fillStyle = 'white';
      }

      const delta = increment * boxcount;
      ctx.fillRect(xbaseline, ybaseline + delta, widthLimit - delta, heightLimit - delta);
      ctx.strokeRect(xbaseline, ybaseline + delta, widthLimit - delta, heightLimit - delta);

      ctx.fillStyle = '#0F4C81';
      ctx.font = '12px sans-serif';

      const yLabelpoint = (heightLimit + 15) - boxcount * increment;
      const labelPoint = (heightLimit - 120) + boxcount * increment;

      ctx.fillText(yLabels[boxcount], yLabelsRail, yLabelpoint);

      ctx.fillStyle = '#00ABC0';
      ctx.font = '11px sans-serif';

      ctx.fillText(labels[boxcount], labelRail, labelPoint);
    }

    ctx.fillStyle = '#0F4C81';
    ctx.strokeStyle = '#0F4C81';

    ctx.font = '12px sans-serif';

    ctx.fillText('SYS', 20, 265);
    ctx.fillText('DIA', 50, 285);

    ctx.fillStyle = '#0F4C81';
    ctx.font = '12px sans-serif';

    ctx.fillText('80', 143, 285);
    ctx.fillText('85', 175, 285);
    ctx.fillText('90', 205, 285);
    ctx.fillText('100', 230, 285);
    ctx.fillText('110', 260, 285);

    ctx.font = '14px sans-serif';
    ctx.fillText('Blood Pressure, last tested 01.08.2019', 20, 35);

    // ctx.lineWidth = 3;
    ctx.fillStyle = '#0F4C81';
    ctx.beginPath();
    ctx.arc(200, 200, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}
