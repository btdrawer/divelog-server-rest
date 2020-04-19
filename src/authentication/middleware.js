const { getAuthData } = require("./authUtils");
const routerUrls = require("../constants/routerUrls");
const UserModel = require("../models/UserModel");

// Middleware files for individual resources
const diveMiddleware = require("./middleware/diveMiddleware");
const clubMiddleware = require("./middleware/clubMiddleware");
const gearMiddleware = require("./middleware/gearMiddleware");
const groupMiddleware = require("./middleware/groupMiddleware");

// Error handling
const handleError = require("../handlers/handleError");
const { INVALID_AUTH } = require("../constants/errorKeys");

module.exports = async (req, res, next) => {
    try {
        const data = getAuthData(req);

        const user = await UserModel.findOne({
            _id: data._id
        });

        if (!user) throw new Error(INVALID_AUTH);

        // Additional middleware for individual resources
        switch (req.baseUrl) {
            case routerUrls.DIVE:
                await diveMiddleware(req, data);
                break;
            case routerUrls.CLUB:
                await clubMiddleware(req, data);
                break;
            case routerUrls.GEAR:
                await gearMiddleware(req, data);
                break;
            case routerUrls.GROUP:
                await groupMiddleware(req, data);
                break;
            default:
                break;
        }

        next();
    } catch (err) {
        handleError(res, err);
    }
};
