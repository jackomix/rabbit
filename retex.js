var didWeRestart = true;

function begin() {
    document.getElementById("beginButton").style.display = "none";

    var itemName;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=random&continue=-%7C%7C&redirects=1&utf8=1&formatversion=2&rnnamespace=0", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            itemName = response.query.random[0].title;

            getContents(itemName)
        }
    };
    xhr.send();
}

function getContents(itemName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cpageimages%7Clinks&piprop=original&pllimit=500&redirects=1&utf8=1&formatversion=2&exsentences=2&exintro=1&explaintext=1&titles=" + encodeURIComponent(itemName), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            
            console.log(response);
            itemContents = response.query.pages[0].extract;

            if (typeof itemContents === "undefined") {
                itemContents = "Article doesn't exist...";
            }
            
            if (typeof response.query.pages[0].original === "undefined") {
                itemImage = "var(--bg)";
            } else {
                itemImage = response.query.pages[0].original.source;
            }

            var itemLink;
            if (response.query.pages[0].links) {
                var randomIndex = Math.floor(Math.random() * response.query.pages[0].links.length);
                itemLink = response.query.pages[0].links[randomIndex].title;
            } else {
                itemLink = undefined;
            }

            processItem(itemName, itemContents, itemImage, itemLink);
        }
    };
    xhr.send();
}

function processItem(itemName, itemContents, itemImageURL, itemLink) {
    console.log(itemName);
    console.log(itemContents);
    console.log(itemImageURL);

    var itemTemplate = document.getElementById("template").children[0];
    var itemBox = itemTemplate.cloneNode(true);

    var itemActualBox = itemBox.children[0];
    itemActualBox.querySelector("#itemNameLabel").innerText = itemName;
    itemActualBox.querySelector("#itemDescription").innerText = itemContents;
    itemActualBox.style.borderColor = getRandomColor();
    itemActualBox.style.boxShadow = `0 0 16pt ${itemActualBox.style.borderColor}, inset 0 0 8pt var(--bg)`;
    itemActualBox.style.background = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" + itemImageURL + ")";

    var container = document.getElementById("storyContainer");
    container.prepend(itemBox);

    if (didWeRestart == true) {
        itemBox.querySelector(".transition").innerText = "🔀";
        didWeRestart = false;
    }

    if (typeof itemLink === "undefined") {
        didWeRestart = true;
    }
    

    loop(itemLink, didWeRestart);
}

function loop(itemLink, didWeRestart) {
    setTimeout(
        function() { 
            if (didWeRestart == false) {
                getContents(itemLink); 
            } else {
                begin();
            }
        }, 2500
    );
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
