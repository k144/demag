const go = new Go();
WebAssembly.instantiateStreaming(fetch("bin/jalg.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

$("#dl-button").click(() => {
    download();
})

function download() {
    let JSONdata = new Blob(
        [JSON.stringify(Blocks)],
        {type: "text/plain;charset=utf-8"}
    );
    let fileReader = new FileReader();

    fileReader.readAsArrayBuffer(JSONdata);

    fileReader.onload = function() {
		let arrayBuffer = fileReader.result;
		let arr = new Uint8Array(arrayBuffer);
		console.log("arr:", arr);
		let decodedData = new Uint8Array(10000);
		console.log("puste:", decodedData);
		bytesCopied = jalg(arr, decodedData);
		decodedData = decodedData.slice(0, bytesCopied)
		console.log("alg:", decodedData);
		console.log("bytes copied: ", bytesCopied)
		let decodedBlob = new Blob(
			[decodedData]
		)
		console.log(decodedBlob)
		saveAs(decodedBlob, "test.alg");
    }

}