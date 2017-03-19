// Train Schedule

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAtop2LEP2UWBY8RqziS9-lUn_RUjeAKeY",
  authDomain: "train-schedule-5d9db.firebaseapp.com",
  databaseURL: "https://train-schedule-5d9db.firebaseio.com",
  storageBucket: "train-schedule-5d9db.appspot.com",
  messagingSenderId: "151959433943"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Global Variables
var trainName = '', destination = '', firstTrainTime = '' , frequency = 0, nextArrival = '', minutesAway = 0;

// Bind an event listener to the #add-train button on a click event.
$('#add-train').on('click', function() {

  // Capture the data from the HTML elements.
	trainName = $('#train-name').val().trim();
	destination = $('#destination').val().trim();
	firstTrainTime = $('#first-train-time').val().trim();
	frequency = $('#frequency').val().trim();

  // Push the HTML element values to the firebase database.
  // An new train object will be created on the database with the following property/value pairs for each #submit click event.
	database.ref().push({
	trainName: trainName,
	destination: destination,
	firstTrainTime: firstTrainTime,
	frequency: frequency
	});

  // Clear the HTML form input elements.
	$('input#train-name').val('');
	$('input#destination').val('');
	$('input#first-train-time').val('');
	$('input#frequency').val('');

  // Prevent the default form action which will refresh the page. Equivalent to event.preventDefault().
	return false;

});

// Bind an event listener to the firebase database on a child_added event.
database.ref().on("child_added", function(lastChildSnapshot) {

		console.log(lastChildSnapshot.val());

    // Capture the value of the last child_added to the database.
		var lastObj = lastChildSnapshot.val();
      	trainName = lastChildSnapshot.val().trainName;
      	destination = lastChildSnapshot.val().destination;
      	firstTrainTime = lastChildSnapshot.val().firstTrainTime;
      	frequency = lastChildSnapshot.val().frequency;

        // Calculate the next train arrival (nextArrival)
        // Calculate the minutesAway
        // Information needed: firstTrainTime, frequency, currentTime

        // First Train Time (pushed back 1 year to make sure it comes before current time)
        firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        
        // Current Time
        currentTime = moment();

        // The difference between the currentTime and the firstTrainTimeConverted.
        diffTime = currentTime.diff(moment(firstTrainTimeConverted), "minutes");

        // Time apart
        minutesAway = diffTime % frequency;

        // Number of minutes before the next train arrives.
        minutesAway = frequency - minutesAway;

        // Next train arrival time
        nextArrival = moment().add(minutesAway, "minutes");
        nextArrival = moment(nextArrival).format("hh:mm A");

        // Append the last child_added to the 'Current Train Schedule' table.
        $('#schedule > tbody').append('<tr class="table-data">' +
                                      '<td>' + trainName + '</td>' +
       									              '<td>' + destination + '</td>' +
       									              '<td>' + frequency + '</td>' +
                                      '<td>' + nextArrival + '</td>' +
       									              '<td>' + minutesAway + '</td>' +
       									              '</tr>'
       	); // end append <tr> to <tbody>

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
