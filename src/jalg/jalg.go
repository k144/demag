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

func main() {

	file, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Printf("File error %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &Blocks)
	for _, b := range *Blocks {
		fmt.Println(b)
		fmt.Println("========")
	}

}
