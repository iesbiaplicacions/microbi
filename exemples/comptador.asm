; ============================================
; comptador.asm — Comptador infinit 0..255
; ============================================
; Objectiu: incrementar AC indefinidament i mostrar-
; lo al port 0. Quan AC desbordi (255 → 0), el
; flag Z s'activarà momentàniament.
;
; Resultat esperat: LED 0 va canviant 0,1,2,3...255,0,...
; ============================================

        LDA #0          ; Inicialitza AC = 0

bucle:
        OUT 0           ; Mostra AC al port 0
        ADD #1          ; AC = AC + 1
        JMP bucle       ; Torna a "bucle" (salt incondicional)

; Mai s'arriba aquí (bucle infinit)
        HLT

; --------------------------------------------
; TRAÇA (primers cicles):
;   AC=0   → OUT 0 → LED = 0
;   AC=1   → OUT 0 → LED = 1
;   AC=2   → OUT 0 → LED = 2
;   ...
;   AC=255 → OUT 0 → LED = 255
;   AC=0   → OUT 0 → LED = 0   (desbordament)
;   ...
; --------------------------------------------