/* --- Get Information from URL --- */
// 'new URL(location.href)' creates a URL object from the current page address.
const url = new URL(location.href);
// .searchParams.get("id") looks for ?id=123 in the URL and returns '123'.
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

// The address of our backend server where we send review data
const APILINK = "http://localhost:8000/api/v1/reviews/";

// 'document.getElementById' finds an HTML element with a specific ID so we can change it.
const main = document.getElementById("section");
const title = document.getElementById("title");

// Change the text inside the <h1> tag to be the movie title
title.innerText = movieTitle;

/* --- Create "New Review" Section Dynamically --- */
// document.createElement creates a new HTML tag in memory (not visible yet).
const div_new = document.createElement('div');
// .innerHTML allows us to write raw HTML code inside that new div.
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
          New Review
          <p><strong>Review: </strong>
            <input type="text" id="new_review" value="">
          </p>
          <p><strong>User: </strong>
            <input type="text" id="new_user" value="">
          </p>
          <!-- <a ... onclick="..."> calls a JavaScript function when clicked -->
          <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a>
          </p>
      </div>
    </div>
  </div>
`
// .appendChild adds this new div to the 'main' section, making it visible on the page.
main.appendChild(div_new)

// Call our function to fetch existing reviews
returnReviews(APILINK);

/* --- Function to Fetch and Display Reviews --- */
function returnReviews(url) {
  // fetch() sends a request to the server.
  // url + "movie/" + movieId creates a URL like 'http://.../reviews/movie/123'
  fetch(url + "movie/" + movieId)
    .then(res => res.json()) // Convert the response from the server into JSON (friendlier format)
    .then(function (data) {
      console.log(data); // Print data to browser console for debugging
      // forEach loops through every review in the 'data' list
      data.forEach(review => {
        const div_card = document.createElement('div');
        // Create the HTML card for this specific review
        // ${review.review} inserts the actual review text from the database
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <!-- We pass the review's unique ID ('${review._id}') to the edit and delete functions -->
                <p><a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑️</a></p>
              </div>
            </div>
          </div>
        `
        // Add this card to the page
        main.appendChild(div_card);
      });
    });
}

/* --- Function to Save (Create or Update) a Review --- */
function saveReview(reviewInputId, userInputId, id = "") {
  // .value gets the text the user typed into the input box
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  // Check if 'id' was provided. 
  // If YES, we are Editing an existing review.
  // If NO, we are Creating a new one.
  if (id) {
    // fetch with 'method: PUT' tells the server to UPDATE data
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*', // We accept JSON responses
        'Content-Type': 'application/json' // We are sending JSON data
      },
      // JSON.stringify converts our JavaScript object into a text string to send over the internet
      body: JSON.stringify({ "user": user, "review": review })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload(); // Refresh the page to see the changes
      });
  } else {
    // fetch with 'method: POST' tells the server to CREATE new data
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      // Note: We also send 'movieId' so the backend knows which movie this review is for
      body: JSON.stringify({ "user": user, "review": review, "movieId": movieId })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload(); // Refresh the page
      });
  }
}

/* --- Function to Delete a Review --- */
function deleteReview(id) {
  // fetch with 'method: DELETE' tells the server to REMOVE data
  fetch(APILINK + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "user": "user" }) // In real app, auth token goes here
  }).then(res => res.json())
    .then(res => {
      console.log(res)
      location.reload(); // Refresh the page to make the deleted review disappear
    });
}

/* --- Function to Enable Editing Mode --- */
function editReview(id, review, user) {
  // Find the existing card for this review
  const element = document.getElementById(id);
  // Create unique IDs for the input boxes we are about to create
  const reviewInputId = "review" + id
  const userInputId = "user" + id

  // Replace the text content with Input Boxes so the user can type
  // This is known as "DOM Manipulation"
  element.innerHTML = `
              <p><strong>Review: </strong>
                <input type="text" id="${reviewInputId}" value="${review}">
              </p>
              <p><strong>User: </strong>
                <input type="text" id="${userInputId}" value="${user}">
              </p>
              <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a>
              </p>
  `
}
