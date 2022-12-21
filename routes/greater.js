const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
  .get('/:uw_value', async(req, res, next) =>{
    const collection = db.get().db("TrackerQC").collection('panels');
    query = "issues.missing_straw." + req.params.uw_value;
    console.log(query);
    const result = await collection.find({ 
      query: {  $exists: true }
    })
      .toArray();

    if (result) {
      console.log("Result: ", result);
      return res.send(result);
    }
    res.code(500).send({ message: "Not found" });
  })

module.exports = router;
