 10 start
11 jmp 92
15 func mul
40 mov c,1
50 mov d,0
60 add d,a
70 add c,1
80 cmp c,b
90 jle 60
91 ret
92 mov a,5
93 mov b,10
94 call mul
100 prn d
101 mov a,7
102 mov b,2
103 call mul
104 prn d
110 stop
