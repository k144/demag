// jalg - kompilator plików JSON do formatu .alg
// wspieranego przez Magiczne Bloczki®

package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"

	"launchpad.net/gnuflag"
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

var Blocks *[]Block

// TODO: --help
func main() {

	destP := gnuflag.String("o", "o.alg", "plik wyjściowy ([o]utput)")
	gnuflag.Parse(true)

	destF := *destP
	sourceF := gnuflag.Arg(0)
	if destF == "o.alg" {
		fmt.Println("zmiana")

		destF = strings.TrimSuffix(sourceF, ".json") + ".alg"
	} else {
		fmt.Println("nie działa?")
		fmt.Println(sourceF)

	}

	fmt.Println("source: ", sourceF)
	fmt.Println("dest: ", destF)

	file, err := ioutil.ReadFile(sourceF)
	if err != nil {
		fmt.Printf("Błąd pliku %v\n", err)
		panic(err)
	}
	json.Unmarshal(file, &Blocks)

	var buf []byte

	var fBeginning = [4]byte{0x3e, 0x67, 0x01, 0x0a}
	buf = append(buf, fBeginning[0:]...)

	var nBlocks [4]byte
	binary.LittleEndian.PutUint32(nBlocks[0:], uint32(len(*Blocks)))
	buf = append(buf, nBlocks[0:]...)

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

	for _, b := range *Blocks {
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

	ioutil.WriteFile(destF, buf, 0644)
}
