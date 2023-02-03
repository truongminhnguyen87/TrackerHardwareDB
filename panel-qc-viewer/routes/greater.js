const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
  .get('/:uw_op/:uw_value/:uw_issue/:andor2?/:uw_op2?/:uw_value2?/:uw_issue2?/:andor3?/:uw_op3?/:uw_value3?/:uw_issue3?', async(req, res, next) =>{
//    const collection = db.get().db("TrackerQC").collection('panels');
//    const result = await collection.find({ 'issues.missing_straws' : { $size : parseInt(req.params.uw_value)}})
      //      .toArray();

      // use 'cardinality' instead of 'array_length' because we want an empty array to return 0
      let uw_issue="";
      if (req.params.uw_issue == "total_issues") {
	  uw_issue = "array_cat(missing_straws, array_cat(blocked_straws, high_current_wires))";
      }
      else if (req.params.uw_issue == "unusable_channels") {
	  uw_issue = "missing_straws";
      }
      else if (req.params.uw_issue == "semi_unusable_channels") {
	  uw_issue = "array_cat(blocked_straws, high_current_wires)";
      }
      else { uw_issue=req.params.uw_issue; }
      
      let query = 'SELECT * FROM panels WHERE cardinality('+uw_issue+')'+req.params.uw_op+req.params.uw_value;
      if (req.params.andor2) {
	  query += " " + req.params.andor2 + ' cardinality('+req.params.uw_issue2+')'+req.params.uw_op2+req.params.uw_value2;
	  if (req.params.andor3) {
	      query += " " + req.params.andor3 + ' cardinality('+req.params.uw_issue3+')'+req.params.uw_op3+req.params.uw_value3;
	  }
      }
      query += ' ORDER BY id;'
      console.log(query)
      const result = await db.get().query(query)

    if (result) {
	console.log("Result: ", result.rows);
      return res.send(result.rows);
    }
    res.code(500).send({ message: "Not found" });
  })

module.exports = router;
