const submitButton = document.getElementById('btnSubmit');
const form = document.querySelector("form");
const log = document.querySelector("#log");
const all_issues = ["missing_straws", "high_current_wires", "blocked_straws" ] //, "sparking_wires" ] //, "short_wire" ] // the rest to be added

submitButton.addEventListener('click', async function () {
  const data = new FormData(form);
  // let output = "";
  // for (const entry of data) {
  //   output = `${output}${entry[0]}=${entry[1]}\r`;
  // }
    //   log.innerText = output;
    let uw_value = parseInt(document.getElementById('uw_value').value);
    let uw_op = '';
    if (document.getElementById('uw_op_greater').checked) {
	uw_op = '>';
    }
    else if (document.getElementById('uw_op_lesser').checked) {
	uw_op = '<';
    }
    else if (document.getElementById('uw_op_equal').checked) {
	uw_op = '=';
    }
    else if (document.getElementById('uw_op_greaterequal').checked) {
	uw_op = '>=';
    }
    else if (document.getElementById('uw_op_lesserequal').checked) {
	uw_op = '<=';
    }

    var greater_info = await getGreater(uw_value, uw_op);
    document.getElementById("log").innerHTML = JSON.stringify(
	greater_info,
	undefined,
	2);

    var panels = Array(greater_info.length)
    for (let i = 0; i < greater_info.length; i++) {
	panels[i] = greater_info[i]['id'];
    }
    document.getElementById("panel_info").innerHTML = panels.length + " panels with "+uw_op+uw_value+" missing straws: "+panels;

//    let selected = document.getElementById("issues").value
//    console.log(selected)
});

async function getGreater(uw_value, uw_op) {
  const response = await fetch('http://localhost:3000/greater/' + uw_op + "-" + uw_value.toString());
  const panelInfo = await response.json();
  return panelInfo;
}

const showButton = document.getElementById('btnShowAllFields');
showButton.addEventListener('click', async function () {

    var panel_number = parseInt(document.getElementById('panel_number').value);
    var this_title = "Panel "+panel_number;
    var panel_info = await getPanel(panel_number);
    document.getElementById("log").innerHTML = JSON.stringify(panel_info,
	undefined,
	2);

    var this_panel_issues = panel_info[0]

    var all_wires = Array(96).fill(0)
    var wire_numbers = Array(96).fill(0)
    for (let i = 0; i < all_wires.length; i++) {
	wire_numbers[i] = i+1;
    }

    var data = Array(all_issues.length)
    var total_issues = 0
    for (let i = 0; i < data.length; i++) {
	var the_issue = all_issues[i];
	var this_panel_straws = Array(96).fill(0)
//	console.log(the_issue)
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
    var output = "Panel "+panel_number+" has "+total_issues+" bad channels: ("
    for (let i = 0; i < data.length; i++) {
	var the_issue = all_issues[i];
	var this_panel_straws = Array(96).fill(0)
	var this_panel_issue = this_panel_issues[the_issue];
	output += this_panel_issue.length + " " + the_issue;

	if (i != data.length-1) { output += ", "; }
	else { output += ")"; }
    }
    document.getElementById("panel_info").innerHTML = output;
});

async function getPanel(panelNumber) {
    const response = await fetch('http://localhost:3000/panel/' + panelNumber.toString());
    const panelInfo = await response.json();
    return panelInfo;
}
