const express = require("express");
const { getCollectionPoints } = require("../controllers/adminController");

const router = express.Router();

router.get("/", getCollectionPoints);

module.exports = router;
