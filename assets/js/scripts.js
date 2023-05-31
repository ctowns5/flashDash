var body = document.body;
var weatherArray = [];


// $("#currentDay").text(dayjs().format("MMMM D YYYY, h:mm:ss a"));

function dogFetchAndDisplay() {
  //The dog photo will be loaded into the HTML element with ID "dash-dog-photo"
  // Ideally, the dog photo container can change height to accomodate different aspect ratios
  var dogURL;
  var requestURL = "https://dog.ceo/api/breeds/image/random";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      dogURL = data.message;
      console.log("URL of dog photo is: " + dogURL); //Will display the URL of the dog photo in the console
      $("#dash-dog-photo").attr("src", dogURL);
    });
}

dogFetchAndDisplay();

function weatherFetch() {
  var weatherURL;
  var weatherRequestURL = "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=68415bfdd25c70f3ac38b519e186d986";
  fetch(weatherRequestURL, weatherURL)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (weatherURL) {
      console.log(weatherURL.main.temp);
      var tempDisplay = document.createElement("p");
      temperature = weatherURL.main.temp;
      tempDisplay.setAttribute("style", "color: white");
      console.log(temperature);
      tempDisplay.textContent = temperature;
      body.appendChild(tempDisplay);
      

    });
}

weatherFetch();
