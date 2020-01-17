# Dokumentacja jalg

**jalg** - konwertuje pliki z formatu JSON do .alg, wspieranego przez Magiczne Bloczki®

**jalg-web** - wersja jalg przeznaczona do użycia w przeglądarce, kompilowana do WebAssembly

## JSON

Dane wejściowe powinny być w formie tablicy obiektów. Każdy obiekt reprezentuje 1 bloczek.

```javascript
[
	{
		"x": (pozycja x, liczba),
		"y": (pozycja y, liczba),
		"width": (szerokość*, liczba),
		"height": (wysokość*, liczba),
		"type": "(typ bloczka, tekst)",
		"content": "(treść bloczka, tekst)",
		"outA": (wyjście A, liczba),
		"outB": (wyjście B, liczba)
	},
	{
		...
	},
	...
	{
		...
	}
]
```

*\*szerokość i wysokość* 

Dane wejściowe mogą być zminifikowane.
