const { Requests, Users } = require("../models");

const RequestsControl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Тільки авторизовані користувачі можуть надсилати заявки",
      });
    }
    const { fullName, birthDate, phone } = req.body;
    const user_id = req.user.id;
    const passportFile = req.files["passport"]?.[0];
    const selfiFile = req.files["selfie"]?.[0];

    if (!fullName || !birthDate || !phone) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені." });
    }

    if (!passportFile || !selfiFile) {
      return res.status(400).json({ message: "Фото не були завантажені." });
    }

    const passport_path = "/requests/" + passportFile.filename;
    const selfie_path = "/requests/" + selfiFile.filename;
    const newRequest = await Requests.create({
      fullName,
      birthDate,
      phone,
      passport_path,
      selfie_path,
      user_id,
    });

    res.status(201).json({ message: "Заявку створено!", id: newRequest.id });
  } catch (error) {
    console.error("Creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const GetRequestId = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Requests.findByPk(requestId, {
      attributes: [
        "fullName",
        "birthDate",
        "phone",
        "passport_path",
        "selfie_path",
        "status",
        "created_at",
      ],
      include: [{ model: Users, as: "requester", attributes: ["id", "name"] }],
    });

    if (!request) {
      return res.status(404).json({ message: "Заявку не знайдено" });
    }

    res.json(request);
  } catch (error) {
    console.log("Помилка:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const changeRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Невірний статус" });
    }

    const request = await Requests.findByPk(requestId, {
      include: [{ model: Users, as: "requester", attributes: ["id", "role"] }],
    });

    if (!request) {
      return res.status(404).json({ message: "Заявку не знайдено" });
    }

    request.status = status;
    await request.save();

    if (
      status === "approved" &&
      request.requester &&
      request.requester.role !== "admin"
    ) {
      request.requester.role = "organizer";

      await request.requester.save();
    }

    res.json({
      message: `Заявку ${status === "approved" ? "схвалено" : "відхилено"}`,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const showActiveRequests = async (req, res) => {
  try {
    const requests = await Requests.findAll({
      where: { status: "pending" },
      attributes: ["id"],
    });

    res.json(requests);
  } catch (error) {
    console.log("Помилка при отриманні заявок:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const requestsHistory = async (req, res) => {
  try {
    const requests = await Requests.findAll({
      order: [["created_at", "DESC"]],
      attributes: ["id", "fullName", "status", "created_at", "user_id"],
    });

    res.json(requests);
  } catch (error) {
    console.log("Помилка при заявок:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = {
  RequestsControl,
  GetRequestId,
  changeRequestStatus,
  showActiveRequests,
  requestsHistory,
};
