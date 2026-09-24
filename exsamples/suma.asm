; ============================================
; suma.asm — Suma bàsica
; ============================================
; Objectiu: sumar dos nombres i mostrar el resultat
; al port de sortida 0.
;
; Resultat esperat: LED 0 s'encén amb valor 8
; ============================================

        LDA #5          ; Carrega el literal 5 a l'acumulador (AC = 5)
        ADD #3          ; Suma 3 a AC                 (AC = 8)
        OUT 0           ; Escriu AC al port 0         (LED = 8)
        HLT             ; Atura la CPU

; --------------------------------------------
; TRAÇA D'EXECUCIÓ:
;   PC=0  FETCH  IR=05  AC=0
;   PC=0  EXEC   IR=05  AC=5
;   PC=1  FETCH  IR=13  AC=5
;   PC=1  EXEC   IR=13  AC=8
;   PC=2  FETCH  IR=80  AC=8
;   PC=2  EXEC   IR=80  AC=8   → LED[0] = 8
;   PC=3  FETCH  IR=F0  AC=8
;   PC=3  EXEC   IR=F0  AC=8   → HALT
; --------------------------------------------