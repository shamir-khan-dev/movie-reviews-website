/* ============================================ */
/* JAVASCRIPT FILE - Learning Project 2 */
/* This file handles the logic for the HOME PAGE (index.html) */
/* ============================================ */

/* --- Constants for API functionality --- */
// API URL to get popular movies. 'discover/movie' generates a list of movies.
const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fac67ede676d3d73d33cf7518d223536&page=1";
// Base URL for movie poster images (w1280 defines the image width)
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
// API URL for searching. We will append the user's search query to the end of this string.
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=fac67ede676d3d73d33cf7518d223536&query=";

/* --- Select HTML Elements --- */
// We grab these elements so we can control them with code
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");


// Initial load: Get popular movies as soon as the page opens
returnMovies(APILINK);

/* --- Function to Fetch and Display Movies --- */
function returnMovies(url) {
    // fetch(url) sends a request to the Movie Database API
    // .then waits for the response
    // res.json() converts the raw data into a JavaScript Object
    fetch(url).then(res => res.json()).then(function (data) {
        console.log(data.results);

        // Create a 'div' container for the row of movies
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');

        // Loop through everything in the 'data.results' list
        data.results.forEach(element => {
            // Create the Card container
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            // Create the Column container (controls width)
            const div_column = document.createElement('div');
            div_column.setAttribute('class', 'column');

            // Create Image Element for the poster
            const img = document.createElement('img');
            img.setAttribute('class', 'thumbnail');

            // Create Title Element (h3)
            const title = document.createElement('h3');

            // Center tag keeps things aligned (though Flexbox does this too)
            const center = document.createElement('center');

            /* --- Setting Content --- */
            // Set the inner HTML of the title. Includes a link to our 'movie.html' page.
            // We pass the movie ID and Title in the URL so movie.html knows what to load.
            title.innerHTML = element.title;

            // Set the Source (src) of the image to the full API image path, or use a high-quality cinematic placeholder
            img.src = element.poster_path 
              ? IMG_PATH + element.poster_path 
              : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400";

            // Create a styled "View Reviews" action button
            const actionLink = document.createElement('a');
            actionLink.setAttribute('class', 'btn-reviews');
            actionLink.setAttribute('href', `movie.html?id=${element.id}&title=${encodeURIComponent(element.title)}`);
            actionLink.innerHTML = "View Reviews <span>→</span>";

            /* --- Assembling the HTML lego blocks --- */
            center.appendChild(img);          // Put image inside center
            div_card.appendChild(center);     // Put center inside card
            div_card.appendChild(title);      // Put title inside card
            div_card.appendChild(actionLink); // Put styled button inside card
            div_column.appendChild(div_card); // Put card inside column
            div_row.appendChild(div_column);  // Put column inside row
        });

        // Finally, put the entire row inside the MAIN section of our page
        main.appendChild(div_row);
    });
}

/* --- Event Listener for Search Form --- */
// Listen for when the user hits 'Enter' or clicks 'Search'
form.addEventListener("submit", (e) => {
    e.preventDefault(); // STOP the page from reloading (default form behavior)
    main.innerHTML = ''; // DELETE all current movies to make room for search results

    const searchItem = search.value; // Get text from the input box

    if (searchItem) {
        // Fetch movies using the Search API + the User's text
        returnMovies(SEARCHAPI + searchItem);
        search.value = ""; // Clear the input box for next time
    }
});
