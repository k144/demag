![demag](logo.gif) 

Webowa implementacja oryginalnego języka skryptowego **magscript**, kompilująca go do formatu wspieranego przez **Magiczne Bloczki®**.

Bloczki łączone są automatycznie.

Polskie znaki wykrzaczają się po otwarciu przez Magiczne Bloczki® przez różnicę sposobów ich kodowania. Poniższe przykłady korzystają z nich dla klarowności, ale raczej ich unikajcie.

---

## Składnia magscript

Znaki białe na początku linii nie mają znaczenia. Na końcu linii **nie** musi znajdować się znak `;`.

### Deklaracja zmiennych

```
	x = 5
	y = 12 + x
	set tablica = (1,2,3)
	set macierz = ((2,3,11),(25,1,12),(2,42,-2))
	z=tablica[2]+macierz[3,2]
```
W powyższym przykładzie wartości poszczególnych zmiennych to:
- `x` → `5`
- `y` → `12 + 5` → `17`
- `tablica` → `[1, 2, 3]`
- `macierz` ↓  
```
 [[2,  3,  11],
  [25, 1,  12],
  [2,  42, -2]]
```
- `z` → `2` + `42` → `44`

Składnia deklaracji zmiennych jest taka sama jak w Magicznych Bloczkach®.

Zamiast `=` można też użyć `:=`, ale `=` jest automatycznie zamieniane na `:=`.

### Operacje arytmetyczne

Prawidłowe są wszystkie operatory obecne w Magicznych Bloczkach®.

Do nowododanych należą:

#### `++`

Dodaje 1 do zmiennej.

```
x = 3
x++
write x
```

Na końcu wartość `x` wynosi `4`.

To tak samo, jak gdybyśmy napisali:

```
x = 3
x = x + 1
write x
```

#### `--`

Jak wyżej, tylko zamiast dodawać, odejmuje 1.

```
x = 20
x--
write x
```
x → 19

#### `+=`, `-=`, `*=` i `/=`

Wykonuję daną operację na podanej zmiennej, np.:

```
x += 10
```
to to samo, co:
```
x = x + 10
```

`x *= 2.5` pomnoży `x` przez 2,5 i przypisze mu tę wartość.

Po każdym z tych operatorów może znaleźć się więcej operacji arytmetycznych, np.:

```
x = 2
x += 20 - (10 / (2*2))
```

*nowe x* →  
*stare x* + 20 - (10 / (2*2)) →  
2 + 20 - (10 / 4) →  
22 - 2.5 →  
**19.5**

### Odczyt i zapis danych

Tak samo jak w Magicznych Bloczkach®.

- `read x` wczyta wpisaną wartość do zmiennej x
- `write x` wypisze x na ekranie

---

od tego momentu zaczyna się zabawa

### Instrukcje warunkowe

Instrukcje `if` i `else` działają podobnie jak w innych językach. `else if` w jednej linii nie istnieje, bo mi się nie chciało tego robić na razie.

```
if x == 3 {
	write 'x wynosi 3'
} else {
	write 'x to coś innego niż 3'
}
```

Operatory logiczne są takie same jak w Magicznych Bloczkach®, czyli:
- `==` - takie samo jak
- `!=` - inne niż
- `<=`, `=<` - mniejsze lub równe
- `>=`. `=>` - większe lub równe
- `<` - mniejsze niż
- `>` - większe niż

### Pętle

Składnia pętli jest podobna do tych znanych z C czy C++.

**for** *inicjalizacja*; *warunek zakończenia*; *zmiana wartości* {  
	*instrukcje*  
}

Przykład:
```
for i = 0; i < 10; i++ {
	write i
}
```
Będzie wypisywać `i`, o początkowej wartości `0`, dodając `1` przy każdej iteracji, dopóki `i` będzie mniejsze od `10`.

Istnieje też druga, krótsza forma zapisu pętli:
```
for j = 1 -> 20 {
	write j
}
```
Iterator `j` przyjmie wartości od `1` do `20`.  
Powyższy przykład jest jednoznaczny z poniższym:
```
for j = 1; j <= 20; j++ {
	write j
}
```

### Instrukcja skoku

Instrukcja skoku oznaczona słowem kluczowym `goto`, wykonuje skok do wskazanej etykiety. Etykietę deklaruje się jej nazwą i `:` na końcu, np.:
```
liczba = 13
write 'zgadnij liczbę'
wczytaj:
read odp
if odp == liczba {
	write 'Gratulacje!'
} else {
	write 'Źle, spróbuj ponownie.'
	goto wczytaj
}
```
Program zakończy się dopiero kiedy użytkownik odgadnie zmienną `liczba`, w przeciwnym wypadku powróci do wczytania zmiennej `odp`.

**Instrukcja `goto` na końcu instrukcji warunkowej może zostawiać zbędne bloczki sumacyjne. Algorytm wykona się poprawnie ale będzie wypadało posprzątać.**

## Jak to działa?

Edytor kodu na stronie ([CodeMirror](https://codemirror.net/)) przy każdej zmianie swojej treści przekazuje ją funkcji `parse()`. Zamienia ona magscript na JSON (JavaScript Object Notation), oraz pośrednio umieszcza reprezentację bloczków na prawej części strony. Przy pobieraniu z tej graficznej reprezentacji odczytywana jest pozycja każdego bloczka i usuwane są zbędne informacje.

Tak przygotowane dane w formacie JSON zostają przekazane programowi **jalg**.
Zamienia on reprezentację bloczków w JSON na format *.alg*, wspierany przez Magiczne Bloczki®.
**Jalg** został napisany w języku programowania [Go](https://pl.wikipedia.org/wiki/Go_(j%C4%99zyk_programowania)), oraz skompilowany do [WebAssembly](https://pl.wikipedia.org/wiki/WebAssembly).

Cały proces odbywa się całkowicie w przeglądarce.

## Po co?

Też sobie zadaję to pytanie.

jak ktoś chce to przejąć to oddam za darmo, zabierzcie to ode mnie

