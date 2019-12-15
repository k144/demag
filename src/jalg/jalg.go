package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Block struct {
	X       uint32 `json: x`
	Y       uint32 `json: y`
	Width   uint32 `json: width`
	Height  uint32 `json: height`
	Type    string `json: type`
	Content string `json: content`
	OutA    uint32 `json: outA`
	OutB    uint32 `json: outB`
}

var Blocks *[]Block
var filename string = "./test.json"
var buf []byte
var fBeginning = []byte{0x3e, 0x67, 0x01, 0x0a}

func main() {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Printf("File error %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &Blocks)

	bTypeMap := map[string]uint32{
		"start":   1,
		"stop":    2,
		"data":    3,
		"if":      4,
		"sum":     5,
		"io":      6,
		"comment": 7,
	}

	i := 0
	for _, b := range *Blocks {
		fmt.Println(i, "bloczek jest typu", b.Type)
		if b.Type == "io" {
			fmt.Printf("Bloczek ten umożliwia wprowadzanie i odczytywanie zmiennych. W pliku .alg typ ten jest zapisywany jako %b\n", bTypeMap["io"])
		}
		fmt.Println("========")
		i++
	}
	fmt.Printf("%x\n", fBeginning)

	fmt.Printf("%x\n", bTypeMap["data"])

}

//TODO: funkcja dodająca padding do bajtów
//TODO: zapisywanie do pliku
