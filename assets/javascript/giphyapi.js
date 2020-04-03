var topics = ["retro gaming", "console gaming", "pc gaming"];

var searchButton = document.getElementById("search-button");

// add some code to our search button
searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    var searchText = document.getElementById("text").value;
    if (searchText === "")
        return;
    /*var newButton = addButton(searchText);
    apiQuery(searchText);
    newButton.addEventListener("click", function () {
        apiQuery(searchText);
    });*/
    apiQuery(searchText);
    topics.push(searchText);
    addTopics();
});

var clearImagesButton = document.getElementById("clear-images");
// add code to clear images button
clearImagesButton.addEventListener("click", function (e) {
    e.preventDefault();
    clearImages();
});

var clearTagsButton = document.getElementById("clear-tags");
// add code to clear tags button
clearTagsButton.addEventListener("click", function (e) {
    e.preventDefault();
    topics = [];
    clearTags();
});

addTopics();

// loop thru topics array and add buttons
function addTopics() {
    clearTags();
    for (i = 0; i < topics.length; i++) {
        var newButton = addButton(topics[i]);
        newButton.addEventListener("click", function (e) {
            e.preventDefault();
            var searchData = this.getAttribute("search-data");
            apiQuery(searchData);
        });
    }
}


// append button to container based on user input
function addButton(searchData) {
    var btnContainer = document.getElementById("button-container");
    var newElement = document.createElement("button");
    var newButton = btnContainer.appendChild(newElement);
    newButton.setAttribute("search-data", searchData);
    newButton.textContent = searchData;
    return newButton;
}

// make ajax query to Giphy based on search data
function apiQuery(searchData) {

    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=39kz56FNdt5E2SH1WY36r7pAsT5c7u6Q&q=" + searchData + "&limit=10&offset=0&lang=en";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        // retrieve url data and append to rows and columns within image-container
        for (i = 0; i < response.data.length; i++) {
            var url = response.data[i].images.fixed_height_small_still.url;
            var newElement = document.createElement("img");
            var imgContainer = document.getElementById("image-container");

            if (i === 0 || i === 5) {

                var row = newRow(imgContainer);
                var col = newCol(row);
            }

            var newImg = col.appendChild(newElement);

            newImg.setAttribute("src", url);
            newImg.setAttribute("data-state", "still");
            newImg.setAttribute("data-still", url);
            newImg.setAttribute("data-animated", response.data[i].images.fixed_height_small.url);
            var newLabel = document.createElement("div");
            newLabel = col.appendChild(newLabel);
            newLabel.setAttribute("class", "label");
            newLabel.textContent = "Rating: " + response.data[i].rating;

            newImg.addEventListener("click", function () {
                var state = this.getAttribute("data-state");
                if (state === "still") {
                    this.setAttribute("src", this.getAttribute("data-animated"));
                    this.setAttribute("data-state", "animated");
                } else {
                    this.setAttribute("src", this.getAttribute("data-still"));
                    this.setAttribute("data-state", "still");
                }
            });
        }

    });
}

function newRow(parent) {
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    return (parent.appendChild(row));
}

function newCol(parent) {
    var col = document.createElement("div");
    col.setAttribute("class", "col col-lg-12 col-md-12 col-sm-12");
    return (parent.appendChild(col));
}

// empty images container
function clearImages() {
    var parent = document.getElementById("image-container");
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

// empty tags container
function clearTags() {
    var parent = document.getElementById("button-container");
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}