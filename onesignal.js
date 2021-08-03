const onesignalClients = {};
const oneSignalIconNames = {};

const OneSignal = require("onesignal-node");

/**
 * 
 * onesignalConfigurations = [{
 *  shortCode: "",          //required
 *  appAuthKey: "",         //required
 *  appId: "",              //required
 *  largeIcon: "",
 *  smallIcon: ""
 * }]
 */
const initOnesignal = ({ onesignalConfigurations = [] }) => {
    onesignalConfigurations
        .filter(configuration => configuration.shortCode && configuration.appAuthKey && configuration.appId)
        .forEach((configuration) => {
            onesignalClients[configuration.shortCode] = new OneSignal.Client({
                userAuthKey: configuration.appAuthKey,
                app: { appAuthKey: configuration.appAuthKey, appId: configuration.appId }
            });

            oneSignalIconNames[configuration.shortCode] = {}
            oneSignalIconNames[configuration.shortCode].smallIcon = configuration.smallIcon;
            oneSignalIconNames[configuration.shortCode].largeIcon = configuration.largeIcon;
        })
}

const getOnesignalIconNames = (key) => key ? oneSignalIconNames[key] : oneSignalIconNames;

const send = async ({
    title,
    content,
    picture,
    sendDate,
    data,
    segments,
    tag,
    shortCode,
    smallIcon,
    largeIcon
}) => {
    if (shortCode && typeof shortCode === "string") {
        shortCode = [shortCode];
    }

    let shortCodes = Object.keys(onesignalClients);

    for (let index = 0; index < shortCodes.length; index++) {
        if (shortCode && shortCode.length && shortCode.indexOf(shortCodes[index]) === -1)
            continue;

        const oneSignalClient = onesignalClients[shortCodes[index]];

        if (!oneSignalClient)
            continue;

        const result = {};

        const resultOfSend = await new Promise((res, rej) => {
            let sendTitle = (typeof title == "string") ? { en: title } : title,
                sendContent = (typeof content == "string") ? { en: content } : content,
                sendData = data,
                sendSegments = segments || ["Active Users", "Inactive Users"],
                sendAfterDate = sendDate ? sendDate + "" : null;

            let notification = new OneSignal.Notification({
                contents: sendContent,
            });

            notification.postBody["included_segments"] = sendSegments;
            notification.postBody["headings"] = sendTitle;

            tag = tag || [];
            if (!Array.isArray(tag)) {
                tag = [tag];
            }

            if (tag && tag.length) {
                notification.postBody.filters = [];

                tag.forEach((t, i) => {
                    if (i != 0) {
                        notification.postBody.filters.push({ "operator": "OR" });
                    }

                    notification.postBody.filters.push({ "field": "tag", "key": t, "relation": "==", "value": t });
                })
            }

            if (sendData)
                notification.postBody["data"] = sendData;

            if (sendAfterDate)
                notification.postBody["send_after"] = sendAfterDate;

            if (picture) {
                notification.postBody["big_picture"] = picture;
            }

            notification.postBody["small_icon"] = smallIcon || oneSignalIconNames[shortCodes[index]].smallIcon;
            notification.postBody["large_icon"] = largeIcon || oneSignalIconNames[shortCodes[index]].largeIcon;

            oneSignalClient.sendNotification(notification, function (err, httpResponse, data) {
                res({
                    err,
                    data
                });
            });

        });

        result[shortCodes[index]] = resultOfSend
    }

    return result;
}



module.exports = {
    initOnesignal,
    send,
    getOnesignalIconNames
}