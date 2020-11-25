window.onload = function() {
    //pass
    function getQueryString() {
        var result = {}, queryString = location.search.slice(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }

    let difficulty = getQueryString()["difficulty"];
    if (difficulty != undefined) {
        $("#m1").val(difficulty);
    }
};