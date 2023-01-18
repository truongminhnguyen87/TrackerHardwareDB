const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
  .get('/:uw_value', async(req, res, next) =>{
//    const collection = db.get().db("TrackerQC").collection('panels');
//    const result = await collection.find({ 'issues.missing_straws' : { $size : parseInt(req.params.uw_value)}})
      //      .toArray();

      // use 'cardinality' instead of 'array_length' because we want an empty array to return 0
      let query = 'SELECT * FROM panels WHERE cardinality(missing_straws)='+req.params.uw_value+' ORDER BY id;'
      console.log(query)
      const result = await db.get().query(query)

    if (result) {
      console.log("Result: ", result.rows);
      return res.send(result.rows);
    }
    res.code(500).send({ message: "Not found" });
  })

module.exports = router;
