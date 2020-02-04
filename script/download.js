let algName = '';

function updateFilename(){
    let field = document.getElementById("filename-field");
    let button = document.getElementById("dl-button");
    algName = field.value;
    console.log(algName);
    button.innerText = "pobierz " + algName + ".alg";
}

function download() {
	let blocks = new Array();
	for (let i = 0; i < Blocks.length; i++) {
		let block = Blocks[i];
		let blockID = block.ID;
		// bloczki bez ID to wrappery
		if (blockID == undefined) {
			continue;
		}
		let blockDiv = document.getElementById(blockID);
		block.X = blockDiv.offsetLeft;
		block.Y = blockDiv.offsetTop;
		const noOut = 4294967295; // tak oznaczone jest puste wyjście bloczka
		if (block.outA == undefined) {
			block.outA = noOut;
		}
		if (block.outB == undefined) {
			block.outB = noOut;
		}
		blocks.push(block);
	}
	console.log(blocks);
	let JSONdata = new Blob([JSON.stringify(blocks)], { type: "text/plain;charset=utf-8" });
	let fileReader = new FileReader();
	fileReader.readAsArrayBuffer(JSONdata);
	fileReader.onload = function () {
		let arrayBuffer = fileReader.result;
		let arr = new Uint8Array(arrayBuffer);
		console.log("arr:", arr);
		let decodedData = new Uint8Array(1000000);
		console.log("puste:", decodedData);
		bytesCopied = jalg(arr, decodedData);
		decodedData = decodedData.slice(0, bytesCopied);
		console.log("alg:", decodedData);
		console.log("bytes copied: ", bytesCopied);
		let decodedBlob = new Blob([decodedData]);
		console.log(decodedBlob);
		saveAs(decodedBlob, algName + ".alg");
	};
}
