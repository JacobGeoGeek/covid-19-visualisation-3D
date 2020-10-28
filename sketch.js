let angle = 0.5;

const radius = 200;

let contries;
let covidData;
let earth;
let dataProcess = [];
let clat = 0;
let clong = 0;

function processData() {
  countries.rows.forEach((row) => {
    let countryName = row.get("name");
    let lat = row.get("latitude");
    let long = row.get("longitude");
    let countryStats = covidData.countries_stat.find((x) => x.country_name === countryName);

    if (countryStats) {
      let numberCases = Number(countryStats.cases.replace(/,/g, ""));
      dataProcess.push({ countryName, lat, long, numberCases });
    }
  });

  let minCases = dataProcess.reduce((prev, curr) => (prev.numberCases < curr.numberCases ? prev : curr));
  let maxCases = dataProcess.reduce((prev, curr) => (prev.numberCases > curr.numberCases ? prev : curr));

  let min = sqrt(minCases.numberCases);
  let max = sqrt(maxCases.numberCases);
  dataProcess.forEach((country) => {
    country.ratio = map(sqrt(country.numberCases), min, max, 1, 200);
  });
}

function preload() {
  earth = loadImage("earth.jpg");
  countries = loadTable("countries.csv", "csv", "header");
  httpDo(
    "https://rapidapi.p.rapidapi.com/api",
    {
      headers: {
        "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
        "x-rapidapi-key": "9Zn0q7vRfkmshAkYYPYUbwWPNRBep19vtwSjsn8daKMRir7wq4",
      },
    },
    function (res) {
      covidData = JSON.parse(res);
      processData();
    },
    function (err) {
      console.log(err);
    }
  );
}

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(51);
  orbitControl();

  rotateY(angle);

  fill(200);
  noStroke();
  texture(earth);
  sphere(radius);

  if (dataProcess.length !== 0) {
    dataProcess.forEach((country) => {
      let theta = radians(country.lat);
      let phi = radians(country.long);

      let x = radius * cos(theta) * sin(phi + PI);
      let y = -radius * sin(theta);
      let z = radius * cos(theta) * cos(phi + PI);

      let pos = createVector(x, y, z);
      let xaxis = createVector(1, 0, 0);
      let angleb = abs(pos.angleBetween(xaxis));
      let raxis = xaxis.cross(pos);

      push();
      translate(x, y, z);
      rotate(angleb, raxis);
      fill(255, 255, 255);
      box(country.ratio, 5, 5);
      pop();
    });
  }
}
