// jalg - kompilator plików JSON do formatu .alg wspieranego przez
// Magiczne Bloczki®

package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/ioutil"
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

var filename string = "./test.json"
var buf []byte
var fBeginning = []byte{0x3e, 0x67, 0x01, 0x0a}

// Ta funkcja będzie prawdopodobnie do usunięcia (bo LittleEndian),
// ale zostawię, aż dojdę do treści bloczka, bo może się przydać
func pad(b []byte, l int) ([]byte, error) {
	if l < len(b) {
		return b, fmt.Errorf("pad: Podana długość %d jest mniejsza niż długość wycinka %d.", l, len(b))
	}
	padding := make([]byte, l-len(b))
	result := append(b, padding...)
	return result, nil
}

func main() {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Printf("Błąd pliku %v\n", err)
		panic(err)
	}
	json.Unmarshal(file, &Blocks)

	// TODO: Zmienić z powrotem na uint32
	bTypeMap := map[string]byte{
		"start":   1,
		"stop":    2,
		"data":    3,
		"if":      4,
		"sum":     5,
		"io":      6,
		"comment": 7,
	}

	fBeginning, err := pad(fBeginning, 2)
	if err != nil {
		fmt.Println(err)
	}

	for _, b := range *Blocks {

		sType, err := pad([]byte{bTypeMap[b.Type]}, 4)
		if err != nil {
			fmt.Println(err)
		}

		fmt.Println(sType)
		bBuf := make([]byte, 16)
		binary.LittleEndian.PutUint32(bBuf[0:], 0x01ef)
		fmt.Println(bBuf)

	}

	fmt.Printf("%x\n", bTypeMap["data"])

	buf = append(fBeginning)
	outf := "wynik.alg"
	ioutil.WriteFile(outf, buf, 0644)

}
