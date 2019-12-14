# Analiza zawartości plików .alg

## Początek pliku

### bajty 1-4

`3e 67 01 0a`

Prawdopodobnie zapisują informację o wersji programu, na której stworzony był plik.

Pierwszy bajt to zawsze `0x3e`.

`0x3e` to `>` w ASCII, jeśli to w ogóle ma jakieś znaczenie.

Następne 3 są zawsze takie same przy tworzeniu nowych plików. Różnią się one od tych w domyślnych przykładach, które zaś również są sobie równe.


### bajty 5-8

np. (hex)
`01 00 00 00`,
`05 00 00 00`,
`0b 00 00 00`,

Pierwszy bajt oznacza ilość bloczków. 3 kolejne to zera.

Prawdopodobnie maksymalna ilość bloczków to 255 (bo `ff`).

## Bloczki

Każdy bloczek zajmuje 288 bajtów
(18 * 2 * 8)

1-24 -
25-280 - zawartość bloczka
281-288 - łączenia bloczka

### zawartość bloczka

Część odpowiedzialna za zawartość bloczka ma rozmiar 256 bajtów.

Jeśli jest cokolwiek, zaczyna się od
bajta oznaczającego ilość znaków, zaczynając od 0 jeśli wliczamy ten bajt, lub od 1 jeśli liczymy od następnego znaku.

Łącznie więc możemy zapisać do 255 znaków w każdym bloczku.
(16 * 2 * 8)

Jeśli nie ma nic, to pierwsze dwa bajty to `0x01 0x20`. Drugi bajt to spacja w ASCII, więc tak jeśli nic nie wprowadzimy do bloczka, to tak naprawdę zawiera on spację.

Pozostałe bajty to zera.


### połączenia bloczka

`03 00 00 00 ff ff ff ff` - b. łączy się z b. nr 03 (4)
`02 00 00 00 03 00 00 00` - b. łączy się z b. nr 02 jeśli tak, a z b. nr 03 jeśli nie

Te bity kończą każdy bloczek.

## Koniec pliku

### ostatnie 4 bajty

`01 00 00 00`

Wszystkie pliki .alg kończą się jak wyżej.
