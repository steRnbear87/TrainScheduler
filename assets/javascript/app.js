$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA0dyyV-BSfT76o6FOkCfM2UUyTptFoL64",
    authDomain: "train-scheduler-195e6.firebaseapp.com",
    databaseURL: "https://train-scheduler-195e6.firebaseio.com",
    projectId: "train-scheduler-195e6",
    storageBucket: "train-scheduler-195e6.appspot.com",
    messagingSenderId: "984142282427"
  };
firebase.initializeApp(config);


// Create a variable to reference the database
  var database = firebase.database();

    var name = "";
    var destination = "";
    var startDate = "";
    var rate = "";
    var pressedButton ="";
    
    

  // Capture Button Click
  $("#submit-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    // YOUR TASK!!!

    // Code in the logic for storing and retrieving the most recent user.

    // Don't forget to provide initial data to your Firebase database.
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    startDate = $("#start-input").val().trim();
    rate = $("#rate-input").val().trim();

    console.log(name);
    console.log(destination);
    console.log(startDate);
    console.log(rate);

    if(name === "" || destination === "" || startDate === "" || rate === "" )
    {
        alert("Please fill out all fields to add this train");
    }
    else{

     // Change what is saved in firebase
     database.ref().push({
      name: name,
      destination: destination,
      startDate: startDate,
      rate: rate,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    }
  });

        // Delete Button Click
    $("body").on("click", ".deleteButton", function() {
        // Don't refresh the page!
        event.preventDefault();
        //remove from table
        $(this).closest ('tr').remove();
        //remove from firebase
        pressedButton = $(this).attr("id");

        //var removeEntry = database.ref().child("name").equalTo(pressedButton);
        console.log("Pressed button " + database.ref().orderByChild("name"));
        //console.log("DB ref name " + database.parent().ref(pressedButton))
       // removeEntry.remove();

       database.ref().orderByChild("name").equalTo(pressedButton).on("child_added",function(snapshot){

        console.log(snapshot.val());
        snapshot.ref.remove();
       })
        

    });

      // Firebase watcher .on("child_added"et
      database.ref().orderByChild("startDate").on("child_added", function(snapshot) {

        var newRow = $("<tr>");
        var td1 = $("<td>").html('');
        var td2 = $("<td>").html('');
        var td3 = $("<td>").html('');
        var td4 = $("<td>").html('');
        var td5 = $("<td>").html('');
        var td6 = $("<td>").html('');
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
  
        // Console.loging the last user's data
        console.log(sv.name);
        console.log(sv.destination);
        console.log(sv.startDate);
        console.log(sv.rate);

        var removeButton = $("<button>");
        removeButton.addClass("btn btn-default btn-primary deleteButton");
        removeButton.text("Delete");

        // First Time (pushed back 1 year to make sure it comes before current time)
        var timeConverted = moment(sv.startDate, "HH:mm").subtract(1, "years");
        console.log(timeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(timeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % sv.rate;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = sv.rate - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        var nextTrainDisplay = moment(nextTrain).format("hh:mm A");
    
        // Change the HTML to reflect

         removeButton.attr("id",sv.name);

         td1 = $("<td>").html(sv.name);
         td2 = $("<td>").html(sv.destination);
         td3 = $("<td>").html(sv.rate);
         td4 = $("<td>").html(nextTrainDisplay);
         td5 = $("<td>").html(tMinutesTillTrain);
        
        newRow.append(td1,td2,td3,td4,td5,removeButton);
        $("tbody").append(newRow);
  
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
    });