var topics = [{
    title: "Retro Gaming",
    clicks: 0,
},
{
    title: "Console Gaming",
    clicks: 0,
},
{
    title: "PC Gaming",
    clicks: 0,
}

]

var searchButton = document.getElementById("search-button");

// add some code to our search button
searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    var searchText = document.getElementById("text").value;
    for (i = 0; i < topics.length; i++) {
        if (topics[i].title.toLowerCase() === searchText.toLowerCase()) {
            return;
        }
    }
    if (searchText === "")
        return;
    apiQuery(searchText, 0);
    // create new topic object and push to array
    var newObj = { title: searchText, clicks: 1 };
    topics.push(newObj);
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
        var newButton = addButton(topics[i].title);
        newButton.setAttribute("id", i);
        newButton.addEventListener("mouseover", function (e) {
            // mouse over code here
        });
        newButton.addEventListener("click", function (e) {
            e.preventDefault();
            var index = this.getAttribute("id");
            // increment clicks key for this topic when button is pressed
            topics[index].clicks++;
            if (topics[index].clicks === 1) {
                var offset = 0;
            } else {
                var offset = topics[index].clicks * 10;
            }
            var searchData = this.getAttribute("search-data");
            apiQuery(searchData, offset);
        });
    }
}


// append button to container based on user input
function addButton(searchData) {
    var btnContainer = document.getElementById("button-container");
    var newElement = document.createElement("button");
    var newButton = btnContainer.appendChild(newElement);
    newButton.setAttribute("class", "btn btn btn-dark my-2 my-sm-0");
    newButton.setAttribute("search-data", searchData);
    newButton.textContent = searchData;
    return newButton;
}

// make ajax query to Giphy based on search data
function apiQuery(searchData, offset) {

    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=39kz56FNdt5E2SH1WY36r7pAsT5c7u6Q&q=" + searchData + "&limit=10&offset=" + offset + "&lang=en";

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

            //create a new row for every 5 pictures and place images in columns

            if (i === 0 || i === 5) {

                var row = newRow(imgContainer);
            }

            var col = newCol(row);
            var newImg = col.appendChild(newElement);
            newImg.setAttribute("src", url);
            newImg.setAttribute("data-state", "still");
            newImg.setAttribute("data-still", url);
            newImg.setAttribute("data-animated", response.data[i].images.fixed_height_small.url);
            var newLabel = document.createElement("div");
            newLabel = col.appendChild(newLabel);
            newLabel.setAttribute("class", "label");
            newLabel.textContent = "Rating: " + response.data[i].rating.toUpperCase();
            var copyLink = document.createElement("button");
            copyLink = newLabel.appendChild(copyLink);
            copyLink.setAttribute("type", "button");
            copyLink.setAttribute("class", "btn btn-dark my-2 my-sm-0");
            // "assets/icons/clipboard-data.svg"
            copyLink.textContent = "Copy URL";
            /*var icon = document.createElement("img");
            icon.setAttribute("src", "assets/icons/clipboard-data.svg");
            copyLink.appendChild(icon);*/
            // when user clicks on image, check to see current state and set accordingly
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
    var row = document.createElement("row");
    row.setAttribute("class", "row");
    return (parent.appendChild(row));
}

function newCol(parent) {
    var col = document.createElement("div");
    col.setAttribute("class", "col-2.4");
    return (parent.appendChild(col));
}

// empty images container
function clearImages() {
    for (i = 0; i < topics.length; i++) {
        topics[i].clicks = 0;
    }
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