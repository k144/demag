let algName = '';

function updateFilename() {
	let field = document.getElementById("filename-field");
	let button = document.getElementById("dl-button");
	algName = field.value;
	console.log(algName);
	button.innerText = "pobierz " + algName + ".alg";
}

function cleanup(blocks) {
	let result = new Array()
	for (let block of blocks) {
		// bloczki bez wyjścia to nieistniejące w formacie alg wrappery
		if (block.ID == undefined) {
			continue;
		}
		// tak oznaczone są puste wyjścia bloczka w plikach .alg
		const noOut = 4294967295;
		if (block.outA == undefined) {
			block.outA = noOut;
		}
		if (block.outB == undefined) {
			block.outB = noOut;
		}
		result.push(block);
	}
	return result;
}

function getBlocksPos(blocks) {
	let result = new Array();
	for (let block of blocks) {
		let blockDiv = document.getElementById(block.ID);
		block.X = blockDiv.offsetLeft;
		block.Y = blockDiv.offsetTop;
		result.push(block);
	}
	return result;
}

function download() {
	let blocks = Blocks;
	blocks = cleanup(blocks);
	console.log(blocks);
	blocks = getBlocksPos(blocks);
	console.log(blocks);
	let JSONdata = new Blob([JSON.stringify(blocks)], { type: "text/plain;charset=utf-8" });
	let fileReader = new FileReader();
	fileReader.readAsArrayBuffer(JSONdata);
	fileReader.onload = function () {
		let arrayBuffer = fileReader.result;
		let arr = new Uint8Array(arrayBuffer);
		const maxAlgByteSize = 1000000;
		let decodedData = new Uint8Array(maxAlgByteSize);
		bytesCopied = jalg(arr, decodedData);
		decodedData = decodedData.slice(0, bytesCopied);
		let decodedBlob = new Blob([decodedData]);
		saveAs(decodedBlob, algName + ".alg");
	}
}