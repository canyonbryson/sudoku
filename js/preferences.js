class Preferences {
    static isRunningAndroid = false;
    static variationNames = ["Normal", "Knight", "King", "Cross"];

    static get(key, defaultValue) {
        if (this.isRunningAndroid && key != "difficulty") { // difficulty always gets passed through URL
            return Android.getInt(key, defaultValue);
        } else {
            return this.get_url_data(key, defaultValue);
        }
    }

    static set(key, value) {
        if (this.isRunningAndroid) {
            Android.setInt(key, value);
        }
        this.init(key, value, true);
        return value;
    }

    static init(key, defaultValue, forceDefault=false) {
        let val = (!forceDefault) ? this.get(key, defaultValue) : defaultValue;
        $(".pref_" + key).val(val);
        if (key == "color_scheme" || key == "sudoku_type") {
            $(".display_" + key).html($("#btn_" + key + "_" + val).html() + "&nbsp;<span class='caret'>");
            $(".btn_" + key).css("background-color", "white");
            $("#btn_" + key + "_" + val).css("background-color", "rgb(210,210,210)");
        }
        return val;
    }

    static initHome(key, defaultValue) {
        let val = this.get(key, defaultValue);
        $(".pref_" + key).val(val);
        if (key == "sudoku_type") {
            $("#display_" + key).html(this.variationNames[val] + " Sudoku");
        }
    }

    static getQueryString() {
        var result = {}, queryString = location.search.slice(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
    
    static get_url_data(key, def) {
        let r = parseInt(this.getQueryString()[key]);
        if (Number.isNaN(r)) {
            return def;
        } else {
            return r;
        }
    }
}

