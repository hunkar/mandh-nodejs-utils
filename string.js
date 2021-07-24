const toTurkishSearchable = (str) => {
    return str.replace(/[gGğĞ]/gim, "[gGğĞ]")
        .replace(/[uüUÜ]/gim, "[uüUÜ]")
        .replace(/[sşSŞ]/gim, "[sşSŞ]")
        .replace(/[iıIİ]/gim, "[iıIİ]")
        .replace(/[çÇcC]/gim, "[çÇcC]")
        .replace(/[OoÖö]/gim, "[OoÖö]")
}

const insert = (string, insertData) => {
    if (insertData && Array.isArray(insertData) && typeof insertData[0] == "string") {
        insertData.forEach((item, index) => {
            string = string.replace(new RegExp("\\{" + index + "\\}", "g"), item);
        });

        return string;
    } else if (insertData && Array.isArray(insertData) && typeof insertData[0] == "object") {
        insertData.forEach((item) => {
            string = string.replace(new RegExp("\\{" + item.index + "\\}", "g"), item.value);
        });

        return string;
    } else if (insertData != null) {
        return string.replace(/\{0\}/g, insertData)
    } else {
        return string;
    }
}


module.exports = {
    toTurkishSearchable,
    insert
}