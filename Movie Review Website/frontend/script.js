/* ============================================ */
/* JAVASCRIPT FILE - Learning Project 2 */
/* ============================================ */

/* --- Constants for API functionality --- */
// API URL to get popular movies
const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fac67ede676d3d73d33cf7518d223536&page=1";
// Base URL for movie poster images
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
// API URL to search for movies
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=fac67ede676d3d73d33cf7518d223536&query=";

/* --- Select HTML Elements --- */
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");


// Initial load: Get popular movies
returnMovies(APILINK);

/* --- Function to Fetch and Display Movies --- */
function returnMovies(url) {
    // Fetch data from the API
    fetch(url).then(res => res.json()).then(function (data) {
        console.log(data.results);

        // Create a row to hold movie cards
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');

        // Loop through each movie in the results
        data.results.forEach(element => {
            // Create Card Container
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            // Create Column for layout
            const div_column = document.createElement('div');
            div_column.setAttribute('class', 'column');

            // Create Image Element
            const img = document.createElement('img');
            img.setAttribute('class', 'thumbnail');

            // Create Title Element
            const title = document.createElement('h3');

            const center = document.createElement('center');

            // Set Title text and link to reviews page
            title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">View Reviews</a>`;

            // Set Image source
            img.src = IMG_PATH + element.poster_path;

            // Assemble the card structure
            center.appendChild(img);
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
        });

        // Add the row of movies to the main section
        main.appendChild(div_row);
    });
}

/* --- Event Listener for Search Form --- */
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    main.innerHTML = ''; // Clear previous movies

    const searchItem = search.value;

    if (searchItem) {
        // Fetch movies that match the search term
        returnMovies(SEARCHAPI + searchItem);
        search.value = ""; // Clear search box
    }
});
