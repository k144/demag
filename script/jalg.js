const go = new Go();
WebAssembly.instantiateStreaming(fetch("bin/jalg.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

$("#dl-button").click(() => {
    download();
})

function download() {
	// tymczasowe bloczki do testowania
    let tempBS = `[{
		"x": 10,
		"y": 10,
		"width": 0,
		"height": 0,
		"type": "start",
		"content": "",
		"outA": 1,
		"outB": 4294967295
	},
	{
		"x": 10,
		"y": 100,
		"width": 0,
		"height": 0,
		"type": "io",
		"content": "read test",
		"outA": 2,
		"outB": 4294967295
	},
	{
		"x": 10,
		"y": 200,
		"width": 0,
		"height": 0,
		"type": "if",
		"content": "test == dupa",
		"outA": 3,
		"outB": 4
	},
	{
		"x": 10,
		"y": 300,
		"width": 0,
		"height": 0,
		"type": "io",
		"content": "write dupa123",
		"outA": 5,
		"outB": 4294967295
	},
	{
		"x": 100,
		"y": 300,
		"width": 0,
		"height": 0,
		"type": "io",
		"content": "write x",
		"outA": 5,
		"outB": 4294967295
	},
	{
		"x": 50,
		"y": 400,
		"width": 0,
		"height": 0,
		"type": "end",
		"content": "",
		"outA": 4294967295,
		"outB": 4294967295
	}
]`
    let JSONdata = new Blob(
        [tempBS],
        {type: "text/plain;charset=utf-8"}
    );
    let fileReader = new FileReader();

    fileReader.readAsArrayBuffer(JSONdata);

    fileReader.onload = function() {
		let arrayBuffer = fileReader.result;
		let arr = new Uint8Array(arrayBuffer);
		console.log("arr:", arr);
		let decodedData = new Uint8Array(1000);
		console.log("puste:", decodedData);
		decodedData = jalg(arr);
		console.log("alg:", decodedData);
		let decodedBlob = new Blob(
			[decodedData]
		)
		saveAs(decodedBlob, "test.alg");
    }

}