/* --- Get Movie ID and Title from URL --- */
const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

// API Endpoint for Reviews (Using our own Backend)
const APILINK = "http://localhost:8000/api/v1/reviews/";

const main = document.getElementById("section");
const title = document.getElementById("title");

// Set the page title to the movie name
title.innerText = movieTitle;

/* --- Create "New Review" Section --- */
const div_new = document.createElement('div');
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
          <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a>
          </p>
      </div>
    </div>
  </div>
`
main.appendChild(div_new)

// Load existing reviews
returnReviews(APILINK);

/* --- Function to Fetch and Display Reviews --- */
function returnReviews(url) {
  // Fetch reviews specifically for this movie ID
  fetch(url + "movie/" + movieId).then(res => res.json())
    .then(function (data) {
      console.log(data);
      // Loop through each review
      data.forEach(review => {
        const div_card = document.createElement('div');
        // Create HTML for each review card
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <p><a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑️</a></p>
              </div>
            </div>
          </div>
        `
        main.appendChild(div_card);
      });
    });
}

/* --- Function to Save (Create or Update) a Review --- */
function saveReview(reviewInputId, userInputId, id = "") {
  // Get values from input fields
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    // If ID exists, we are EDITING (PUT request)
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload(); // Reload to show changes
      });
  } else {
    // If no ID, we are creating NEW (POST request)
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "movieId": movieId })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload(); // Reload to show new review
      });
  }
}

/* --- Function to Delete a Review --- */
function deleteReview(id) {
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
      location.reload();
    });
}

/* --- Function to Enable Editing Mode --- */
function editReview(id, review, user) {
  // Replace the text with input boxes so user can edit
  const element = document.getElementById(id);
  const reviewInputId = "review" + id
  const userInputId = "user" + id

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
