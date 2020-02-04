const go = new Go();
WebAssembly.instantiateStreaming(fetch("bin/jalg.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

$("#dl-button").click(() => {
    download();
})