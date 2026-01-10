/* ============================================ */
/* JAVASCRIPT FILE - Learning Project 2 */
/* ============================================ */

// Test console - you should see this when page loads

// Add your JavaScript code here!

const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fac67ede676d3d73d33cf7518d223536&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=fac67ede676d3d73d33cf7518d223536&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");


returnMovies(APILINK);
function returnMovies(url) {
    fetch(url).then(res => res.json()).then(function (data) {
        console.log(data.results);
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');

        data.results.forEach(element => {
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            const div_column = document.createElement('div');
            div_column.setAttribute('class', 'column');

            const img = document.createElement('img');
            img.setAttribute('class', 'thumbnail');

            const title = document.createElement('h3');

            const center = document.createElement('center');

            title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">View Reviews</a>`;
            img.src = IMG_PATH + element.poster_path;

            center.appendChild(img);
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
        });

        main.appendChild(div_row);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = "";
    }
});
