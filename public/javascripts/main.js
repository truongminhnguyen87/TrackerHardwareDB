const submitButton = document.getElementById('btnSubmit');
const form = document.querySelector("form");
const log = document.querySelector("#log");

submitButton.addEventListener('click', function () {
  console.log("Submitted ...")
  const data = new FormData(form);
  let output = "";
  for (const entry of data) {
    output = `${output}${entry[0]}=${entry[1]}\r`;
  }
  log.innerText = output;
  // document.getElementById("panel_info").innerHTML = JSON.stringify(
    // await getGreater(parseInt(document.getElementById('uw_value').value))
  // );
});

async function getGreater(uw_value) {
  const response = await fetch('http://127.0.0.1:3000/greater/' + uw_value.toString());
  const panelInfo = await response.json();
  return panelInfo;
}

const showButton = document.getElementById('btnShowAllFields');
showButton.addEventListener('click', async function () {
  document.getElementById("panel_info").innerHTML = JSON.stringify(
    await getPanel(parseInt(document.getElementById('panel_number').value)),
    undefined,
    2);
});

async function getPanel(panelNumber) {
  const response = await fetch('http://127.0.0.1:3000/panel/' + panelNumber.toString());
  const panelInfo = await response.json();
  return panelInfo;
}
