const express = require("express");
const router = express.Router();
const { Users } = require("../models");

const { registerUser, loginUser } = require("../controllers/authControllers");
const { profileContr } = require("../controllers/profileControllers.js");
const verifyToken = require("../middlewares/authMiddleware");

const {
  LotContrl,
  IdLots,
  editLotContrl,
  editLotStatus,
  delLotCntrl,
} = require("../controllers/lotsController");

const { addBid, getBiddsByAuction } = require("../controllers/bidsController");
const { getUserProfile } = require("../controllers/anotherUserControl");

const {
  showLots,
  showActiveLots,
  showAllLots,
} = require("../controllers/showLotsControl");

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
const verifyAdmin = require("../middlewares/requireAdmin");

router.get("/admin/controller/user/:id", verifyToken, verifyAdmin, GetUserInfo);
router.put(
  "/admin/controller/lots/:id",
  verifyToken,
  verifyAdmin,
  editUserControl
);
router.delete(
  "/admin/controller/user",
  verifyToken,
  verifyAdmin,
  deletUserControl
);

router.get("/admin/controller/user", verifyToken, verifyAdmin, GetlotInfo);
router.put("/admin/controller/user", verifyToken, verifyAdmin, editlotControl);
router.delete(
  "/admin/controller/user",
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
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
});

router.put("/profile", verifyToken, (req, res) => {
  console.log("Put");
  profileContr(req, res);
});

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

module.exports = router;
