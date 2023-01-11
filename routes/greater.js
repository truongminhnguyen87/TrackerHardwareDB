const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
  .get('/:uw_value', async(req, res, next) =>{
    const collection = db.get().db("TrackerQC").collection('panels');
    const result = await collection.find({ 'issues.missing_straws' : { $size : parseInt(req.params.uw_value)}})
      .toArray();

    if (result) {
      console.log("Result: ", result);
      return res.send(result);
    }
    res.code(500).send({ message: "Not found" });
  })

module.exports = router;
