let quickViewHTML = `
<div id="quickview-overlay" class="screen-overlay">
    <div class="quickview-wrapper">
        <btn onclick="clearQuickView(); event.preventDefault()" class="close-btn"><i class="fa fa-times" aria-hidden="true"></i></btn>
        <div class="loader-container"><span class="loader"></span></div>
        <div id="quickview-inner"></div>
    </div>
</div>`;

document.body.insertAdjacentHTML('afterbegin', quickViewHTML);

let categoryItems = document.querySelectorAll(".ers-item");

for (let item of categoryItems) {
    let quickViewBtn = `<btn style="width:100%" class="quickview-btn ers-item-button button-style">Quick View</btn>`;
    let btnContainer = item.querySelector(".button-price-container");
    console.log(btnContainer);
    btnContainer.parentNode.insertBefore(quickViewBtn, btnContainer);
}

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
