var body = document.body;
var weatherDisplay = document.createElement("section");
var tempDisplay = document.createElement("p");
var weatherStatus = document.createElement("p");
var lat;
var long;
var dayCondition;
//news API only works 100 times per day
var newsAPI = "pub_240369d694c5869e4939ab6db5cc197d1bae6";
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
initializeNotes();

function weatherFetch() {
  var weatherURL;
  var weatherRequestURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    la +
    "&lon=" +
    lo +
    "&units=imperial&appid=68415bfdd25c70f3ac38b519e186d986";
  fetch(weatherRequestURL, weatherURL)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (weatherURL) {
      var temperature = weatherURL.main.temp;
      var winds = weatherURL.wind.speed;
      var humid = weatherURL.main.humidity;
      var city = weatherURL.name;
      dayCondition = weatherURL.weather[0].icon;
      $("#dayCondition").attr(
        "src",
        "https://openweathermap.org/img/wn/" + dayCondition + "@2x.png"
      );
      tempDisplay.textContent = "Temperature: " + temperature + " degrees";
      weatherStatus.textContent = "Status: " + weatherURL.weather[0].main;
      temp.innerHTML = "Temperature: " + temperature + "°F";
      wind.innerHTML = "Wind: " + winds + " mph";
      humitidy.innerHTML = "Humidity: " + humid + "%";
      city.innerHTML = city;
      // console.log(weatherURL);
    });
}

function geoFetch(ci, st) {
  var geoURL;
  var geoRequestURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    ci +
    "," +
    st +
    ",US&limit=1&appid=68415bfdd25c70f3ac38b519e186d986";
  fetch(geoRequestURL, geoURL)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (geoURL) {
      coord = {
        lat: geoURL[0].lat,
        long: geoURL[0].lon,
      };
      weatherFetch(coord.lat, coord.long);
    });
}

// event listener for weather button
$(".weatherButton").on("click", function () {
  var cityInput = document.querySelector("#cityCode");
  var stateInput = document.querySelector("#stateCode");

  codes.cityCode = cityInput.value.trim();
  codes.stateCode = stateInput.value.trim();
  count++;
  geoFetch(codes.cityCode, codes.stateCode);

  // resets input to blank
  document.getElementById("cityCode").value = "";
  document.getElementById("stateCode").value = "";
});

function getAndSaveNotes() {
  //will use "each" function to build an array to save into local storage.
  //array will be filled with text contents of each extant note box
  console.log("get and save notes now");
}

function initializeNotes() {
  //This is to be run when the page is loaded. It loads notes from local storage then appends the empty "add note" at the end
  //First it checks if saved notes exist, then, if so, it loads them in, followed by the blank note used for creating new ones
  if (localStorage.getItem("savedNotes") == null) {
    //placeholder loop right here -------------------------------------------------------------
    for (i = 0; i < 5; i++) {
      var noteListItem = $("<li>", {
        class: "list-group-item d-flex",
      });
      var formattedTextArea = $("<textarea>", {
        class: "w-100 user-note-area",
        placeholder: "click to add notes",
      });
      formattedTextArea.data("noteFilled", "true");
      var closeButton = $("<button>", {
        type: "button",
        class: "btn-close close-note-button",
        "aria-label": "Close",
      });
      formattedTextArea.text("placeholder text #" + i); //This is where the data from the array of saved notes stuff is going to go
      noteListItem.append(formattedTextArea);
      noteListItem.append(closeButton);
      $("#note-list").append(noteListItem);
    }
  }
  noteListItem = $("<li>", {
    class: "list-group-item d-flex",
  });
  formattedTextArea = $("<textarea>", {
    class: "w-100 user-note-area",
    placeholder: "click to add notes",
  });
  formattedTextArea.data("noteFilled", "false");
  noteListItem.append(formattedTextArea);
  $("#note-list").append(noteListItem);
}

//event listener for "X" button by notes
$(".close-note-button").on("click", function (event) {
  console.log("Clicked close button on note");
  $(event.target).parent().remove();
  getAndSaveNotes(); //Save that you deleted a note into local storage
});

$("textarea").on("focusout", function (event) {
  console.log("took focus off of note");
  /* if (note text == ""){
    delete note
  }
  else{
    getAndSaveNotes
  }
  */
});

$("textarea").on("focusin", function (event) {
  console.log("put focus on note");
  console.log($(event.target).data("noteFilled"));
  if ($(event.target).data("noteFilled") == "false") {
    // console.log("entered conditional");
    var closeButton = $("<button>", {
      type: "button",
      class: "btn-close close-note-button",
      "aria-label": "Close",
    });
    var noteListItem = $("<li>", {
      class: "list-group-item d-flex",
    });
    var formattedTextArea = $("<textarea>", {
      class: "w-100 user-note-area",
      placeholder: "click to add notes",
    });
    $(event.target).parent().append(closeButton);
    $(event.target).data("noteFilled", "true"); //This will need to be moved into a conditional within the "focusout" area
    formattedTextArea.data("noteFilled", "false"); //This creates the new empty note element
    noteListItem.append(formattedTextArea);
    $(event.target).parent().parent().append(noteListItem);
  }
  /* if(noteIsEmpty){
    set noteIsEmpty attribute to "false";
    Append new blank note element
    append 'x' button to selected note element
  } */
});

function getnews() {
  var newsURL = (`https://newsdata.io/api/1/news?apikey=${newsAPI}&country=us&language=en`)
  fetch(newsURL)
      .then(news => news.json())
    .then((response) => {
      for (var i=0; i<response.totalResults; i++) {
        document.getElementById("newsdiv").innerHTML +=
          "<div><h1>" +
          response.results[i].title +
          "</h1>" +
          response.results[i].source_id +
          "<br>" +
          response.results[i].description +
          " <a href='" +
          response.results[i].link +
          "' target='_blank'>" +
          response.results[i].link +
          "</a></div>";
      }
      });
      }
getnews();