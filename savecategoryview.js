function saveCategoryView() {
    let categoryViews = [];
    let category = {};
    category.path = window.location.pathname;
    category.views = 1;

    for (const apiCategory of Object.keys(categoriesData)) {
        if(category.path == apiCategory.url) {
            category.picture = apiCategory.picture;
            category.name = apiCategory.name;
        }
    }
    
    const keys = Object.keys(localStorage);
    for (let key of keys) {
        if (key === 'categoryViews') {
            let categoryUpdate = JSON.parse(localStorage.getItem('categoryViews'));
            for (i=0; i < categoryUpdate.length; i++) {
                if (categoryUpdate[i].path == window.location.pathname) {
                    categoryUpdate[i].views++;
                    category = null;
                } 
            }
            categoryViews = categoryUpdate;
        }
    }
    if (category !== null) {
        categoryViews.push(category);
    }
    localStorage.setItem('categoryViews', JSON.stringify(categoryViews.sort((a,b) => b.views - a.views)));
}
saveCategoryView();