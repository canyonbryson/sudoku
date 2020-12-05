function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
}

function get_url_data(key, def) {
    let r = parseInt(getQueryString()[key]);
    if (Number.isNaN(r)) {
        return def;
    } else {
        return r;
    }
}

function initializeContexts(cvs) {
    let ctx = [];
    for (let i = 0; i < cvs.length; i++) { // initialize canvases & contexts
        cvs[i].width = window.innerWidth;
        cvs[i].height = window.innerHeight;
        ctx.push(cvs[i].getContext('2d'));
    }
    return ctx;
}