function getSimilarProducts () {
    let similarItemsContainer = `
        <div class="container similar-items-container">
            <div class="similar-items-heading">Similar Items</div>
            <div class="swiper similar-items-swiper>
                <div class="swiper-wrapper">
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    `;
    document.body.querySelector('.basic-item-page').insertAdjacentHTML('afterend', similarItemsContainer);
    let currentURL = window.location.pathname;
    let primaryCategoryId = "";
    productsData.forEach(item => {
        if (item.url == currentURL) {
            primaryCategoryId = item.categoryIds[0];
            break;
        }
    });

    productsData.forEach(item => {
        if (primaryCategoryId == item.categoryIds[0] && item.display == true) {
            document.body.querySelector('.similar-items-swiper .swiper-wrapper').insertAdjacentHTML('beforeend', ` 
                <div class="swiper-slide">
                    <div class="similar-img">
                        <img src="${item.picture}" alt="${item.name}" />
                    </div>
                    <div class="similar-name">${item.name}</div>
                    <div class="similar-link">
                        <a href="${item.url}">More Info</a>
                    </div>
                </div>
            `);
        }
    });
}