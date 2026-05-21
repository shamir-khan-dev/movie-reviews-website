/* --- Get Information from URL --- */
// 'new URL(location.href)' creates a URL object from the current page address.
const url = new URL(location.href);
// .searchParams.get("id") looks for ?id=123 in the URL and returns '123'.
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

// The address of our backend server where we send review data
const APILINK = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000/api/v1/reviews/"
  : "https://movie-reviews-backend-shamir.onrender.com/api/v1/reviews/";

// 'document.getElementById' finds an HTML element with a specific ID so we can change it.
const main = document.getElementById("section");
const title = document.getElementById("title");

// Change the text inside the <h1> tag to be the movie title
title.innerText = movieTitle;

/* --- Create "New Review" Section Dynamically --- */
const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card review-form-card">
          <h3>Add a Review</h3>
          <div class="form-group">
            <label for="new_review">Review Description</label>
            <textarea id="new_review" placeholder="Write your movie review here..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="new_user">Your Name</label>
            <input type="text" id="new_user" placeholder="Enter your name">
          </div>
          <button class="btn btn-save" onclick="saveReview('new_review', 'new_user')">Submit Review</button>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new);

// Call our function to fetch existing reviews
returnReviews(APILINK);

/* --- Function to Fetch and Display Reviews --- */
function returnReviews(url) {
  fetch(url + "movie/" + movieId)
    .then(res => res.json())
    .then(function (data) {
      console.log(data);
      data.forEach(review => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card review-card" id="${review._id}">
                <p class="review-header">👤 <strong class="review-user-val">${review.user}</strong></p>
                <p class="review-body">"<span class="review-text-val">${review.review}</span>"</p>
                <div class="review-actions">
                  <button class="btn-action btn-edit" onclick="editReview('${review._id}')">✏️ Edit</button>
                  <button class="btn-action btn-delete" onclick="deleteReview('${review._id}')">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </div>
        `;
        main.appendChild(div_card);
      });
    });
}

/* --- Function to Save (Create or Update) a Review --- */
function saveReview(reviewInputId, userInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review })
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        location.reload();
      });
  } else {
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "movieId": movieId })
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        location.reload();
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
    body: JSON.stringify({ "user": "user" })
  }).then(res => res.json())
    .then(res => {
      console.log(res);
      location.reload();
    });
}

/* --- Function to Enable Editing Mode --- */
function editReview(id) {
  const element = document.getElementById(id);
  const userSpan = element.querySelector('.review-user-val');
  const reviewSpan = element.querySelector('.review-text-val');
  
  const user = userSpan ? userSpan.innerText : "";
  const review = reviewSpan ? reviewSpan.innerText : "";

  const reviewInputId = "review" + id;
  const userInputId = "user" + id;

  element.innerHTML = `
    <h3>Edit Review</h3>
    <div class="form-group" style="text-align: left;">
      <label for="${reviewInputId}">Review Description</label>
      <textarea id="${reviewInputId}" rows="3" style="background-color: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 8px; padding: 12px; width: 100%; box-sizing: border-box; margin-top: 5px; font-family: inherit;">${review}</textarea>
    </div>
    <div class="form-group" style="text-align: left; margin-top: 10px;">
      <label for="${userInputId}">Your Name</label>
      <input type="text" id="${userInputId}" value="${user}" style="background-color: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 8px; padding: 12px; width: 100%; box-sizing: border-box; margin-top: 5px; font-family: inherit;">
    </div>
    <div class="edit-actions" style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
      <button class="btn btn-save" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾 Save</button>
      <button class="btn btn-cancel" onclick="location.reload()" style="background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255,255,255,0.2);">✕ Cancel</button>
    </div>
  `;
}
