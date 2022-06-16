import Service from '../../services';
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";
import TokenManager from "../../lib/tokenManager";

const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const Config = UniversalFunctions.CONFIG;

/**
 * @description Authentication for AAF Rapid SSO
 * @param {Object} payloadData 
 * @param {String} payloadData.name
 * @param {String} payloadData.email 
 * @param {Function} callback 
 */
const authCallback = (payloadData, callback) => {
    let ssoData;
    async.series([
        (cb) => {
            var dataToSave = {
                name: payloadData.name,
                email: payloadData.email,
                ssoString: UniversalFunctions.generateUrlSafeRandomString()
            }
            Service.SSOManagerService.createRecord(dataToSave, (err, data) => {
                if (err) cb(err)
                else {
                    ssoData = data;
                    cb()
                }
            })
        }
    ], (err, data) => {
        if (err) return callback(err)
        else return callback(null, { ssoData: ssoData })
    })
}

/**
 * @description SSO validation to register or login a user
 * @param {Object} payloadData 
 * @param {String} payloadData.ssoToken 
 * @param {Function} callback 
 */
const validateUserSSO = (payloadData, callback) => {
    let ssoData, userData, accessToken;
    let newUser = false;
    async.series([
        (cb) => {
            var criteria = {
                ssoString: payloadData.ssoToken
            }
            Service.SSOManagerService.getRecord(criteria, {}, {}, (err, data) => {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.SSO_STRING_EXPIRED)
                    else {
                        ssoData = (data && data[0]) || null;
                        cb();
                    }
                }
            })
        },
        (cb) => {
            var criteria = {
                _id: ssoData._id
            }
            Service.SSOManagerService.deleteRecord(criteria, (err, data) => {
                if (err) cb(err)
                else cb()
            })
        },
        (cb) => {
            var criteria = {
                emailId: ssoData.email
            }
            Service.UserService.getRecord(criteria, {}, {}, (err, data) => {
                if (err) cb(err)
                else {
                    if (data.length == 0) {
                        newUser = true;
                        cb()
                    }
                    else {
                        userData = (data && data[0]) || null;
                        cb()
                    }

                }
            })
        },
        (cb) => {
            if (newUser) {
                var nameArray = ssoData.name.split(" ")
                const firstName = nameArray[0];
                let lastName = firstName;
                if (nameArray.length >= 2) {
                    lastName = nameArray[0];
                }
                var dataToSave = {
                    firstName: firstName,
                    lastName: lastName,
                    emailId: ssoData.email,
                    registrationDate: new Date().toISOString(),
                    deakinSSO: true,
                    emailVerified: true
                }
                Service.UserService.createRecord(dataToSave, (err, data) => {
                    if (err) cb(err)
                    else {
                        userData = data;
                        cb()
                    }
                })
            }
            else cb()
        },
        (cb) => {
            var tokenData = {
                id: userData._id,
                type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER
            };
            TokenManager.setToken(tokenData, payloadData.deviceData, (err, output) => {
                if (err) cb(err);
                else {
                    accessToken = (output && output.accessToken) || null;
                    cb();
                }
            });
        }
    ], (err) => {
        if (err) return callback(err)
        else return callback(null, { accessToken: accessToken, userData: userData })
    })
}
export default {
    authCallback,
    validateUserSSO
};