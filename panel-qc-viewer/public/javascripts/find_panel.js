//
// Find panels
//
const findPanelsButton = document.getElementById('btnFindPanels');
findPanelsButton.addEventListener('click', async function () {

    let n_checks = 1;
    if (document.getElementById('uw_op_issue2_and').checked){// || document.getElementById('uw_op_issue2_or').checked) {
	n_checks = 2;
    }
    if (document.getElementById('uw_op_issue3_and').checked){// || document.getElementById('uw_op_issue3_or').checked) {
	n_checks = 3;
    }
    let uw_values = Array(n_checks)
    let uw_ops = Array(n_checks)
    let log_ops = Array(n_checks) // operator characters to write to the log
    let uw_issues = Array(n_checks)
    let uw_andors = Array(n_checks-1)
    let failed = false;
    for (let i_check = 1; i_check<=n_checks; ++i_check) {
	let uw_value = parseInt(document.getElementById('uw_value_issue'+i_check.toString()).value);
	if (!isNaN(uw_value)) {
	    let uw_op = '';
	    let log_op = '';
	    if (document.getElementById('uw_op_issue'+i_check.toString()+'_greater').checked) {
		uw_op = 'gt';
		log_op = '>';
	    }
	    else if (document.getElementById('uw_op_issue'+i_check.toString()+'_lesser').checked) {
		uw_op = 'lt';
		log_op = '<';
	    }
	    else if (document.getElementById('uw_op_issue'+i_check.toString()+'_equal').checked) {
		uw_op = 'eq';
		log_op = '=';
	    }
	    else if (document.getElementById('uw_op_issue'+i_check.toString()+'_greaterequal').checked) {
		uw_op = 'ge';
		log_op = '>=';
	    }
	    else if (document.getElementById('uw_op_issue'+i_check.toString()+'_lesserequal').checked) {
		uw_op = 'le';
		log_op = '<=';
	    }

	    let uw_issue = document.getElementById("issue"+i_check.toString()).value
	    uw_values[i_check-1] = uw_value;
	    uw_ops[i_check-1] = uw_op;
	    uw_issues[i_check-1] = uw_issue;
	    log_ops[i_check-1] = log_op;

	    var uw_andor = '';
	    if (i_check > 1) {
		if (document.getElementById('uw_op_issue'+i_check.toString()+'_and').checked) {
		    uw_andor = 'and';
		}
		else if (document.getElementById('uw_op_issue'+i_check.toString()+'_or').checked) {
		    uw_andor = 'or';
		}
		uw_andors[i_check-2] = uw_andor;
	    }
	}
	else {
	    failed = true;
	    break;
	}
    }
    var text = "";
    if (!failed) {
	var greater_info = await findPanels(uw_values, uw_ops, uw_issues, uw_andors);
	document.getElementById("log").innerHTML = JSON.stringify(
	    greater_info,
	    undefined,
	    2);

	var panels = Array(greater_info.length)
	for (let i = 0; i < greater_info.length; i++) {
	    panels[i] = greater_info[i]['id'];
	}
	text = panels.length + " panels with ";
	for (let i = 0; i < uw_values.length; ++i) {
	    if (i > 0) {
		text += " " + uw_andors[i-1] + " ";
	    }
	    text += log_ops[i]+uw_values[i]+" "+uw_issues[i];
	}
	text += ":\n "+panels;
    }
    else {
	text = "Problem with input";
    }
    document.getElementById("found_panel_info").innerHTML = text;
});

async function findPanels(uw_values, uw_ops, uw_issues, uw_andors) {
    var url = 'findPanels/';
    for (let i_issue = 0; i_issue < uw_values.length; ++i_issue) {
	if (i_issue > 0) {
	    url += "/" + uw_andors[i_issue-1] + "/";
	}
	url += uw_ops[i_issue] + "/" + uw_values[i_issue].toString() + "/" + uw_issues[i_issue];
    }
    console.log(url)
  const response = await fetch(url);
  const panelInfo = await response.json();
  return panelInfo;
}
