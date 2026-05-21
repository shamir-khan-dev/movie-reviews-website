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
            <label>Rating</label>
            <div class="star-rating" id="new_star_container">
              <span class="star" data-value="1">★</span>
              <span class="star" data-value="2">★</span>
              <span class="star" data-value="3">★</span>
              <span class="star" data-value="4">★</span>
              <span class="star" data-value="5">★</span>
            </div>
            <input type="hidden" id="new_rating" value="5">
          </div>
          <div class="form-group">
            <label for="new_user">Your Name</label>
            <input type="text" id="new_user" placeholder="Enter your name">
          </div>
          <button class="btn btn-save" onclick="saveReview('new_review', 'new_user', '', 'new_rating')">Submit Review</button>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new);
initStars('new_star_container', 'new_rating');

// Call our function to fetch existing reviews
returnReviews(APILINK);

/* --- Function to Fetch and Display Reviews --- */
function returnReviews(url) {
  fetch(url + "movie/" + movieId)
    .then(res => res.json())
    .then(function (data) {
      console.log(data);
      data.forEach(review => {
        const ratingVal = parseInt(review.rating, 10) || 5;
        const starDisplay = "★".repeat(ratingVal) + "☆".repeat(5 - ratingVal);
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card review-card" id="${review._id}">
                <p class="review-header">
                  👤 <strong class="review-user-val">${review.user}</strong>
                  <span class="review-stars" data-rating="${ratingVal}">${starDisplay}</span>
                </p>
                <p class="review-body">"<span class="review-text-val">${review.review}</span>"</p>
                <div class="review-actions">
                  <button class="btn-action btn-edit" onclick="editReview('${review._id}')">✏️ Edit</button>
                  <button class="btn-action btn-delete" onclick="deleteReview('${review._id}', '${review.user}')">🗑️ Delete</button>
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
function saveReview(reviewInputId, userInputId, id = "", ratingInputId = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;
  const ratingVal = ratingInputId ? parseInt(document.getElementById(ratingInputId).value, 10) || 5 : 5;

  if (id) {
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "rating": ratingVal })
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update review. Ensure you are the original poster.");
      } else {
        location.reload();
      }
    }).catch(err => {
      console.error(err);
      alert("Network error. Could not update review.");
    });
  } else {
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "user": user, "review": review, "movieId": movieId, "rating": ratingVal })
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to submit review.");
      } else {
        location.reload();
      }
    }).catch(err => {
      console.error(err);
      alert("Network error. Could not submit review.");
    });
  }
}

/* --- Function to Delete a Review --- */
function deleteReview(id, user) {
  fetch(APILINK + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "user": user })
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete review. Ensure you are the original poster.");
    } else {
      location.reload();
    }
  }).catch(err => {
    console.error(err);
    alert("Network error. Could not delete review.");
  });
}

/* --- Function to Enable Editing Mode --- */
function editReview(id) {
  const element = document.getElementById(id);
  const userSpan = element.querySelector('.review-user-val');
  const reviewSpan = element.querySelector('.review-text-val');
  const starSpan = element.querySelector('.review-stars');
  
  const user = userSpan ? userSpan.innerText : "";
  const review = reviewSpan ? reviewSpan.innerText : "";
  const currentRating = starSpan ? parseInt(starSpan.getAttribute('data-rating'), 10) || 5 : 5;

  const reviewInputId = "review" + id;
  const userInputId = "user" + id;
  const ratingInputId = "rating" + id;
  const starContainerId = "star_container" + id;

  element.innerHTML = `
    <h3 style="margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--hairline); padding-bottom: 12px;">Edit Review</h3>
    <div class="form-group">
      <label for="${reviewInputId}">Review Description</label>
      <textarea id="${reviewInputId}" rows="3">${review}</textarea>
    </div>
    <div class="form-group">
      <label>Rating</label>
      <div class="star-rating" id="${starContainerId}">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
      </div>
      <input type="hidden" id="${ratingInputId}" value="${currentRating}">
    </div>
    <div class="form-group">
      <label for="${userInputId}">Your Name</label>
      <input type="text" id="${userInputId}" value="${user}">
    </div>
    <div class="review-actions" style="margin-top: var(--spacing-lg);">
      <button class="btn btn-save" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}', '${ratingInputId}')">💾 Save</button>
      <button class="btn-action btn-cancel" onclick="location.reload()">✕ Cancel</button>
    </div>
  `;
  initStars(starContainerId, ratingInputId);
}

/* --- Function to Initialize Star Rating Interactivity --- */
function initStars(ratingContainerId, hiddenInputId) {
  const container = document.getElementById(ratingContainerId);
  const hiddenInput = document.getElementById(hiddenInputId);
  if (!container || !hiddenInput) return;

  const stars = container.querySelectorAll('.star');
  
  function updateStars(val) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute('data-value'), 10);
      if (starVal <= val) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }

  // Initial update
  updateStars(parseInt(hiddenInput.value, 10));

  stars.forEach(star => {
    // Click handles permanent selection
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'), 10);
      hiddenInput.value = val;
      updateStars(val);
    });

    // Mouseover handles hover preview
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.getAttribute('data-value'), 10);
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'), 10);
        if (sVal <= val) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });

    // Mouseout removes hover preview
    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });
  });
}
