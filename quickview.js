let quickViewHTML = `
<div id="quickview-overlay" class="screen-overlay">
    <div class="quickview-wrapper">
        <btn onclick="clearQuickView()" class="close-btn"><i class="fa fa-times" aria-hidden="true"></i></btn>
        <div class="loader-container"><span class="loader"></span></div>
        <div id="quickview-inner"></div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', quickViewHTML);

let categoryItems = document.querySelectorAll(".ers-item");

for (const item of categoryItems) {
    let itemId = item.id.split("id_")[1];
    let quickViewBtn = `<div class="quickview-btn-container"><btn style="width:100%" onclick="quickViewLink(${itemId})" class="quickview-btn ers-item-button button-style">Quick View</btn></div>`;
    let btnContainer = item.querySelector(".button-price-container");
    btnContainer.insertAdjacentHTML("beforebegin", quickViewBtn);
}

let quickviewOverlay = document.getElementById("quickview-overlay");
let quickviewInner = document.getElementById("quickview-inner");
let quickviewSpinner = quickviewOverlay.querySelector(".loader-container");

function quickViewLink(itemId) {
  event.stopPropagation();
  for (const product of productsData) {
    if (product.id == itemId) {
      initQuickView(product.url);
    } 
  }
}

function initQuickView(itemUrl) {
    quickviewOverlay.classList.add('active');
    quickviewSpinner.classList.add('active');
    fetch(itemUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(data, "text/html");
            let itemPageHTML = parsedDocument.querySelector(".store .col-xs-12");
            displayQuickView(itemPageHTML);
        })
        .catch((error) => {
          console.log('Quickview Error');
        });
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
    event.preventDefault();
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
