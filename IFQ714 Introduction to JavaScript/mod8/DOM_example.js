window.onload = function () {
    document.getElementById("colourSelect").addEventListener("change", changeColour);
    document.getElementById("addElementButton").addEventListener("click", addElement);
    document.getElementById("removeElementButton").addEventListener("click", removeElement);
    document.getElementById("openWindowButton").addEventListener("click", openWindow);
    document.getElementById("moveWindowButton").addEventListener("click", moveWindow);
    document.getElementById("closeWindowButton").addEventListener("click", closeWindow);
    document.getElementById("informationButton").addEventListener("click", showInfo);
    document.getElementById("backButton").addEventListener("click", function() { history.back(); });
    document.getElementById("forwardButton").addEventListener("click", function() { history.forward(); });
}

/*
//changes colour of div class="sideOne" using select drop down
function changeColour(event) {
    let colour =event.target.value;
    let sideOne = document.getElementById("sideOne");
    sideOne.setAttribute("style", `flex:1; color:${colour}`);
}
*/
/*
function changeColour(event) {
    let colour = event.target.value;
    let sideOne = document.getElementById("sideOne");
    let paragraphs = sideOne.getElementsByTagName("p");
    for (let i=0;i<paragraphs.length;i++){
        paragraphs[i].setAttribute("style", `color:${colour}`);
    }
}
*/

function changeColour(event) {
    console.log("Entering changeColour function.");
    let colour = event.target.value;
    let elements = document.getElementsByClassName("sideOne");
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute("style").includes("flex:1")) {
            elements[i].setAttribute("style", `flex:1; color:${colour}`);
        } else {
            elements[i].setAttribute("style", `color:${colour}`);
        }
    }
    alert(`Colour changed to ${colour} for side one!`);
}


function addElement() {
    console.log("Entering addElement function.");
    let newElement = document.createElement("p");
    let sideTwo = document.getElementById("sideTwo");
    let text = prompt("Enter text for new element:")
    newElement.textContent = text === null ? `Newly added element ${sideTwo.children.length}`:text;
    sideTwo.appendChild(newElement);
}

function removeElement() {
    console.log("Entering removeElement function.");
    let sideTwo = document.getElementById("sideTwo");
    if (sideTwo.lastElementChild.tagName.toLowerCase() === "p") {
        if (confirm("Are you sure you want to remove an element?")) {
        sideTwo.removeChild(sideTwo.lastElementChild);
        }
    }
}

let newWindow = null;
const width = 640;
const height = 480;
function openWindow() {
    console.log("Entering openWindow function.");
    if (newWindow === null || newWindow.closed) {
        newWindow = window.open("about:blank"  , `width=${width}, height=${height}`);
    }
}

function moveWindow() {
    console.log("Entering moveWindow function.");
    if (newWindow !== null && !newWindow.closed) {
        const buffer = 100;
 

        // Get the height and width in case the window has changed size.
        const currentWidth = newWindow.outerWidth;
        const currentHeight = newWindow.outerHeight;
 

        // Get the height and width of the screen.
        const screenWidth = screen.width;
        const screenHeight = screen.height;
 

        // Generate a random number within the bounds we want
        const randWidth = buffer+Math.random()*(screenWidth-currentWidth-buffer*2);
        const randHeight = buffer+Math.random()*(screenHeight-currentHeight-buffer*2);
 

        // Use abs to make sure it's an integer.
        newWindow.moveTo(Math.abs(randWidth), Math.abs(randHeight));
        newWindow.focus();
    }
}

function closeWindow() {
    console.log("Entering closeWindow function.");
    if (newWindow !== null && !newWindow.closed) {
        newWindow.close();
        newWindow = null;
    }
}

function showInfo() {
    console.log("Entering showInfo function.");
    const protocol = location.protocol;
    const host = location.hostname;
    const path = location.pathname;
    const agent = navigator.userAgent;
    const language = navigator.language;
    const cookie = navigator.cookieEnabled;
    const pdf = navigator.pdfViewerEnabled;
    alert(`URL details: \nCurrent page protocol is ${protocol}. \nCurrent page host is ${host}. \nCurrent page path is ${path}.
    \n\nBrowser details: \nReported user agent is ${agent}. \nCurrent language is ${language}. \nAre cookies enabled? ${cookie}. \nCan PDFs be viewed in the browser? ${pdf}.`);
}