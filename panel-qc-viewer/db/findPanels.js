const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
  .get('/:uw_op/:uw_value/:uw_issue/:andor2?/:uw_op2?/:uw_value2?/:uw_issue2?/:andor3?/:uw_op3?/:uw_value3?/:uw_issue3?', async(req, res, next) =>{

      // start putting the url together for the query engine
      let url = 'https://dbdata0vm.fnal.gov:8444/QE/mu2e/prod/app/SQ/query?dbname=mu2e_tracker_prd&t=qc.panels';
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
      url += "&w=cardinality(" + uw_issue + "):"+req.params.uw_op+":"+req.params.uw_value;
      if (req.params.andor2) {
       	  url += '&w=cardinality('+req.params.uw_issue2+'):'+req.params.uw_op2+":"+req.params.uw_value2;
	  if (req.params.andor3) {
	      url += '&w=cardinality('+req.params.uw_issue3+'):'+req.params.uw_op3+":"+req.params.uw_value3;
	  }
      }
      console.log(url)
      const response = await fetch(url+'&o=id&f=text');
      const panelInfo = await response.text();
      return res.send(panelInfo);
  })

module.exports = router;
