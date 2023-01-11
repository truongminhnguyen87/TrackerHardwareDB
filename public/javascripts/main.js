const submitButton = document.getElementById('btnSubmit');
const form = document.querySelector("form");
const log = document.querySelector("#log");


submitButton.addEventListener('click', async function () {
  console.log("Submitted ...")
  const data = new FormData(form);
  // let output = "";
  // for (const entry of data) {
  //   output = `${output}${entry[0]}=${entry[1]}\r`;
  // }
    //   log.innerText = output;
    let uw_value = parseInt(document.getElementById('uw_value').value);
    greater_info = await getGreater(uw_value);
    document.getElementById("log").innerHTML = JSON.stringify(
	greater_info,
	undefined,
	2);

    panels = Array(greater_info.length)
    for (let i = 0; i < greater_info.length; i++) {
	panels[i] = greater_info[i].id;
    }
    console.log(uw_value);
    document.getElementById("panel_info").innerHTML = "Panels with "+uw_value+" missing straws: "+panels;
});

async function getGreater(uw_value) {
  const response = await fetch('http://localhost:3000/greater/' + uw_value.toString());
  const panelInfo = await response.json();
  return panelInfo;
}

const showButton = document.getElementById('btnShowAllFields');
showButton.addEventListener('click', async function () {

    var this_title = "Panel "+parseInt(document.getElementById('panel_number').value);
    panel_info = await getPanel(parseInt(document.getElementById('panel_number').value));
    document.getElementById("log").innerHTML = JSON.stringify(panel_info,
	undefined,
	2);

    issues = panel_info[0]['issues']

    all_wires = Array(96).fill(0)
    wire_numbers = Array(96).fill(0)
    for (let i = 0; i < all_wires.length; i++) {
	wire_numbers[i] = i+1;
    }

    all_missing_straws = Array(96).fill(0)
    missing_straws = issues['missing_straws']
    for (let i = 0; i < missing_straws.length; i++) {
	all_missing_straws[missing_straws[i]] = 1;
    }
    all_high_current_wires = Array(96).fill(0)
    high_current_wires = issues['high_current_wires']
    for (let i = 0; i < high_current_wires.length; i++) {
	all_high_current_wires[high_current_wires[i]] = 1;
    }
    all_blocked_straws = Array(96).fill(0)
    blocked_straws = issues['blocked_straws']
    for (let i = 0; i < blocked_straws.length; i++) {
	all_blocked_straws[blocked_straws[i]] = 1;
    }
    all_sparking_wires = Array(96).fill(0)
    sparking_wires = issues['sparking_wires']
    for (let i = 0; i < sparking_wires.length; i++) {
	all_sparking_wires[sparking_wires[i]] = 1;
    }
    
    straw_status_plot = document.getElementById('straw_status_plot');
    var missings = {
	name : 'missing straws',
	type : 'bar',
	x: wire_numbers,
	y: all_missing_straws
    };
    var high_currents = {
	name : 'high current wires',
	type : 'bar',
	x: wire_numbers,
	y: all_high_current_wires
    };
    var blockeds = {
	name : 'blocked straws',
	type : 'bar',
	x: wire_numbers,
	y: all_blocked_straws
    };
    var sparkings = {
	name : 'sparking wires',
	type : 'bar',
	x: wire_numbers,
	y: all_sparking_wires
    };
    var data = [missings, high_currents, blockeds, sparkings];
    var xaxis = {title : {text : 'straw number'}, tickmode : "linear", tick0 : 0.0, dtick : 1.0};
    var yaxis = {title : {text : 'status'}};
    var layout = { title : {text: this_title + " Straw/Wire Status"},
		   xaxis : xaxis,
		   yaxis : yaxis,
//		   margin: {t:0},
		   scroolZoom : true };
    Plotly.newPlot(straw_status_plot, data, layout);
});

async function getPanel(panelNumber) {
    const response = await fetch('http://localhost:3000/panel/' + panelNumber.toString());
    const panelInfo = await response.json();
    return panelInfo;
}
