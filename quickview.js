let quickviewOverlay = document.getElementById("quickview-overlay");
let quickviewInner = document.getElementById("quickview-inner");
let quickviewSpinner = quickviewOverlay.querySelector(".loader-container");

function initQuickView(itemUrl) {
    quickviewOverlay.classList.add('active');
    quickviewSpinner.classList.add('active');
    fetch(itemUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(data, "text/html");
            let itemPageFiltered = parsedDocument.getElementById("main_section_editor_container");
            let itemPageTest = parsedDocument.querySelector(".store .col-xs-12");
            displayQuickView(itemPageTest);
        })
}

function displayQuickView(itemPageData1) {
    quickviewSpinner.classList.remove('active');
    quickviewInner.appendChild(itemPageData1);
    executeScriptElements(quickviewInner);
}

quickviewOverlay.addEventListener('click', event => {
      const isOutside = !event.target.closest('#quickview-inner');
      if (isOutside) {
        clearQuickView();
      }
});
    
function clearQuickView() {
    quickviewOverlay.classList.remove('active'); 
    quickviewInner.innerHTML = "";
}

function executeScriptElements(containerElement) {
  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });
    
    clonedElement.text = scriptElement.text;

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}
