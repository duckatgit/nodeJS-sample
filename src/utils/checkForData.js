const checkForData = (body, impData = []) => {
    let areKeysMatching = impData.every((key) => key in body);
    return areKeysMatching;
}

module.exports = checkForData