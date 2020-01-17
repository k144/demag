// jalg - kompilator plików JSON do formatu .alg
// wspieranego przez Magiczne Bloczki®
// wersja do aplkikacji webowej
//
// Wsparcie WebAssembly w Go jest obecnie (01.2020) eksperymentalne,
// program pomyślnie testowany z Go 1.13.5 linux/amd64
//
// kompilować z:
// GOOS=js GOARCH=wasm go build path/to/jalg.wasm

package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"syscall/js"
)

type Block struct {
	X       uint32 `json:"x"`
	Y       uint32 `json:"y"`
	Width   uint32 `json:"width"`
	Height  uint32 `json:"height"`
	Type    string `json:"type"`
	Content string `json:"content"`
	OutA    uint32 `json:"outA"`
	OutB    uint32 `json:"outB"`
}

// funkcja parse przetwarza dane
// w formacie JSON na format .alg
func parse(input []byte) []byte {

	var Blocks []Block
	err := json.Unmarshal(input, &Blocks)
	fmt.Println(Blocks)

	if err != nil {
		fmt.Println("error:", err)
	}

	fmt.Printf("%+v\n", Blocks)

	var buf []byte

	var fBeginning = [4]byte{0x3e, 0x67, 0x01, 0x0a}
	buf = append(buf, fBeginning[0:]...)

	var nBlocks [4]byte
	binary.LittleEndian.PutUint32(nBlocks[0:], uint32(len(Blocks)))
	buf = append(buf, nBlocks[0:]...)

	// każdy typ bloczka jest oznaczony liczbą
	bTypeMap := map[string]uint32{
		"start":   1,
		"end":     2,
		"data":    3,
		"if":      4,
		"sum":     5,
		"io":      6,
		"comment": 7,
	}

	const blockSize int = 288 // liczba bajtów w bloczku

	for _, b := range Blocks {
		fmt.Println(b)

		bBuf := make([]byte, blockSize)
		bEnd := []byte{0x01, 0x00, 0x00, 0x00}

		bBegMap := map[uint32]int{
			b.X:              0,
			b.Y:              4,
			b.Width:          8,
			b.Height:         12,
			bTypeMap[b.Type]: 16,
		}
		for data, pos := range bBegMap {
			binary.LittleEndian.PutUint32(bBuf[pos:], data)
		}

		if b.Content == "" {
			b.Content = " "
		}
		bBuf[20] = byte(len(b.Content))
		copy(bBuf[21:], b.Content)

		binary.LittleEndian.PutUint32(bBuf[276:], b.OutA)
		binary.LittleEndian.PutUint32(bBuf[280:], b.OutB)

		copy(bBuf[284:], bEnd)

		buf = append(buf, bBuf...)

	}
	fmt.Println(buf, len(buf))

	return buf
}

func main() {
	c := make(chan int, 0)
	// Funkcja handleJSON sprawuję rolę
	// interfejsu między JavaScriptem a Go.
	var handleJSON js.Func
	handleJSON = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		maxBufLen := 1000000 // maksymalna ilość bajtów jaką może przyjąc ten program
		buf := make([]byte, maxBufLen)
		bufLen := js.CopyBytesToGo(buf, args[0])
		var JSONdata []byte
		JSONdata = buf[:bufLen]
		parsed := parse(JSONdata)
		fmt.Println("ppp ", parsed)
		bytesCopied := js.CopyBytesToJS(args[1], parsed)
		return bytesCopied

	})
	js.Global().Set("jalg", handleJSON)
	<-c
}
