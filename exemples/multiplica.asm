LDA #0        ; AC = 0  (ací anirem acumulant el resultat)
STA [10]      ; mem[10] = 0   → resultat
LDA #4        ; AC = 4
STA [11]      ; mem[11] = 4   → comptador (quantes vegades sumarem 3)

bucle:
LDA [10]      ; AC = resultat actual
ADD #3        ; AC = AC + 3
STA [10]      ; guardem el nou resultat
LDA [11]      ; AC = comptador
SUB #1        ; AC = comptador - 1
STA [11]      ; guardem el comptador actualitzat
JZ fi         ; si AC = 0 → hem acabat, saltem a OUT
JMP bucle     ; si no, tornem a sumar 3

fi:
LDA [10]      ; AC = resultat final (hauria de ser 12)
OUT 0         ; mostrem el resultat
HLT           ; fi
