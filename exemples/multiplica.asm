00: LDA #0        ; AC = 0  (aquí anirem acumulant el resultat)
01: STA [10]      ; mem[10] = 0   → resultat

02: LDA #4        ; AC = 4
03: STA [11]      ; mem[11] = 4   → comptador (quantes vegades sumarem 3)

04: LDA [10]      ; AC = resultat actual
05: ADD #3        ; AC = AC + 3
06: STA [10]      ; guardem el nou resultat

07: LDA [11]      ; AC = comptador
08: SUB #1        ; AC = comptador - 1
09: STA [11]      ; guardem el comptador actualitzat

0A: JZ 0D         ; si AC = 0 → hem acabat, saltem a OUT
0B: JMP 04        ; si no, tornem a sumar 3
0C: NOP           ; (farciment, opcional)

0D: LDA [10]      ; AC = resultat final (hauria de ser 12)
0E: OUT 0         ; mostrem el resultat
0F: HLT           ; fi
