const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
    .get('/', async(req, res, next) =>{
    let query = 'SELECT * from panels ORDER BY id;'
    console.log(query)
    const result = await db.get().query(query)
    if (result) {
	return res.send(result.rows);
    }
    res.code(500).send({ message: "Not found" });
})

module.exports = router;
