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

function weatherFetch(la,lo) {
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
      var condition = weatherURL.weather[0].description;
      dayCondition = weatherURL.weather[0].icon;
      $("#dayCondition").attr(
        "src",
        "https://openweathermap.org/img/wn/" + dayCondition + "@2x.png"
      );
      tempDisplay.textContent = "Temperature: " + temperature + " degrees";
      weatherStatus.textContent = "Status: " + weatherURL.weather[0].main;
      currentTemp.innerHTML = "Temperature: " + temperature + "°F";
      currentConditions.innerHTML = condition;
      currentHumidity.innerHTML = "Humidity: " + humid + "%";
      weatherPlace.innerHTML = city;
      $("#weatherIcon").attr("src", "https://openweathermap.org/img/wn/" + dayCondition + "@2x.png");
      console.log(weatherURL);
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
$("#weatherButton").on("click", function () {
  var cityInput = document.querySelector("#cityCode");
  var stateInput = document.querySelector("#stateCode");
  var codes = {}

  codes.cityCode = cityInput.value.trim();
  codes.stateCode = stateInput.value.trim();
  geoFetch(codes.cityCode, codes.stateCode);

  // resets input to blank
  document.getElementById("cityCode").value = "";
  document.getElementById("stateCode").value = "";
  $('#myModal').modal('toggle');
});

function getAndSaveNotes() {
  //will use "each" function to build an array to save into local storage.
  //array will be filled with text contents of each extant note box
  var notesArray = [];
  //The "i" in the function below is simply the index of the loop created in the "each" function
  // console.log($(".user-note-area"));
  $(".user-note-area").each(function (i) {
    // console.log("looping");
    // console.log(this);
    notesArray[i] = $(this).val();
  });
  localStorage.setItem("savedNotes", JSON.stringify(notesArray));
}

function initializeNotes() {
  //This is to be run when the page is loaded. It loads notes from local storage then appends the empty "add note" at the end
  //First it checks if saved notes exist, then, if so, it loads them in, followed by the blank note used for creating new ones
  var noteListItem = $("<li>", {
    class: "list-group-item d-flex",
  });
  var formattedTextArea = $("<textarea>", {
    class: "w-100 user-note-area",
    placeholder: "click to add notes",
  });
  var closeButton = $("<button>", {
    type: "button",
    class: "btn-close close-note-button",
    "aria-label": "Close",
  });

  if (localStorage.getItem("savedNotes") == null) {
    formattedTextArea.data("noteFilled", "false");
    noteListItem.append(formattedTextArea);
    $("#note-list").append(noteListItem); //completed blank note added to page
  } else {
    var notesArray = JSON.parse(localStorage.getItem("savedNotes"));
    for (i = 0; i < notesArray.length; i++) {
      //have to empty out the element variables again
      noteListItem = $("<li>", {
        class: "list-group-item d-flex",
      });
      formattedTextArea = $("<textarea>", {
        class: "w-100 user-note-area",
        placeholder: "click to add notes",
      });
      closeButton = $("<button>", {
        type: "button",
        class: "btn-close close-note-button",
        "aria-label": "Close",
      });

      noteListItem.append(formattedTextArea);
      if (notesArray[i] !== "") {
        formattedTextArea.data("noteFilled", "true");
        formattedTextArea.text(notesArray[i]);
        noteListItem.append(closeButton);
      } else {
        formattedTextArea.data("noteFilled", "false");
      }
      console.log(noteListItem);
      $("#note-list").append(noteListItem);
    }
  }
}

//event listener for "X" button by notes
$(document).on("click", ".close-note-button", function (event) {
  $(event.target).parent().remove();
  getAndSaveNotes(); //Save that you deleted a note into local storage
});

//This function saves the notes to local data when the user clicks away from the notes boxes
$(document).on("focusout", ".user-note-area", function (event) {
  if ($(event.target).val() == "") {
    $(event.target).parent().remove(); //This gets rid of a note if the user didn't fill it after they last clicked on it
  } else {
    $(event.target).data("noteFilled", "true"); //The note has now been marked as filled, clicking on it will not generate a new blank note
    getAndSaveNotes();
  }
});

//The listener for the focus event. Needed to use event delegation to add the event to dynamically generated elements
//This function activates when the text cursor is placed in a note text box. If it's a blank box, it generates a new blank box and allows the user to enter data
$(document).on("focusin", ".user-note-area", function (event) {
  if ($(event.target).data("noteFilled") == "false") {
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
    formattedTextArea.data("noteFilled", "false"); //This creates the new empty note element, with data attribute showing that it is yet to be used
    noteListItem.append(formattedTextArea);
    $("#note-list").append(noteListItem);
  }
});

function getnews() {
  var newsURL = (`https://newsdata.io/api/1/news?apikey=${newsAPI}&country=us&language=en&category=top,sports`)
  fetch(newsURL)
      .then(news => news.json())
    .then((response) => {
      for (i=0; i<5; i++) {
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