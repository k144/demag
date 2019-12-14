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

`01 00 00 00`, lub

`05 00 00 00`, lub

`0b 00 00 00` itd

Pierwszy bajt oznacza ilość bloczków. 3 kolejne to zera.

Prawdopodobnie maksymalna ilość bloczków to 255 (bo `ff`).

## Bloczki

Każdy bloczek zajmuje 288 bajtów
(18 * 2 * 8)

- 1-4 - pozycja x (---)
- 5-8 - pozycja y (---)
- 9-12 -
- 13-16 -
- 17-20 -
- 21-276 - zawartość bloczka
- 277-284 - łączenia bloczka
- 285-288 - koniec bloczka

### zawartość bloczka

Część odpowiedzialna za zawartość bloczka ma rozmiar 256 bajtów.

Jeśli jest cokolwiek, zaczyna się od bajta oznaczającego ilość znaków, zaczynając od 0 jeśli wliczamy ten bajt, lub od 1 jeśli liczymy od następnego znaku.

Łącznie więc możemy zapisać do 255 znaków w każdym bloczku.
(16 * 2 * 8)

Jeśli nie ma nic, to pierwsze dwa bajty to `0x01 0x20`. Drugi bajt to spacja w ASCII, więc jeśli nic nie wprowadzimy do bloczka, to tak naprawdę zawiera on spację.

Pozostałe bajty to zera.


### połączenia bloczka

`03 00 00 00 ff ff ff ff` - b. łączy się z b. nr 03 (4)

`02 00 00 00 03 00 00 00` - b. łączy się z b. nr 02 jeśli tak, a z b. nr 03 jeśli nie

Te bity kończą każdy bloczek.

### koniec bloczka

`01 00 00 00`

Te 4 bajty kończą każdy bloczek

Zmiana `0x01` na inną liczbę nie ma wpływu na działanie programu i wyświetlanie bloczka.
