# Analiza zawartości plików .alg

## Początek pliku

### Bajty 1-4

`3e 67 01 0a`

Prawdopodobnie zapisują informację o wersji programu, na której stworzony był plik.

Pierwszy bajt to zawsze `0x3e`.

`0x3e` to `>` w ASCII, jeśli to w ogóle ma jakieś znaczenie.

Następne 3 są zawsze takie same przy tworzeniu nowych plików. Różnią się one od tych w domyślnych przykładach, które zaś również są sobie równe.


### Bajty 5-8

np. (hex)

`01 00 00 00`, lub

`05 00 00 00`, lub

`0b 00 00 00` itd

Ilość bloczków liczona od 1.

## Bloczki

Każdy bloczek zajmuje 288 bajtów
(18 * 2 * 8)

- 1-4 - pozycja x (---)
- 5-8 - pozycja y (|||)
- 9-12 - szerokość? (same zera bezpieczne)
- 13-16 - wysokość? (same zera bezpieczne)
- 17-20 - typ bloczka
- 21-276 - treść bloczka
- 277-284 - łączenia bloczka
- 285-288 - koniec bloczka

### Pozycja bloczka

Pozycja bloczka jest zapisywana w pierwszych 8 bajtach, po 4 na każdy wymiar.

### Bajty 9-12 (szerokość?)

Zapisuje jakąś liczbę. Nie wiadomo do czego. Można to bezpiecznie wyzerować, ale program po zapisaniu pliku nadpisuje to wartościami takimi jakie były wcześniej.

Prawdopodobnie szerokość.

### Bajty 13-16 (wysokość?)

Jak wyżej, tylko zwykle jest to `2d 00 00 00`

`0x2d` to `-` w ASCII, liczba 18 w dziesiętnym.

Prawdopodobnie wysokość.

### Typ bloczka

Typ bloczka zapisany jest w 4 bajtach poprzedających treść bloczka.
- 1 - start
- 2 - koniec
- 3 - przetwarzanie danych
- 4 - warunkowy
- 5 - sumacyjny
- 6 - wejścia/wyjścia
- 7 - komentarz

Wszystkie wyższe wartości dają bloczek wyglądający jak ten od przetwarzania danych, ale dziwnie rozciągnięty i zmieniający rozmiar.

0 nie daje nic.

### Treść bloczka

Część odpowiedzialna za treść bloczka ma rozmiar 256 bajtów.

Jeśli jest cokolwiek, zaczyna się od bajta oznaczającego ilość znaków, zaczynając od 0 jeśli wliczamy ten bajt, lub od 1 jeśli liczymy od następnego znaku.

Łącznie więc możemy zapisać do 255 znaków w każdym bloczku.
(16 * 2 * 8)

Jeśli nie ma nic, to pierwsze dwa bajty to `0x01 0x20`. Drugi bajt to spacja w ASCII, więc jeśli nic nie wprowadzimy do bloczka, to tak naprawdę zawiera on spację.

Pozostałe bajty to zera.


### Połączenia bloczka

`03 00 00 00 ff ff ff ff` - b. łączy się z b. nr 03 (4)

`02 00 00 00 03 00 00 00` - b. łączy się z b. nr 02 jeśli tak, a z b. nr 03 jeśli nie


### Koniec bloczka

`01 00 00 00`

Te 4 bajty kończą każdy bloczek

Zmiana `0x01` na inną liczbę nie ma wpływu na działanie programu i wyświetlanie bloczka.
