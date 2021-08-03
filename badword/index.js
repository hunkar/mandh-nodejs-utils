const Filter = require("bad-words");

const dictionaries = {
    tr: require("./badwordDictionaryTR.json")
};

const filters = {};

Object.keys(dictionaries).forEach(key => {
    filters[key] = new Filter({ list: dictionaries[key] });
});

function BadwordChecker(languages = ["tr"]) {
    this.clearWords = async (word) => {
        let cleanedWord = word;
        
        for (let index = 0; index < languages.length; index++) {
            cleanedWord = filters[languages[index]] && await filters[languages[index]].clean(word);
        }

        return cleanedWord;
    }

    this.hasBadWord = async (word) => {
        let cleanedWord = word;

        for (let index = 0; index < languages.length; index++) {
            cleanedWord = filters[languages[index]] && await filters[languages[index]].clean(word);
        }

        return cleanedWord !== word;
    }
}


module.exports = {
    BadwordChecker
}
