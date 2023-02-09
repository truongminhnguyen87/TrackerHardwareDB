const form = document.querySelector("form");
const log = document.querySelector("#log");
const all_issues = ["missing_straws", "high_current_wires", "blocked_straws", "short_wires", "sparking_wires" ] //, "short_wire" ] // the rest to be added

//
// All Panels Plot
//
const response = await fetch('allPanels');
const allPanelInfo = await response.json();
//console.log(allPanelInfo);
var all_n_data = Array(all_issues.length)
var panels = Array(allPanelInfo.length)
for (let i_panel = 0; i_panel < panels.length; i_panel++) {
    panels[i_panel] = allPanelInfo[i_panel]['id'];
}
for (let i_issue = 0; i_issue < all_issues.length; ++i_issue) {
    var n_issue = Array(allPanelInfo.length);
    var issue = all_issues[i_issue];
    for (let i_panel = 0; i_panel < panels.length; i_panel++) {
	n_issue[i_panel] = allPanelInfo[i_panel][issue].length;
    }

    // Define Data
    all_n_data[i_issue] = {name : issue,
			   x: panels,
			   y: n_issue,
			   mode:"markers",
			   type:"scatter"
			  }
}

issue_vs_panel_plot = document.getElementById('issue_vs_panel_plot');
var xaxis = {title : {text : 'panel number'}, tickmode : "linear", tick0 : 0.0, dtick : 10.0, gridwidth : 2};
var yaxis = {title : {text : 'no. of channels with issues'}};
var layout = { title : {text: "All Issues vs Panel Number"},
	       xaxis : xaxis,
	       yaxis : yaxis,
	       scroolZoom : true };
Plotly.newPlot(issue_vs_panel_plot, all_n_data, layout);

//
// Show issues with specific panel
//
const showPanelButton = document.getElementById('btnShowPanel');
showPanelButton.addEventListener('click', async function () {
    var output = "";
    var panel_number = parseInt(document.getElementById('panel_number').value);
    if (!isNaN(panel_number)) {
	const response = await fetch('getPanel/'+panel_number);
	const panel_info = await response.json();

	// Output the full return to the verbose output section
	document.getElementById("log").innerHTML = JSON.stringify(panel_info,
								  undefined,
								  2);

	var this_title = "Panel "+panel_number;
	output = "Panel "+panel_number;
	if (panel_info.length>0) {
	    var this_panel_issues = panel_info[0]

	    var all_wires = Array(96).fill(0)
	    var wire_numbers = Array(96).fill(0)
	    for (let i = 0; i < all_wires.length; i++) {
		wire_numbers[i] = i;
	    }

	    var data = Array(all_issues.length)
	    var total_issues = 0
	    for (let i = 0; i < data.length; i++) {
		var the_issue = all_issues[i];
		var this_panel_straws = Array(96).fill(0)
		var this_panel_issue = this_panel_issues[the_issue];
		for (let i = 0; i < this_panel_issue.length; i++) {
		    this_panel_straws[this_panel_issue[i]] = 1;
		}
		total_issues = total_issues + this_panel_issue.length
		var this_data = {
		    name : the_issue,
		    type : 'bar',
		    x: wire_numbers,
		    y: this_panel_straws
		};
		data[i] = this_data
	    }
	    
	    straw_status_plot = document.getElementById('straw_status_plot');
	    var xaxis = {title : {text : 'straw number'}, tickmode : "linear", tick0 : 0.0, dtick : 1.0, gridwidth : 2};
	    var yaxis = {title : {text : 'no. of issues'}};
	    var layout = { title : {text: this_title + " Straw/Wire Status"},
			   xaxis : xaxis,
			   yaxis : yaxis,
			   barmode : 'stack',
			   //		   margin: {t:0},
			   scroolZoom : true };
	    Plotly.newPlot(straw_status_plot, data, layout);

	    // total = missing_straws.length + high_current_wires.length + blocked_straws.length + sparking_wires.length;
	    output += " has "+total_issues+" bad channels: ("
	    for (let i = 0; i < data.length; i++) {
		var the_issue = all_issues[i];
		var this_panel_straws = Array(96).fill(0)
		var this_panel_issue = this_panel_issues[the_issue];
		output += this_panel_issue.length + " " + the_issue;
		
		if (i != data.length-1) { output += ", "; }
		else { output += ")"; }
	    }
	}
	else {
	    output += " not found!";
	}
    }
    else {
	output = "Input must be a number";
    }
	    
    document.getElementById("panel_info").innerHTML = output;
});

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
