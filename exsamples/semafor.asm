; ============================================
; semafor.asm — Simulació d'un semàfor
; ============================================
; Objectiu: encendre seqüencialment els LEDs 0, 1 i 2
; com si fos un semàfor (verd → groc → vermell).
;
; Resultat esperat:
;   LED 0 (verd)    encès
;   LED 1 (groc)    encès
;   LED 2 (vermell) encès
;   i torna a començar
;
; NOTA: com que no tenim temporitzador, la "duració"
; de cada estat depèn de la velocitat del simulador.
; En maquinari real caldria una pausa (bucle de delay).
; ============================================

inici:
        ; --- ESTAT 1: VERD ---
        LDA #0          ; Apaga tots els LEDs
        OUT 0
        OUT 1
        OUT 2
        LDA #1          ; Encén només LED 0
        OUT 0
        ; (aquí aniria un delay)

        ; --- ESTAT 2: GROC ---
        LDA #0
        OUT 0           ; Apaga verd
        LDA #1
        OUT 1           ; Encén groc
        ; (aquí aniria un delay)

        ; --- ESTAT 3: VERMELL ---
        LDA #0
        OUT 1           ; Apaga groc
        LDA #1
        OUT 2           ; Encén vermell
        ; (aquí aniria un delay)

        JMP inici       ; Torna a començar

        HLT
