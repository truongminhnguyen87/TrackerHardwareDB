const last_import_response = await fetch('getImportDateOfFNALPlanesDB');
const last_import_info = await last_import_response.json();
var dates = last_import_info.map(a => a.last_modified);
var max_date =  dates.reduce(function(a, b) { return a > b ? a : b;})
document.getElementById("last_import").innerHTML = "Last imported on: "+max_date;

const showPanelButton = document.getElementById('btnShowPanel');
showPanelButton.addEventListener('click', async function () {
    var output = "";
    var panel_number = parseInt(document.getElementById('panel_number').value);    
    if (!isNaN(panel_number)) {
	const dump_response = await fetch('getPanelFromFNALPlanesDB/'+panel_number);
	const dump_panel_info = await dump_response.json();
	var dump_output = "";
	if (dump_panel_info.length>0) {
	    // From the first row, get the panel number
	    var first_row = dump_panel_info[0];
	    dump_output += "Panel " + first_row["panel_id"] + "\n\n";
	    for (let i_row = 0; i_row < dump_panel_info.length; ++i_row) {
		var this_panel_dump = dump_panel_info[i_row]
		var file_line = this_panel_dump["file_name"] + " (last modified: " + this_panel_dump["last_modified"] + ")";
		dump_output += file_line + "\n";
		for (let i = 0; i < file_line.length; ++i) {
		    dump_output += "=";
		}
		dump_output += "\n";
		dump_output += this_panel_dump["file_contents"] + "\n\n";
	    }
	}
	document.getElementById("dump").innerHTML = dump_output;
    }
    else {
	output = "Input must be a number";
    }
});
