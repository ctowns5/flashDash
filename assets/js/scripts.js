var body = document.body;
var weatherDisplay = document.createElement("section");
var tempDisplay = document.createElement("p");
var weatherStatus = document.createElement("p");
weatherDisplay.setAttribute("style", "color: black");

$("#currentDay").text(dayjs().format("MMMM D YYYY, h:mm:ss a"));
$(".saveBtn").on("click", function () {
  var text = $(this).siblings(".description").val();
  var time = $(this).parent().attr("id");
  localStorage.setItem(time, text);
});

$("#note1 .description").val(localStorage.getItem("note1"));
$("#note2 .description").val(localStorage.getItem("note2"));
$("#note3 .description").val(localStorage.getItem("note3"));
$("#note4 .description").val(localStorage.getItem("note4"));
$("#note5 .description").val(localStorage.getItem("note5"));
$("#note6 .description").val(localStorage.getItem("note6"));
$("#note7 .description").val(localStorage.getItem("note7"));
$("#note8 .description").val(localStorage.getItem("note8"));
$("#note9 .description").val(localStorage.getItem("note9"));

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
  var weatherRequestURL =
    "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=68415bfdd25c70f3ac38b519e186d986";
  fetch(weatherRequestURL, weatherURL)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (weatherURL) {
      temperature = weatherURL.main.temp;
      console.log(weatherURL);
      console.log(weatherURL.weather[0]);
      tempDisplay.textContent = "Temperature: " + temperature + " degrees";
      body.appendChild(weatherDisplay);
      weatherDisplay.appendChild(tempDisplay);
      weatherStatus.textContent = "Status: " + weatherURL.weather[0].main;
      weatherDisplay.appendChild(weatherStatus);
    });
}

weatherFetch();
