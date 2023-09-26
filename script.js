// --------bus audio-------------

const busAudio = new Audio('./assets/bus horn.mp3');

function myAudioFunction() {
  busAudio.play();
}


// ----------get bus info api-------------

const busIdDiv = document.getElementById('busId');
const nextBusDiv = document.getElementById('nextBus');
const subBusDiv = document.getElementById('subBus');
const nextBus2Div = document.getElementById('nextBus2');
const nextBus3Div = document.getElementById('nextBus3');


async function fetchBusArrival(busStopIdInput, busIdFilter) {

  try {
    const response = await fetch(`https://arrivelah2.busrouter.sg/?id=${busStopIdInput}`);

    if (response.ok) {
      const busStopArrivalData = await response.json();

      // ------------clear html-------------
      let busId = '';
      let nextBus = '';
      let subBus = '';
      let nextBus2 = '';
      let nextBus3 = '';

      for (const service of busStopArrivalData.services) {

        if (busIdFilter && service.no !== busIdFilter) {
        continue;
      }
        // --------avoid null error to make crash--------
        const nextExists = service.next && service.next.duration_ms !== null;
        const subsequentExists = service.subsequent && service.subsequent.duration_ms !== null;
        const next2Exists = service.next2 && service.next2.duration_ms !== null;
        const next3Exists = service.next3 && service.next3.duration_ms !== null;

        const nextMinute = nextExists ? (service.next.duration_ms / 60000).toFixed(0) : 'N/A';
        const subsequentMinute = subsequentExists ? (service.subsequent.duration_ms / 60000).toFixed(0) : 'N/A';
        const nextNext2Minute = next2Exists ? (service.next2.duration_ms / 60000).toFixed(0) : 'N/A';
        const nextNext3Minute = next3Exists ? (service.next3.duration_ms / 60000).toFixed(0) : 'N/A';

        // -------------api data formatting----------

        let busIdInfo = service.no;
        let nextBusInfo = nextMinute <= 0 ? 'Arriving' : nextMinute;
        let subBusInfo = subsequentMinute <= 0 ? 'Arriving' : subsequentMinute;
        let nextBus2Info = nextNext2Minute <= 0 ? 'Arriving' : nextNext2Minute;
        let nextBus3Info = nextNext3Minute <= 0 ? 'Arriving' : nextNext3Minute;

        busId += `<div id="busId" class="col-sm-4">${busIdInfo}</div>`
        nextBus += `<div id="busId" class="col-sm-2">${nextBusInfo}</div>`
        subBus += `<div id="busId" class="col-sm-2">${subBusInfo}</div>`
        nextBus2 += `<div id="busId" class="col-sm-2">${nextBus2Info}</div>`
        nextBus3 += `<div id="busId" class="col-sm-2">${nextBus3Info}</div>`

      }

      busIdDiv.innerHTML = busId;
      nextBusDiv.innerHTML = nextBus;
      subBusDiv.innerHTML = subBus;
      nextBus2Div.innerHTML = nextBus2;
      nextBus3Div.innerHTML = nextBus3;

    } else {
      busIdDiv.innerHTML = 'Error fetching bus arrival data.';
    }
  } catch (error) {
    busIdDiv.innerHTML = `Error: ${error}`;
  }
}

// ----------run button and take value from option----------
function getBusTiming() {
  const selectElement = document.getElementById('selectorBusStop');
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const busStopIdInput = selectedOption.value;
  const busIdInput = document.getElementById('busIdInput').value; // Get the bus number filter value
  
  fetchBusArrival(busStopIdInput, busIdInput);
}


// ------------reset to clear busInfo--------------------
function resetBusInfo() {
  document.getElementById('busIdInput').value = ''; //clear Bus No:

  // ----dash to busInfo---------
  busIdDiv.innerHTML = '-';
  nextBusDiv.innerHTML = '-';
  subBusDiv.innerHTML = '-';
  nextBus2Div.innerHTML = '-';
  nextBus3Div.innerHTML = '-';
}


// -----------press enter to run---------
function checkEnter(event) {
  if (event.keyCode === 13) {
    getBusTiming();
  }
}