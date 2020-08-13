module.exports = function generateNamespace(length = 6) {
    var passcode = '';
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       passcode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return passcode;
 }