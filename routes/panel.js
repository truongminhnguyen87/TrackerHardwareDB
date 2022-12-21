const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const db = require("../routes/db");

router
  .get('/:id', async(req, res, next) =>{
    const collection = db.get().db("TrackerQC").collection('panels');
    const result = await collection.find({ id: req.params.id }).sort({$natural: -1}).toArray();
    if (result) {
      return res.send(result);
    }
    res.code(500).send({ message: "Not found" });
  })


async function listPanels(req, reply) {
  const panels = this.mongo.db.collection("panels");
  const result = await panels.find({}).toArray();
  reply.send(result);
}

async function updatePanel(req, reply) {
  const users = this.mongo.db.collection("panels");
  const id = req.params.id;
  const issues = req.body;
  const updateDoc = {
    $set: {
      id,
      issues,
    },
  };
  const result = await users.updateOne(
    { id: id }, // filter
    updateDoc, // update
    { upsert: true } // options
  );

  console.log(result);

  if (result.matchedCount === 1 && result.upsertedCount == 0) {
    reply.send({
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  }
  else if (result.matchedCount === 0 && result.upsertedCount === 1) {
    reply.send({
      message: `${result.matchedCount} document(s) matched the filter, insert ${result.upsertedCount} document(s)`,
    });
  }
  else {
    reply.code(500).send({ message: "Hmm, something is wrong." });
  }
}

module.exports = router;
