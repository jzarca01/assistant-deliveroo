const rug = require('random-username-generator')
rug.setSeperator('.')

class NewTempMail {
    createNewEmail() {
        return new Promise((resolve) => {
            resolve(rug.generate().concat("@mailbucks.tech"))
        })
    }
}



module.exports = NewTempMail