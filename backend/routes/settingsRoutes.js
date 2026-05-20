const express = require("express");
const { getPublicSettings } = require("../controllers/adminController");

const router = express.Router();

router.get("/public", getPublicSettings);

module.exports = router;
