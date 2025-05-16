const { Users } = require("./users");
const { Lots } = require("./lots");
const { Bids } = require("./bids");
const { Requests } = require("./verification");

Users.hasMany(Lots, { foreignKey: "creator_id" });
Lots.belongsTo(Users, { foreignKey: "creator_id", as: "creator" });

Lots.hasMany(Bids, { foreignKey: "auction_id", as: "bids" });
Bids.belongsTo(Lots, { foreignKey: "auction_id", as: "lot_owner" });

Users.hasMany(Bids, { foreignKey: "user_id" });
Bids.belongsTo(Users, { foreignKey: "user_id", as: "user_bid" });

Users.hasMany(Requests, { foreignKey: "userId" });
Requests.belongsTo(Users, { foreignKey: "user_id", as: "requester" });

module.exports = {
  Users,
  Lots,
  Bids,
  Requests,
};
