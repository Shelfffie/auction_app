const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Users } = require("../models");

const {
  RequestsControl,
  GetRequestId,
  changeRequestStatus,
  showActiveRequests,
  requestsHistory,
} = require("../controllers/verifyController");

const { registerUser, loginUser } = require("../controllers/authControllers");
const {
  profileContr,
  deleteUserContr,
} = require("../controllers/profileControllers.js");

const {
  LotContrl,
  IdLots,
  editLotContrl,
  editLotStatus,
  delLotCntrl,
  payLotController,
} = require("../controllers/lotsController");

const { addBid, getBiddsByAuction } = require("../controllers/bidsController");
const { getUserProfile } = require("../controllers/anotherUserControl");

const {
  showCreatedLots,
  showBidsById,
} = require("../controllers/showLotsByIdConrtol");

const {
  GetUserInfo,
  editUserControl,
  deletUserControl,
} = require("../controllers/admin/userControl");

const {
  GetlotInfo,
  editlotControl,
  deletlotControl,
} = require("../controllers/admin/lotControl");
const upload = require("../middlewares/uploadMiddlewares");
const requestsPhoto = require("../middlewares/requestsMiddlewares");

const verifyAdmin = require("../middlewares/requireAdmin");
const verifyToken = require("../middlewares/authMiddleware");

const {
  sendMessage,
  getMessage,
} = require("../controllers/messagesControllers");

const {
  showLots,
  showActiveLots,
  showAllLots,
  getWonLots,
} = require("../controllers/showLotsControl");

const { recoverAcount } = require("../controllers/accountStatusController");

const {
  NewRecoveryController,
  GetUserAppeal,
} = require("../controllers/requestRecoverController");

const {
  GetAllAppeals,
  showActiveAppeals,
  changeAppealStatus,
} = require("../controllers/admin/appeals.Control");

router.get("/active-recover-list", verifyToken, verifyAdmin, showActiveAppeals);
router.put(
  "/active-recover-list",
  verifyToken,
  verifyAdmin,
  changeAppealStatus
);
router.get("/recover-history", verifyToken, verifyAdmin, GetAllAppeals);

router.post("/new-recover", verifyToken, NewRecoveryController);
router.get("/user-appeal", verifyToken, GetUserAppeal);

router.put("/recover-deleted", verifyToken, recoverAcount);

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await Users.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    if (user.status !== "unverified") {
      return res.status(400).json({ message: "Пошта вже підтверджена." });
    }

    user.status = "active";
    await user.save();

    res.status(200).json({ message: "Пошта успішно підтверджена!" });
  } catch (error) {
    res.status(400).json({ message: "Недійсний або прострочений токен." });
  }
});

router.get("/won/:userId", getWonLots);
router.post("/lot/:id/pay", verifyToken, payLotController);
router.get("/messages/:auction_id", verifyToken, getMessage);
router.post("/messages", verifyToken, sendMessage);

router.get("/admin/controller/user/:id", verifyToken, verifyAdmin, GetUserInfo);
router.put(
  "/admin/controller/user/:id",
  verifyToken,
  verifyAdmin,
  editUserControl
);
router.delete(
  "/admin/controller/user/:id",
  verifyToken,
  verifyAdmin,
  deletUserControl
);

router.get("/admin/controller/lots/:id", verifyToken, verifyAdmin, GetlotInfo);
router.put(
  "/admin/controller/lots/:id",
  verifyToken,
  verifyAdmin,
  editlotControl
);
router.delete(
  "/admin/controller/lots/:id",
  verifyToken,
  verifyAdmin,
  deletlotControl
);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      user_role: user.role,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
});

router.patch("/profile", verifyToken, profileContr);
router.put("/profile/delete", verifyToken, deleteUserContr);

router.get("/lots/latest", (req, res) => {
  console.log("Показати 2 останні аук");
  showLots(req, res);
});

router.get("/user/:id", getUserProfile);

router.post("/lots/create", verifyToken, upload.single("image"), LotContrl);

router.get("/lot/:id", IdLots);

router.put("/lot/:id", upload.single("image"), verifyToken, (req, res) => {
  console.log("Put");
  editLotContrl(req, res);
});

router.put("/lot/:id/status", verifyToken, editLotStatus);

router.delete("/lot/:id", verifyToken, delLotCntrl);

router.post("/lot/:id/bids", addBid);
router.get("/lot/:id/bids", getBiddsByAuction);

router.get("/lots/active", showActiveLots);
router.get("/lots/ended", showAllLots);

router.get("/creator/:userId", showCreatedLots),
  router.get("/participated/:userId", showBidsById);

router.post(
  "/request",
  verifyToken,
  requestsPhoto.fields([
    { name: "passport", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  RequestsControl
);

router.get("/request/:id", verifyToken, verifyAdmin, GetRequestId);
router.put(
  "/request/:id/status",
  verifyToken,
  verifyAdmin,
  changeRequestStatus
);

router.get("/requests/active", verifyToken, verifyAdmin, showActiveRequests);
router.get("/requests/history", verifyToken, verifyAdmin, requestsHistory);

module.exports = router;
