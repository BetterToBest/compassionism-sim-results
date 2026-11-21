# Pay by household type and the child and dependent care credit in the yardstick: tables

Engine `e50a3b3`; published at-sale rows `s90-sale-*-b8ccd8d`; paired over seeds 1-500; 95% intervals by paired bootstrap (2000 resamples, generator seed 9001).

## Checks

- Reference, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Reference, 40 years: check 1 passes (1,465,500 values); check 2 passes
- Adverse, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Adverse, 40 years: check 1 passes (1,465,500 values); check 2 passes
- Stress, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Stress, 40 years: check 1 passes (1,465,500 values); check 2 passes

## Question 1: the yardstick (no-programme rows)

### Reference, 20 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 8.78 | 9.11 | 8.79 | 9.12 | 8.71 | 9.15 | 10.90 | 11.32 |
| snEitcSg | 8.62 | 5.10 | 7.50 | 5.10 | 7.50 | 7.51 | 7.51 | 6.30 | 9.29 |
| snEitcSp | 49.77 | 30.46 | 41.16 | 30.51 | 41.26 | 41.28 | 41.51 | 37.99 (gap) | 51.37 |
| snEitcCn | 4.55 | 2.16 | 1.54 | 2.16 | 1.54 | 1.45 | 1.54 | 2.66 | 1.88 |
| snEitcCk | 16.54 | 15.79 | 13.47 | 15.80 | 13.48 | 12.24 | 13.53 | 19.60 (gap) | 16.76 |
| snCtc |  | 6.88 | 6.59 | 7.05 | 6.74 | 6.36 | 7.09 | 8.56 | 8.38 |
| snCtcSp | 45.31 | 29.41 | 39.47 | 29.92 | 40.04 | 40.07 | 41.59 | 36.69 (gap) | 49.79 (gap) |
| snCtcCk | 19.00 | 17.11 | 14.62 | 17.57 | 14.98 | 13.78 | 15.86 | 21.27 | 18.64 |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 18.56 | 18.30 (gap) | 18.36 (gap) | 59.70 (gap) | 0.000 (gap) | 22.70 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 837.32 (gap) | 835.11 (gap) | 836.79 (gap) | 828.60 (gap) | 0.000 (gap) | 835.63 (gap) |
| fgt0PY |  | 36.10 | 36.35 | 36.08 | 36.34 | 35.36 | 36.32 | 36.09 | 36.35 |
| bNAPy |  | 19.62 | 20.32 | 19.61 | 20.31 | 19.70 | 20.29 | 19.62 | 20.31 |
| ppovA |  | 24.60 | 25.14 | 24.59 | 25.13 | 24.57 | 25.11 | 24.60 | 25.13 |
| wtMedE |  | 223,853 | 224,206 | 223,930 | 224,270 | 226,319 | 224,356 | 223,855 | 224,207 |

### Reference, 40 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 7.86 | 8.20 | 7.86 | 8.20 | 7.83 | 8.23 | 9.75 | 10.19 |
| snEitcSg | 8.62 | 4.53 | 6.69 | 4.53 | 6.69 | 6.70 | 6.70 | 5.59 (gap) | 8.28 |
| snEitcSp | 49.77 | 28.38 | 38.62 | 28.44 | 38.70 | 38.75 | 38.95 | 35.34 (gap) | 48.18 |
| snEitcCn | 4.55 | 1.75 | 1.24 | 1.75 | 1.24 | 1.16 | 1.24 | 2.18 | 1.53 (gap) |
| snEitcCk | 16.54 | 14.17 | 12.06 | 14.17 | 12.07 | 10.95 | 12.10 | 17.59 | 15.00 |
| snCtc |  | 6.23 | 6.00 | 6.38 | 6.13 | 5.77 | 6.43 | 7.75 | 7.62 |
| snCtcSp | 45.31 | 27.42 | 37.12 | 27.90 | 37.66 | 37.70 | 39.18 | 34.16 (gap) | 46.82 |
| snCtcCk | 19.00 | 15.37 | 13.11 | 15.77 | 13.43 | 12.31 | 14.16 | 19.11 | 16.71 |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 18.63 | 18.40 | 18.45 | 60.22 (gap) | 0.000 (gap) | 22.80 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 839.43 (gap) | 836.98 (gap) | 838.65 (gap) | 830.55 (gap) | 0.000 (gap) | 837.58 (gap) |
| fgt0PY |  | 32.83 | 33.25 | 32.81 | 33.23 | 32.31 | 33.22 | 32.83 | 33.25 |
| bNAPy |  | 19.40 | 20.23 | 19.38 | 20.22 | 19.48 | 20.21 | 19.40 | 20.23 |
| ppovA |  | 23.26 | 23.95 | 23.24 | 23.94 | 23.23 | 23.93 | 23.26 | 23.95 |
| wtMedE |  | 400,997 | 403,504 | 401,132 | 403,632 | 407,590 | 403,526 | 401,018 | 403,365 |

### Adverse, 20 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 12.10 | 12.40 | 12.12 | 12.41 | 11.91 | 12.45 | 15.01 (gap) | 15.39 (gap) |
| snEitcSg | 8.62 | 7.91 | 11.17 | 7.91 | 11.17 | 11.18 | 11.18 | 9.77 | 13.82 (gap) |
| snEitcSp | 49.77 | 36.39 | 47.00 | 36.44 | 47.06 | 47.10 | 47.28 | 45.32 (gap) | 58.45 (gap) |
| snEitcCn | 4.55 | 3.46 | 2.66 | 3.46 | 2.66 | 2.48 | 2.66 | 4.26 | 3.29 |
| snEitcCk | 16.54 | 21.30 | 18.22 | 21.33 | 18.25 | 16.86 | 18.33 | 26.45 (gap) | 22.67 (gap) |
| snCtc |  | 8.98 | 8.43 | 9.22 | 8.62 | 8.19 | 9.07 | 11.15 | 10.72 |
| snCtcSp | 45.31 | 34.98 | 44.69 | 35.53 | 45.22 | 45.25 | 46.83 | 43.49 | 56.18 (gap) |
| snCtcCk | 19.00 | 22.87 | 19.60 | 23.56 | 20.14 | 18.74 | 21.30 | 28.42 (gap) | 25.02 (gap) |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 18.01 (gap) | 17.68 (gap) | 17.78 (gap) | 57.45 (gap) | 0.000 (gap) | 21.95 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 827.97 (gap) | 827.75 (gap) | 829.94 (gap) | 821.12 (gap) | 0.000 (gap) | 828.22 (gap) |
| fgt0PY |  | 44.63 | 44.52 | 44.61 | 44.50 | 43.45 | 44.46 | 44.62 | 44.50 |
| bNAPy |  | 20.64 | 21.24 | 20.63 | 21.23 | 20.66 | 21.21 | 20.64 | 21.23 |
| ppovA |  | 25.54 | 25.97 | 25.53 | 25.96 | 25.46 | 25.94 | 25.54 | 25.96 |
| wtMedE |  | 202,097 | 203,172 | 202,161 | 203,243 | 205,289 | 203,373 | 202,082 | 203,235 |

### Adverse, 40 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 15.08 | 15.26 | 15.09 | 15.27 | 14.72 | 15.31 | 18.70 (gap) | 18.94 (gap) |
| snEitcSg | 8.62 | 10.61 | 14.42 | 10.61 | 14.42 | 14.43 | 14.43 | 13.10 (gap) | 17.83 (gap) |
| snEitcSp | 49.77 | 40.92 | 50.98 | 40.97 | 51.04 | 51.06 | 51.23 | 50.83 | 63.32 (gap) |
| snEitcCn | 4.55 | 4.55 | 3.65 | 4.55 | 3.65 | 3.34 | 3.65 | 5.63 | 4.53 |
| snEitcCk | 16.54 | 26.25 | 22.47 | 26.29 | 22.50 | 21.06 | 22.59 | 32.59 (gap) | 27.96 (gap) |
| snCtc |  | 10.71 | 9.93 | 10.95 | 10.13 | 9.69 | 10.59 | 13.29 | 12.57 |
| snCtcSp | 45.31 | 39.13 | 48.39 | 39.65 | 48.83 | 48.88 | 50.20 | 48.55 (gap) | 60.57 (gap) |
| snCtcCk | 19.00 | 27.70 | 23.78 | 28.39 | 24.34 | 22.94 | 25.58 | 34.37 (gap) | 30.21 (gap) |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 17.47 (gap) | 17.12 (gap) | 17.26 (gap) | 55.52 (gap) | 0.000 (gap) | 21.24 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 819.28 (gap) | 821.77 (gap) | 824.83 (gap) | 814.94 (gap) | 0.000 (gap) | 821.69 (gap) |
| fgt0PY |  | 48.47 | 48.19 | 48.45 | 48.17 | 47.18 | 48.13 | 48.47 | 48.16 |
| bNAPy |  | 23.43 | 23.96 | 23.42 | 23.95 | 23.28 | 23.92 | 23.43 | 23.95 |
| ppovA |  | 27.04 | 27.46 | 27.03 | 27.45 | 26.83 | 27.43 | 27.04 | 27.45 |
| wtMedE |  | 273,527 | 275,072 | 273,667 | 275,188 | 279,714 | 275,466 | 273,567 | 275,231 |

### Stress, 20 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 12.10 | 12.40 | 12.12 | 12.41 | 11.91 | 12.45 | 15.01 (gap) | 15.39 (gap) |
| snEitcSg | 8.62 | 7.91 | 11.17 | 7.91 | 11.17 | 11.18 | 11.18 | 9.77 | 13.82 (gap) |
| snEitcSp | 49.77 | 36.39 | 47.00 | 36.44 | 47.06 | 47.10 | 47.28 | 45.32 (gap) | 58.45 (gap) |
| snEitcCn | 4.55 | 3.46 | 2.66 | 3.46 | 2.66 | 2.48 | 2.66 | 4.26 | 3.29 |
| snEitcCk | 16.54 | 21.30 | 18.22 | 21.33 | 18.25 | 16.86 | 18.33 | 26.45 (gap) | 22.67 (gap) |
| snCtc |  | 8.98 | 8.43 | 9.22 | 8.62 | 8.19 | 9.07 | 11.15 | 10.72 |
| snCtcSp | 45.31 | 34.98 | 44.69 | 35.53 | 45.22 | 45.25 | 46.83 | 43.49 | 56.18 (gap) |
| snCtcCk | 19.00 | 22.87 | 19.60 | 23.56 | 20.14 | 18.74 | 21.30 | 28.42 (gap) | 25.02 (gap) |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 18.01 (gap) | 17.68 (gap) | 17.78 (gap) | 57.45 (gap) | 0.000 (gap) | 21.95 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 827.97 (gap) | 827.75 (gap) | 829.94 (gap) | 821.12 (gap) | 0.000 (gap) | 828.22 (gap) |
| fgt0PY |  | 44.63 | 44.52 | 44.61 | 44.50 | 43.45 | 44.46 | 44.62 | 44.50 |
| bNAPy |  | 20.64 | 21.24 | 20.63 | 21.23 | 20.66 | 21.21 | 20.64 | 21.23 |
| ppovA |  | 25.54 | 25.97 | 25.53 | 25.96 | 25.46 | 25.94 | 25.54 | 25.96 |
| wtMedE |  | 202,097 | 203,172 | 202,161 | 203,243 | 205,289 | 203,373 | 202,082 | 203,235 |

### Stress, 40 years

| Measure | US | off | eh | cdc | both | pc0 | call | off, full take-up | both, full take-up |
|---|---|---|---|---|---|---|---|---|---|
| snEitc | 11.77 | 15.08 | 15.26 | 15.09 | 15.27 | 14.72 | 15.31 | 18.70 (gap) | 18.94 (gap) |
| snEitcSg | 8.62 | 10.61 | 14.42 | 10.61 | 14.42 | 14.43 | 14.43 | 13.10 (gap) | 17.83 (gap) |
| snEitcSp | 49.77 | 40.92 | 50.98 | 40.97 | 51.04 | 51.06 | 51.23 | 50.83 | 63.32 (gap) |
| snEitcCn | 4.55 | 4.55 | 3.65 | 4.55 | 3.65 | 3.34 | 3.65 | 5.63 | 4.53 |
| snEitcCk | 16.54 | 26.25 | 22.47 | 26.29 | 22.50 | 21.06 | 22.59 | 32.59 (gap) | 27.96 (gap) |
| snCtc |  | 10.71 | 9.93 | 10.95 | 10.13 | 9.69 | 10.59 | 13.29 | 12.57 |
| snCtcSp | 45.31 | 39.13 | 48.39 | 39.65 | 48.83 | 48.88 | 50.20 | 48.55 (gap) | 60.57 (gap) |
| snCtcCk | 19.00 | 27.70 | 23.78 | 28.39 | 24.34 | 22.94 | 25.58 | 34.37 (gap) | 30.21 (gap) |
| snCdcK | 21.37 | 0.000 (gap) | 0.000 (gap) | 17.47 (gap) | 17.12 (gap) | 17.26 (gap) | 55.52 (gap) | 0.000 (gap) | 21.24 |
| snCdcR | 606.00 | 0.000 (gap) | 0.000 (gap) | 819.28 (gap) | 821.77 (gap) | 824.83 (gap) | 814.94 (gap) | 0.000 (gap) | 821.69 (gap) |
| fgt0PY |  | 48.47 | 48.19 | 48.45 | 48.17 | 47.18 | 48.13 | 48.47 | 48.16 |
| bNAPy |  | 23.43 | 23.96 | 23.42 | 23.95 | 23.28 | 23.92 | 23.43 | 23.95 |
| ppovA |  | 27.04 | 27.46 | 27.03 | 27.45 | 26.83 | 27.43 | 27.04 | 27.45 |
| wtMedE |  | 273,527 | 275,072 | 273,667 | 275,188 | 279,714 | 275,466 | 273,567 | 275,231 |

Decision rule 2 (Reference, 20 years, full take-up): overall EITC reach 11.32 against 11.77; 4 of 4 household types within 3 points; sum of the types' gaps 5.15 (both) against 19.04 (off): **holds: both is the recommended yardstick reading**.

## Question 2: the programme's effect under each reading, and its change against today's main row

Effect = programme row minus its no-programme row; change = effect under the reading minus effect under `off`, paired by seed. The bound rows pair with the no-programme row of `both`. Holm across the five primary outcomes within each cell, for the change. ✱ = Holm-adjusted 95% interval excludes zero.

### full coverage, Reference, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -18.80 (-18.92 to -18.69) | -32.95 (-33.10 to -32.79) | -18.90 (-19.01 to -18.78) | 209,026 (207,655 to 210,439) | 0.15 (0.15 to 0.15) |
| pay by household type: effect | -19.34 (-19.47 to -19.23) | -32.81 (-32.97 to -32.65) | -18.88 (-19.01 to -18.76) | 209,580 (208,282 to 210,933) | 0.16 (0.16 to 0.16) |
| pay by household type: change | -0.54 (-0.60 to -0.49) ✱ | 0.14 (0.071 to 0.20) ✱ | 0.013 (-0.041 to 0.070) | 554 (-643 to 1,788) | 0.006 (0.006 to 0.007) ✱ |
| the care credit: effect | -18.79 (-18.91 to -18.68) | -32.93 (-33.08 to -32.77) | -18.89 (-19.01 to -18.78) | 208,986 (207,603 to 210,411) | 0.15 (0.15 to 0.15) |
| the care credit: change | 0.010 (0.009 to 0.011) ✱ | 0.016 (0.014 to 0.018) ✱ | 0.006 (0.004 to 0.008) ✱ | -40 (-72 to -10) ✱ | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -19.34 (-19.46 to -19.22) | -32.80 (-32.96 to -32.64) | -18.88 (-19.00 to -18.76) | 209,567 (208,261 to 210,929) | 0.16 (0.16 to 0.16) |
| both: change | -0.54 (-0.59 to -0.48) ✱ | 0.15 (0.082 to 0.21) ✱ | 0.017 (-0.037 to 0.073) | 541 (-662 to 1,763) | 0.006 (0.006 to 0.006) ✱ |
| both, partners independent: effect | -18.73 (-18.85 to -18.62) | -31.84 (-32.00 to -31.69) | -18.45 (-18.58 to -18.34) | 209,280 (207,952 to 210,629) | 0.15 (0.15 to 0.15) |
| both, partners independent: change | 0.066 (0.016 to 0.12) ✱ | 1.10 (1.03 to 1.17) ✱ | 0.44 (0.39 to 0.49) ✱ | 253 (-851 to 1,346) | 0.002 (0.002 to 0.002) ✱ |
| both, credit for every family: effect | -19.33 (-19.45 to -19.21) | -32.81 (-32.97 to -32.65) | -18.89 (-19.02 to -18.77) | 209,845 (208,536 to 211,213) | 0.16 (0.16 to 0.16) |
| both, credit for every family: change | -0.53 (-0.58 to -0.47) ✱ | 0.14 (0.070 to 0.20) ✱ | 0.006 (-0.048 to 0.062) | 819 (-390 to 2,047) | 0.006 (0.006 to 0.007) ✱ |
| both, credit in the no-programme run only: effect | -19.35 (-19.47 to -19.23) | -32.80 (-32.97 to -32.64) | -18.89 (-19.02 to -18.77) | 209,792 (208,491 to 211,157) | 0.16 (0.16 to 0.17) |
| both, credit in the no-programme run only: change | -0.55 (-0.60 to -0.49) ✱ | 0.14 (0.075 to 0.20) ✱ | 0.004 (-0.050 to 0.060) | 765 (-437 to 1,996) | 0.014 (0.013 to 0.014) ✱ |
| interaction (both − cdc) − (eh − off) | -0.001 (-0.003 to 0.000) | -0.005 (-0.008 to -0.002) ✱ | -0.002 (-0.005 to 0.000) | 27 (-14 to 67) | 0.000 (-0.000 to 0.000) |

### full coverage, Reference, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -18.94 (-19.07 to -18.83) | -31.01 (-31.14 to -30.88) | -20.20 (-20.32 to -20.08) | 443,135 (440,722 to 445,705) | 0.062 (0.062 to 0.063) |
| pay by household type: effect | -19.68 (-19.81 to -19.57) | -31.20 (-31.34 to -31.06) | -20.53 (-20.66 to -20.41) | 440,671 (438,075 to 443,161) | 0.065 (0.065 to 0.066) |
| pay by household type: change | -0.74 (-0.79 to -0.69) ✱ | -0.19 (-0.24 to -0.14) ✱ | -0.33 (-0.39 to -0.28) ✱ | -2,464 (-4,686 to -338) ✱ | 0.003 (0.003 to 0.003) ✱ |
| the care credit: effect | -18.93 (-19.05 to -18.82) | -30.99 (-31.13 to -30.86) | -20.19 (-20.31 to -20.07) | 443,078 (440,649 to 445,655) | 0.062 (0.061 to 0.063) |
| the care credit: change | 0.012 (0.011 to 0.014) ✱ | 0.017 (0.015 to 0.018) ✱ | 0.010 (0.008 to 0.012) ✱ | -57 (-108 to -8) ✱ | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -19.67 (-19.80 to -19.56) | -31.19 (-31.33 to -31.05) | -20.52 (-20.65 to -20.40) | 440,604 (438,028 to 443,084) | 0.065 (0.065 to 0.066) |
| both: change | -0.73 (-0.78 to -0.68) ✱ | -0.18 (-0.23 to -0.13) ✱ | -0.32 (-0.38 to -0.27) ✱ | -2,531 (-4,776 to -420) ✱ | 0.003 (0.003 to 0.003) ✱ |
| both, partners independent: effect | -18.94 (-19.05 to -18.83) | -30.28 (-30.42 to -30.15) | -19.88 (-20.00 to -19.77) | 442,304 (439,764 to 444,842) | 0.063 (0.063 to 0.064) |
| both, partners independent: change | 0.003 (-0.049 to 0.057) | 0.73 (0.68 to 0.78) ✱ | 0.32 (0.27 to 0.37) ✱ | -831 (-2,794 to 1,104) | 0.001 (0.001 to 0.001) ✱ |
| both, credit for every family: effect | -19.66 (-19.79 to -19.55) | -31.19 (-31.33 to -31.06) | -20.53 (-20.66 to -20.41) | 441,413 (438,797 to 443,914) | 0.065 (0.065 to 0.066) |
| both, credit for every family: change | -0.72 (-0.77 to -0.67) ✱ | -0.19 (-0.24 to -0.14) ✱ | -0.33 (-0.39 to -0.28) ✱ | -1,722 (-3,942 to 414) | 0.003 (0.003 to 0.003) ✱ |
| both, credit in the no-programme run only: effect | -19.68 (-19.80 to -19.57) | -31.19 (-31.33 to -31.05) | -20.53 (-20.66 to -20.41) | 441,037 (438,430 to 443,533) | 0.069 (0.068 to 0.069) |
| both, credit in the no-programme run only: change | -0.74 (-0.79 to -0.68) ✱ | -0.18 (-0.23 to -0.13) ✱ | -0.33 (-0.39 to -0.28) ✱ | -2,099 (-4,325 to 31) | 0.007 (0.007 to 0.007) ✱ |
| interaction (both − cdc) − (eh − off) | -0.003 (-0.004 to -0.001) ✱ | -0.005 (-0.006 to -0.003) ✱ | -0.002 (-0.004 to -0.000) ✱ | -10 (-82 to 62) | 0.000 (-0.000 to 0.000) |

### full coverage, Adverse, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -19.91 (-20.03 to -19.79) | -41.21 (-41.40 to -41.03) | -19.96 (-20.08 to -19.84) | 198,559 (197,334 to 199,805) | 0.18 (0.18 to 0.18) |
| pay by household type: effect | -20.35 (-20.48 to -20.23) | -40.61 (-40.81 to -40.43) | -19.85 (-19.98 to -19.73) | 198,786 (197,515 to 200,168) | 0.18 (0.18 to 0.18) |
| pay by household type: change | -0.45 (-0.50 to -0.39) ✱ | 0.60 (0.53 to 0.67) ✱ | 0.11 (0.051 to 0.17) ✱ | 227 (-931 to 1,392) | -0.000 (-0.000 to -0.000) ✱ |
| the care credit: effect | -19.90 (-20.02 to -19.78) | -41.20 (-41.38 to -41.02) | -19.95 (-20.08 to -19.83) | 198,544 (197,327 to 199,797) | 0.18 (0.18 to 0.18) |
| the care credit: change | 0.010 (0.008 to 0.011) ✱ | 0.014 (0.012 to 0.017) ✱ | 0.005 (0.004 to 0.007) ✱ | -15 (-47 to 19) | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -20.34 (-20.47 to -20.22) | -40.60 (-40.80 to -40.42) | -19.85 (-19.98 to -19.73) | 198,758 (197,496 to 200,143) | 0.18 (0.18 to 0.18) |
| both: change | -0.44 (-0.49 to -0.38) ✱ | 0.61 (0.54 to 0.69) ✱ | 0.11 (0.055 to 0.17) ✱ | 199 (-961 to 1,361) | -0.001 (-0.001 to -0.000) ✱ |
| both, partners independent: effect | -19.78 (-19.89 to -19.66) | -39.58 (-39.77 to -39.40) | -19.47 (-19.60 to -19.35) | 198,047 (196,778 to 199,403) | 0.18 (0.18 to 0.18) |
| both, partners independent: change | 0.13 (0.083 to 0.18) ✱ | 1.63 (1.56 to 1.70) ✱ | 0.49 (0.44 to 0.53) ✱ | -513 (-1,432 to 449) | -0.000 (-0.000 to 0.000) |
| both, credit for every family: effect | -20.33 (-20.46 to -20.21) | -40.59 (-40.79 to -40.41) | -19.86 (-19.99 to -19.73) | 198,955 (197,686 to 200,344) | 0.19 (0.19 to 0.19) |
| both, credit for every family: change | -0.42 (-0.48 to -0.37) ✱ | 0.62 (0.55 to 0.69) ✱ | 0.10 (0.046 to 0.16) ✱ | 396 (-766 to 1,568) | 0.004 (0.004 to 0.004) ✱ |
| both, credit in the no-programme run only: effect | -20.35 (-20.48 to -20.23) | -40.61 (-40.81 to -40.43) | -19.85 (-19.99 to -19.74) | 198,934 (197,671 to 200,321) | 0.19 (0.19 to 0.19) |
| both, credit in the no-programme run only: change | -0.44 (-0.50 to -0.39) ✱ | 0.61 (0.54 to 0.68) ✱ | 0.10 (0.046 to 0.16) ✱ | 375 (-786 to 1,535) | 0.005 (0.004 to 0.005) ✱ |
| interaction (both − cdc) − (eh − off) | 0.000 (-0.001 to 0.002) | -0.003 (-0.006 to 0.000) | -0.001 (-0.003 to 0.001) | -14 (-58 to 32) | -0.000 (-0.000 to 0.000) |

### full coverage, Adverse, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -23.00 (-23.12 to -22.88) | -46.40 (-46.57 to -46.23) | -23.96 (-24.09 to -23.83) | 390,352 (388,223 to 392,741) | 0.090 (0.089 to 0.091) |
| pay by household type: effect | -23.43 (-23.56 to -23.31) | -45.78 (-45.96 to -45.62) | -23.99 (-24.13 to -23.86) | 389,940 (387,753 to 392,147) | 0.090 (0.089 to 0.090) |
| pay by household type: change | -0.43 (-0.49 to -0.38) ✱ | 0.62 (0.56 to 0.68) ✱ | -0.033 (-0.091 to 0.025) | -412 (-2,387 to 1,516) | -0.000 (-0.000 to -0.000) ✱ |
| the care credit: effect | -22.99 (-23.11 to -22.87) | -46.38 (-46.55 to -46.21) | -23.95 (-24.08 to -23.83) | 390,278 (388,147 to 392,662) | 0.090 (0.089 to 0.090) |
| the care credit: change | 0.013 (0.011 to 0.014) ✱ | 0.016 (0.014 to 0.018) ✱ | 0.008 (0.007 to 0.010) ✱ | -74 (-134 to -22) ✱ | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -23.42 (-23.55 to -23.30) | -45.77 (-45.95 to -45.60) | -23.98 (-24.12 to -23.86) | 389,882 (387,696 to 392,101) | 0.090 (0.089 to 0.090) |
| both: change | -0.42 (-0.47 to -0.37) ✱ | 0.63 (0.57 to 0.69) ✱ | -0.025 (-0.084 to 0.032) | -470 (-2,458 to 1,445) | -0.000 (-0.000 to -0.000) ✱ |
| both, partners independent: effect | -22.75 (-22.88 to -22.63) | -44.80 (-44.97 to -44.63) | -23.43 (-23.56 to -23.30) | 387,701 (385,466 to 390,076) | 0.090 (0.089 to 0.091) |
| both, partners independent: change | 0.25 (0.20 to 0.30) ✱ | 1.60 (1.54 to 1.65) ✱ | 0.53 (0.48 to 0.58) ✱ | -2,651 (-4,250 to -944) ✱ | 0.000 (-0.000 to 0.000) |
| both, credit for every family: effect | -23.40 (-23.53 to -23.28) | -45.75 (-45.94 to -45.59) | -23.98 (-24.12 to -23.86) | 390,156 (387,981 to 392,391) | 0.092 (0.091 to 0.093) |
| both, credit for every family: change | -0.40 (-0.46 to -0.35) ✱ | 0.64 (0.58 to 0.70) ✱ | -0.025 (-0.084 to 0.032) | -196 (-2,159 to 1,695) | 0.002 (0.002 to 0.002) ✱ |
| both, credit in the no-programme run only: effect | -23.43 (-23.55 to -23.31) | -45.77 (-45.96 to -45.61) | -23.99 (-24.12 to -23.86) | 390,206 (388,016 to 392,422) | 0.092 (0.092 to 0.093) |
| both, credit in the no-programme run only: change | -0.42 (-0.48 to -0.37) ✱ | 0.62 (0.56 to 0.68) ✱ | -0.031 (-0.090 to 0.026) | -146 (-2,136 to 1,754) | 0.002 (0.002 to 0.002) ✱ |
| interaction (both − cdc) − (eh − off) | 0.000 (-0.001 to 0.002) | -0.003 (-0.005 to -0.001) ✱ | -0.000 (-0.002 to 0.001) | 15 (-52 to 88) | 0.000 (-0.000 to 0.000) |

### full coverage, Stress, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -19.91 (-20.03 to -19.79) | -40.72 (-40.90 to -40.54) | -19.44 (-19.58 to -19.32) | 170,351 (169,163 to 171,561) | 0.18 (0.18 to 0.18) |
| pay by household type: effect | -20.35 (-20.48 to -20.23) | -40.08 (-40.28 to -39.90) | -19.30 (-19.43 to -19.18) | 171,043 (169,842 to 172,277) | 0.18 (0.18 to 0.18) |
| pay by household type: change | -0.44 (-0.50 to -0.39) ✱ | 0.63 (0.57 to 0.71) ✱ | 0.15 (0.088 to 0.20) ✱ | 692 (-455 to 1,832) | -0.000 (-0.000 to -0.000) ✱ |
| the care credit: effect | -19.90 (-20.02 to -19.78) | -40.71 (-40.89 to -40.53) | -19.44 (-19.57 to -19.32) | 170,340 (169,140 to 171,554) | 0.18 (0.18 to 0.18) |
| the care credit: change | 0.010 (0.008 to 0.011) ✱ | 0.013 (0.010 to 0.015) ✱ | 0.004 (0.002 to 0.006) ✱ | -11 (-42 to 21) | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -20.34 (-20.47 to -20.22) | -40.08 (-40.27 to -39.90) | -19.29 (-19.42 to -19.17) | 171,019 (169,814 to 172,256) | 0.18 (0.18 to 0.18) |
| both: change | -0.43 (-0.49 to -0.38) ✱ | 0.64 (0.58 to 0.71) ✱ | 0.15 (0.093 to 0.21) ✱ | 669 (-488 to 1,793) | -0.001 (-0.001 to -0.000) ✱ |
| both, partners independent: effect | -19.77 (-19.89 to -19.66) | -39.06 (-39.25 to -38.88) | -18.95 (-19.08 to -18.83) | 170,027 (168,832 to 171,260) | 0.18 (0.18 to 0.18) |
| both, partners independent: change | 0.14 (0.088 to 0.18) ✱ | 1.66 (1.59 to 1.73) ✱ | 0.49 (0.45 to 0.54) ✱ | -324 (-1,228 to 593) | -0.000 (-0.000 to 0.000) |
| both, credit for every family: effect | -20.33 (-20.46 to -20.21) | -40.09 (-40.28 to -39.91) | -19.31 (-19.44 to -19.19) | 171,179 (169,967 to 172,412) | 0.19 (0.19 to 0.19) |
| both, credit for every family: change | -0.42 (-0.47 to -0.37) ✱ | 0.63 (0.57 to 0.71) ✱ | 0.14 (0.078 to 0.19) ✱ | 828 (-333 to 1,960) | 0.004 (0.004 to 0.004) ✱ |
| both, credit in the no-programme run only: effect | -20.35 (-20.48 to -20.23) | -40.09 (-40.28 to -39.91) | -19.30 (-19.44 to -19.18) | 171,138 (169,938 to 172,376) | 0.19 (0.19 to 0.19) |
| both, credit in the no-programme run only: change | -0.44 (-0.49 to -0.39) ✱ | 0.63 (0.56 to 0.70) ✱ | 0.14 (0.080 to 0.20) ✱ | 787 (-372 to 1,923) | 0.005 (0.004 to 0.005) ✱ |
| interaction (both − cdc) − (eh − off) | 0.000 (-0.001 to 0.002) | -0.003 (-0.006 to -0.000) ✱ | 0.000 (-0.002 to 0.003) | -12 (-59 to 32) | 0.000 (0.000 to 0.000) ✱ |

### full coverage, Stress, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -22.99 (-23.11 to -22.87) | -45.69 (-45.86 to -45.52) | -23.45 (-23.58 to -23.33) | 331,971 (329,875 to 334,196) | 0.089 (0.089 to 0.090) |
| pay by household type: effect | -23.41 (-23.54 to -23.29) | -44.99 (-45.17 to -44.83) | -23.41 (-23.54 to -23.28) | 332,467 (330,369 to 334,567) | 0.089 (0.089 to 0.090) |
| pay by household type: change | -0.42 (-0.48 to -0.37) ✱ | 0.70 (0.64 to 0.76) ✱ | 0.047 (-0.013 to 0.11) | 497 (-1,429 to 2,296) | -0.000 (-0.000 to -0.000) ✱ |
| the care credit: effect | -22.98 (-23.10 to -22.86) | -45.67 (-45.85 to -45.50) | -23.45 (-23.58 to -23.32) | 331,918 (329,813 to 334,142) | 0.089 (0.089 to 0.090) |
| the care credit: change | 0.013 (0.011 to 0.014) ✱ | 0.014 (0.012 to 0.015) ✱ | 0.006 (0.004 to 0.008) ✱ | -53 (-116 to 1) | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -23.40 (-23.53 to -23.28) | -44.98 (-45.16 to -44.82) | -23.40 (-23.53 to -23.27) | 332,442 (330,361 to 334,542) | 0.089 (0.089 to 0.090) |
| both: change | -0.41 (-0.46 to -0.36) ✱ | 0.71 (0.65 to 0.77) ✱ | 0.054 (-0.006 to 0.11) | 471 (-1,445 to 2,284) | -0.000 (-0.000 to -0.000) ✱ |
| both, partners independent: effect | -22.73 (-22.85 to -22.61) | -44.01 (-44.18 to -43.85) | -22.87 (-23.00 to -22.74) | 329,907 (327,850 to 332,115) | 0.089 (0.089 to 0.090) |
| both, partners independent: change | 0.26 (0.21 to 0.30) ✱ | 1.68 (1.62 to 1.73) ✱ | 0.58 (0.53 to 0.64) ✱ | -2,064 (-3,575 to -527) ✱ | 0.000 (-0.000 to 0.000) |
| both, credit for every family: effect | -23.38 (-23.51 to -23.26) | -44.99 (-45.17 to -44.82) | -23.41 (-23.54 to -23.28) | 332,646 (330,542 to 334,738) | 0.091 (0.091 to 0.092) |
| both, credit for every family: change | -0.39 (-0.45 to -0.34) ✱ | 0.70 (0.64 to 0.76) ✱ | 0.046 (-0.015 to 0.10) | 675 (-1,250 to 2,502) | 0.002 (0.002 to 0.002) ✱ |
| both, credit in the no-programme run only: effect | -23.41 (-23.53 to -23.29) | -44.99 (-45.17 to -44.83) | -23.41 (-23.54 to -23.28) | 332,656 (330,557 to 334,760) | 0.092 (0.091 to 0.092) |
| both, credit in the no-programme run only: change | -0.42 (-0.47 to -0.36) ✱ | 0.70 (0.64 to 0.76) ✱ | 0.046 (-0.014 to 0.10) | 685 (-1,229 to 2,494) | 0.002 (0.002 to 0.002) ✱ |
| interaction (both − cdc) − (eh − off) | -0.000 (-0.001 to 0.001) | -0.004 (-0.006 to -0.002) ✱ | 0.001 (-0.002 to 0.003) | 27 (-44 to 106) | 0.000 (-0.000 to 0.000) |

### opt-in, Reference, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -12.51 (-12.62 to -12.40) | -21.18 (-21.31 to -21.04) | -11.15 (-11.25 to -11.04) | 99,925 (98,783 to 101,144) | 0.12 (0.12 to 0.12) |
| pay by household type: effect | -12.32 (-12.44 to -12.21) | -20.36 (-20.49 to -20.23) | -10.86 (-10.97 to -10.75) | 99,900 (98,649 to 101,094) | 0.12 (0.12 to 0.12) |
| pay by household type: change | 0.18 (0.13 to 0.24) ✱ | 0.81 (0.75 to 0.88) ✱ | 0.29 (0.23 to 0.35) ✱ | -25 (-1,199 to 1,197) | 0.003 (0.003 to 0.003) ✱ |
| the care credit: effect | -12.51 (-12.62 to -12.40) | -21.18 (-21.31 to -21.04) | -11.15 (-11.25 to -11.04) | 99,926 (98,775 to 101,145) | 0.12 (0.12 to 0.12) |
| the care credit: change | -0.000 (-0.003 to 0.003) | 0.000 (-0.003 to 0.003) | 0.002 (-0.001 to 0.005) | 1 (-33 to 33) | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -12.33 (-12.44 to -12.21) | -20.36 (-20.50 to -20.23) | -10.86 (-10.97 to -10.75) | 99,904 (98,657 to 101,091) | 0.12 (0.12 to 0.12) |
| both: change | 0.18 (0.13 to 0.24) ✱ | 0.81 (0.74 to 0.88) ✱ | 0.29 (0.23 to 0.35) ✱ | -21 (-1,190 to 1,204) | 0.003 (0.003 to 0.003) ✱ |
| both, partners independent: effect | -11.98 (-12.09 to -11.87) | -19.66 (-19.79 to -19.53) | -10.65 (-10.76 to -10.54) | 99,795 (98,562 to 101,034) | 0.12 (0.12 to 0.12) |
| both, partners independent: change | 0.53 (0.47 to 0.58) ✱ | 1.52 (1.45 to 1.59) ✱ | 0.50 (0.45 to 0.55) ✱ | -130 (-1,171 to 957) | -0.001 (-0.001 to -0.001) ✱ |
| both, credit for every family: effect | -12.30 (-12.41 to -12.19) | -20.34 (-20.47 to -20.20) | -10.84 (-10.95 to -10.73) | 99,657 (98,430 to 100,855) | 0.12 (0.12 to 0.12) |
| both, credit for every family: change | 0.21 (0.15 to 0.27) ✱ | 0.84 (0.77 to 0.90) ✱ | 0.31 (0.25 to 0.37) ✱ | -268 (-1,440 to 945) | 0.003 (0.003 to 0.003) ✱ |
| both, credit in the no-programme run only: effect | -12.29 (-12.40 to -12.18) | -20.29 (-20.42 to -20.15) | -10.83 (-10.94 to -10.72) | 99,547 (98,305 to 100,743) | 0.13 (0.13 to 0.13) |
| both, credit in the no-programme run only: change | 0.22 (0.16 to 0.28) ✱ | 0.89 (0.82 to 0.95) ✱ | 0.32 (0.26 to 0.38) ✱ | -378 (-1,555 to 829) | 0.010 (0.010 to 0.011) ✱ |
| interaction (both − cdc) − (eh − off) | -0.001 (-0.004 to 0.003) | -0.000 (-0.004 to 0.003) | -0.002 (-0.006 to 0.001) | 3 (-40 to 47) | 0.000 (0.000 to 0.000) ✱ |

### opt-in, Reference, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -13.64 (-13.74 to -13.53) | -20.11 (-20.22 to -20.00) | -13.05 (-13.16 to -12.95) | 212,752 (210,550 to 215,051) | 0.050 (0.049 to 0.050) |
| pay by household type: effect | -13.52 (-13.64 to -13.41) | -19.53 (-19.65 to -19.42) | -12.75 (-12.86 to -12.64) | 211,479 (209,246 to 213,764) | 0.052 (0.051 to 0.052) |
| pay by household type: change | 0.11 (0.059 to 0.17) ✱ | 0.57 (0.52 to 0.62) ✱ | 0.30 (0.24 to 0.36) ✱ | -1,273 (-3,443 to 752) | 0.002 (0.002 to 0.002) ✱ |
| the care credit: effect | -13.63 (-13.74 to -13.53) | -20.11 (-20.22 to -19.99) | -13.05 (-13.16 to -12.95) | 212,790 (210,610 to 215,119) | 0.050 (0.049 to 0.050) |
| the care credit: change | 0.003 (0.000 to 0.005) | 0.003 (0.001 to 0.005) ✱ | 0.001 (-0.001 to 0.004) | 38 (-26 to 113) | -0.000 (-0.000 to -0.000) ✱ |
| both: effect | -13.52 (-13.63 to -13.41) | -19.53 (-19.65 to -19.41) | -12.75 (-12.86 to -12.64) | 211,485 (209,261 to 213,773) | 0.052 (0.051 to 0.052) |
| both: change | 0.11 (0.061 to 0.17) ✱ | 0.58 (0.52 to 0.63) ✱ | 0.30 (0.24 to 0.36) ✱ | -1,267 (-3,416 to 725) | 0.002 (0.002 to 0.002) ✱ |
| both, partners independent: effect | -13.01 (-13.12 to -12.90) | -18.83 (-18.94 to -18.71) | -12.38 (-12.49 to -12.27) | 212,877 (210,568 to 215,084) | 0.050 (0.049 to 0.050) |
| both, partners independent: change | 0.63 (0.57 to 0.68) ✱ | 1.28 (1.23 to 1.33) ✱ | 0.67 (0.62 to 0.72) ✱ | 125 (-1,791 to 1,926) | 0.000 (0.000 to 0.000) ✱ |
| both, credit for every family: effect | -13.49 (-13.60 to -13.38) | -19.51 (-19.62 to -19.39) | -12.73 (-12.84 to -12.62) | 210,912 (208,657 to 213,202) | 0.051 (0.051 to 0.052) |
| both, credit for every family: change | 0.14 (0.090 to 0.20) ✱ | 0.60 (0.55 to 0.65) ✱ | 0.32 (0.26 to 0.38) ✱ | -1,840 (-3,975 to 198) | 0.002 (0.002 to 0.002) ✱ |
| both, credit in the no-programme run only: effect | -13.48 (-13.59 to -13.37) | -19.47 (-19.58 to -19.35) | -12.71 (-12.82 to -12.60) | 210,395 (208,129 to 212,678) | 0.055 (0.055 to 0.055) |
| both, credit in the no-programme run only: change | 0.15 (0.10 to 0.21) ✱ | 0.64 (0.59 to 0.69) ✱ | 0.34 (0.28 to 0.40) ✱ | -2,357 (-4,494 to -325) ✱ | 0.005 (0.005 to 0.006) ✱ |
| interaction (both − cdc) − (eh − off) | -0.001 (-0.004 to 0.001) | -0.002 (-0.004 to 0.000) | -0.001 (-0.003 to 0.002) | -32 (-127 to 60) | 0.000 (-0.000 to 0.000) |

### opt-in, Adverse, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -10.82 (-10.93 to -10.72) | -19.10 (-19.24 to -18.96) | -9.79 (-9.91 to -9.68) | 72,497 (71,412 to 73,563) | 0.079 (0.077 to 0.080) |
| pay by household type: effect | -10.55 (-10.66 to -10.44) | -18.18 (-18.32 to -18.04) | -9.46 (-9.57 to -9.36) | 72,201 (71,139 to 73,278) | 0.073 (0.072 to 0.074) |
| pay by household type: change | 0.27 (0.21 to 0.33) ✱ | 0.92 (0.85 to 0.99) ✱ | 0.33 (0.27 to 0.40) ✱ | -296 (-1,425 to 805) | -0.006 (-0.006 to -0.005) ✱ |
| the care credit: effect | -10.83 (-10.93 to -10.73) | -19.11 (-19.25 to -18.97) | -9.79 (-9.91 to -9.68) | 72,510 (71,423 to 73,594) | 0.079 (0.077 to 0.080) |
| the care credit: change | -0.006 (-0.008 to -0.003) ✱ | -0.012 (-0.016 to -0.008) ✱ | 0.001 (-0.001 to 0.004) | 13 (-21 to 49) | -0.000 (-0.000 to 0.000) |
| both: effect | -10.55 (-10.66 to -10.44) | -18.19 (-18.33 to -18.05) | -9.46 (-9.57 to -9.36) | 72,197 (71,135 to 73,279) | 0.073 (0.072 to 0.074) |
| both: change | 0.27 (0.21 to 0.33) ✱ | 0.91 (0.84 to 0.97) ✱ | 0.33 (0.27 to 0.40) ✱ | -300 (-1,430 to 796) | -0.006 (-0.006 to -0.005) ✱ |
| both, partners independent: effect | -10.32 (-10.43 to -10.22) | -17.79 (-17.92 to -17.65) | -9.35 (-9.46 to -9.25) | 71,523 (70,448 to 72,613) | 0.076 (0.074 to 0.077) |
| both, partners independent: change | 0.50 (0.44 to 0.55) ✱ | 1.31 (1.23 to 1.38) ✱ | 0.44 (0.38 to 0.50) ✱ | -975 (-1,884 to -74) ✱ | -0.003 (-0.003 to -0.003) ✱ |
| both, credit for every family: effect | -10.55 (-10.65 to -10.44) | -18.18 (-18.32 to -18.04) | -9.45 (-9.55 to -9.35) | 72,071 (71,010 to 73,133) | 0.077 (0.076 to 0.079) |
| both, credit for every family: change | 0.28 (0.22 to 0.34) ✱ | 0.92 (0.85 to 0.99) ✱ | 0.35 (0.28 to 0.41) ✱ | -426 (-1,549 to 668) | -0.001 (-0.002 to -0.001) ✱ |
| both, credit in the no-programme run only: effect | -10.53 (-10.63 to -10.42) | -18.12 (-18.26 to -17.98) | -9.44 (-9.54 to -9.33) | 71,979 (70,914 to 73,039) | 0.077 (0.076 to 0.079) |
| both, credit in the no-programme run only: change | 0.30 (0.24 to 0.36) ✱ | 0.98 (0.91 to 1.05) ✱ | 0.36 (0.29 to 0.42) ✱ | -519 (-1,644 to 590) | -0.001 (-0.002 to -0.001) ✱ |
| interaction (both − cdc) − (eh − off) | 0.003 (0.001 to 0.006) ✱ | -0.000 (-0.005 to 0.004) | -0.001 (-0.004 to 0.002) | -17 (-65 to 29) | -0.000 (-0.000 to -0.000) ✱ |

### opt-in, Adverse, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -11.31 (-11.42 to -11.20) | -16.75 (-16.86 to -16.63) | -10.83 (-10.95 to -10.72) | 113,561 (111,744 to 115,254) | 0.011 (0.010 to 0.011) |
| pay by household type: effect | -10.93 (-11.04 to -10.83) | -15.98 (-16.09 to -15.88) | -10.43 (-10.54 to -10.32) | 113,446 (111,798 to 115,056) | 0.008 (0.007 to 0.009) |
| pay by household type: change | 0.38 (0.32 to 0.44) ✱ | 0.76 (0.71 to 0.82) ✱ | 0.40 (0.34 to 0.47) ✱ | -115 (-1,884 to 1,605) | -0.002 (-0.003 to -0.002) ✱ |
| the care credit: effect | -11.31 (-11.42 to -11.21) | -16.75 (-16.87 to -16.64) | -10.83 (-10.95 to -10.72) | 113,520 (111,687 to 115,198) | 0.011 (0.010 to 0.011) |
| the care credit: change | -0.004 (-0.006 to -0.002) ✱ | -0.007 (-0.009 to -0.004) ✱ | -0.000 (-0.003 to 0.002) | -42 (-112 to 23) | 0.000 (0.000 to 0.000) ✱ |
| both: effect | -10.93 (-11.04 to -10.83) | -15.99 (-16.10 to -15.88) | -10.43 (-10.54 to -10.32) | 113,463 (111,836 to 115,094) | 0.008 (0.007 to 0.009) |
| both: change | 0.38 (0.32 to 0.44) ✱ | 0.76 (0.70 to 0.81) ✱ | 0.40 (0.34 to 0.47) ✱ | -98 (-1,849 to 1,649) | -0.002 (-0.003 to -0.002) ✱ |
| both, partners independent: effect | -10.70 (-10.81 to -10.60) | -15.76 (-15.87 to -15.65) | -10.29 (-10.40 to -10.18) | 111,388 (109,716 to 113,121) | 0.010 (0.009 to 0.011) |
| both, partners independent: change | 0.61 (0.55 to 0.66) ✱ | 0.98 (0.93 to 1.05) ✱ | 0.54 (0.48 to 0.61) ✱ | -2,173 (-3,738 to -653) ✱ | -0.001 (-0.001 to -0.000) ✱ |
| both, credit for every family: effect | -10.92 (-11.03 to -10.82) | -15.97 (-16.08 to -15.86) | -10.41 (-10.53 to -10.31) | 113,293 (111,674 to 114,874) | 0.010 (0.009 to 0.010) |
| both, credit for every family: change | 0.39 (0.32 to 0.45) ✱ | 0.78 (0.72 to 0.83) ✱ | 0.42 (0.35 to 0.49) ✱ | -268 (-2,065 to 1,456) | -0.001 (-0.001 to -0.001) ✱ |
| both, credit in the no-programme run only: effect | -10.90 (-11.01 to -10.80) | -15.93 (-16.04 to -15.82) | -10.40 (-10.51 to -10.29) | 113,063 (111,437 to 114,661) | 0.010 (0.009 to 0.010) |
| both, credit in the no-programme run only: change | 0.41 (0.35 to 0.47) ✱ | 0.82 (0.76 to 0.88) ✱ | 0.44 (0.37 to 0.51) ✱ | -498 (-2,269 to 1,223) | -0.001 (-0.001 to -0.001) ✱ |
| interaction (both − cdc) − (eh − off) | 0.004 (0.001 to 0.006) ✱ | -0.001 (-0.005 to 0.002) | 0.001 (-0.002 to 0.004) | 59 (-28 to 148) | -0.000 (-0.000 to 0.000) |

### opt-in, Stress, 20 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -4.38 (-4.46 to -4.31) | -7.77 (-7.86 to -7.67) | -3.99 (-4.07 to -3.92) | 29,048 (28,244 to 29,936) | 0.015 (0.014 to 0.016) |
| pay by household type: effect | -4.26 (-4.33 to -4.18) | -7.40 (-7.49 to -7.31) | -3.81 (-3.89 to -3.74) | 29,055 (28,240 to 29,846) | 0.011 (0.010 to 0.012) |
| pay by household type: change | 0.12 (0.083 to 0.17) ✱ | 0.36 (0.31 to 0.41) ✱ | 0.18 (0.13 to 0.23) ✱ | 7 (-947 to 952) | -0.004 (-0.004 to -0.004) ✱ |
| the care credit: effect | -4.38 (-4.46 to -4.31) | -7.76 (-7.86 to -7.66) | -3.99 (-4.07 to -3.92) | 29,054 (28,239 to 29,940) | 0.015 (0.014 to 0.017) |
| the care credit: change | 0.001 (-0.002 to 0.003) | 0.002 (-0.002 to 0.005) | -0.001 (-0.003 to 0.002) | 5 (-31 to 44) | 0.000 (0.000 to 0.000) ✱ |
| both: effect | -4.26 (-4.33 to -4.18) | -7.40 (-7.49 to -7.31) | -3.81 (-3.89 to -3.74) | 29,032 (28,226 to 29,826) | 0.011 (0.010 to 0.012) |
| both: change | 0.13 (0.083 to 0.17) ✱ | 0.36 (0.31 to 0.41) ✱ | 0.18 (0.13 to 0.23) ✱ | -16 (-970 to 923) | -0.004 (-0.004 to -0.004) ✱ |
| both, partners independent: effect | -4.17 (-4.24 to -4.09) | -7.27 (-7.36 to -7.17) | -3.79 (-3.87 to -3.72) | 28,381 (27,639 to 29,213) | 0.015 (0.013 to 0.016) |
| both, partners independent: change | 0.22 (0.18 to 0.26) ✱ | 0.50 (0.44 to 0.55) ✱ | 0.20 (0.16 to 0.25) ✱ | -667 (-1,446 to 105) | -0.001 (-0.001 to -0.000) ✱ |
| both, credit for every family: effect | -4.25 (-4.33 to -4.18) | -7.38 (-7.47 to -7.29) | -3.81 (-3.88 to -3.74) | 28,957 (28,159 to 29,756) | 0.014 (0.013 to 0.015) |
| both, credit for every family: change | 0.13 (0.088 to 0.17) ✱ | 0.39 (0.34 to 0.44) ✱ | 0.19 (0.14 to 0.23) ✱ | -92 (-1,046 to 853) | -0.001 (-0.001 to -0.001) ✱ |
| both, credit in the no-programme run only: effect | -4.24 (-4.31 to -4.16) | -7.35 (-7.44 to -7.26) | -3.79 (-3.87 to -3.72) | 28,876 (28,080 to 29,678) | 0.014 (0.013 to 0.015) |
| both, credit in the no-programme run only: change | 0.14 (0.10 to 0.19) ✱ | 0.41 (0.36 to 0.46) ✱ | 0.20 (0.15 to 0.25) ✱ | -172 (-1,125 to 773) | -0.001 (-0.002 to -0.001) ✱ |
| interaction (both − cdc) − (eh − off) | -0.000 (-0.003 to 0.002) | -0.002 (-0.006 to 0.002) | 0.002 (-0.001 to 0.004) | -28 (-78 to 18) | -0.000 (-0.000 to 0.000) |

### opt-in, Stress, 40 years

| Reading | below 30 days of basic living (points) | basket poverty (points) | too little wealth, yearly average (points) | median real wealth, weighted (year-0 $) | programme inflation (points a year) |
|---|---|---|---|---|---|
| today's main row: effect | -4.61 (-4.69 to -4.54) | -6.78 (-6.85 to -6.71) | -4.41 (-4.48 to -4.33) | 46,462 (45,275 to 47,728) | 0.000 (0.000 to 0.000) |
| pay by household type: effect | -4.45 (-4.53 to -4.38) | -6.47 (-6.53 to -6.40) | -4.22 (-4.30 to -4.15) | 45,993 (44,798 to 47,362) | 0.000 (0.000 to 0.000) |
| pay by household type: change | 0.16 (0.12 to 0.20) ✱ | 0.32 (0.28 to 0.35) ✱ | 0.18 (0.14 to 0.23) ✱ | -469 (-1,928 to 1,048) | -0.000 (-0.000 to -0.000) ✱ |
| the care credit: effect | -4.61 (-4.69 to -4.54) | -6.78 (-6.85 to -6.71) | -4.41 (-4.48 to -4.33) | 46,429 (45,248 to 47,677) | 0.000 (0.000 to 0.000) |
| the care credit: change | -0.001 (-0.002 to 0.001) | 0.000 (-0.002 to 0.002) | -0.001 (-0.003 to 0.000) | -34 (-108 to 39) | 0.000 (-0.000 to 0.000) |
| both: effect | -4.45 (-4.52 to -4.38) | -6.47 (-6.54 to -6.40) | -4.22 (-4.30 to -4.15) | 45,984 (44,803 to 47,345) | 0.000 (0.000 to 0.000) |
| both: change | 0.16 (0.12 to 0.20) ✱ | 0.32 (0.28 to 0.35) ✱ | 0.18 (0.14 to 0.23) ✱ | -478 (-1,936 to 1,050) | -0.000 (-0.000 to -0.000) ✱ |
| both, partners independent: effect | -4.37 (-4.44 to -4.30) | -6.42 (-6.48 to -6.35) | -4.20 (-4.28 to -4.13) | 45,063 (43,885 to 46,377) | 0.000 (0.000 to 0.000) |
| both, partners independent: change | 0.24 (0.20 to 0.28) ✱ | 0.37 (0.33 to 0.41) ✱ | 0.21 (0.16 to 0.25) ✱ | -1,399 (-2,616 to -94) | -0.000 (-0.000 to 0.000) |
| both, credit for every family: effect | -4.45 (-4.52 to -4.37) | -6.45 (-6.52 to -6.38) | -4.22 (-4.29 to -4.15) | 45,829 (44,658 to 47,163) | 0.000 (0.000 to 0.000) |
| both, credit for every family: change | 0.17 (0.12 to 0.21) ✱ | 0.33 (0.29 to 0.37) ✱ | 0.19 (0.14 to 0.23) ✱ | -633 (-2,095 to 888) | -0.000 (-0.000 to 0.000) |
| both, credit in the no-programme run only: effect | -4.43 (-4.50 to -4.36) | -6.43 (-6.50 to -6.36) | -4.20 (-4.28 to -4.13) | 45,768 (44,586 to 47,128) | 0.000 (0.000 to 0.000) |
| both, credit in the no-programme run only: change | 0.18 (0.14 to 0.23) ✱ | 0.35 (0.31 to 0.39) ✱ | 0.21 (0.16 to 0.25) ✱ | -694 (-2,151 to 834) | -0.000 (-0.000 to 0.000) |
| interaction (both − cdc) − (eh − off) | 0.001 (-0.001 to 0.004) | -0.002 (-0.005 to 0.001) | 0.001 (-0.001 to 0.003) | 24 (-59 to 110) | 0.000 (-0.000 to 0.000) |

## Secondary outcomes (change against `off`, no adjustment)

- full coverage, Reference, 20 years: both fgt2PY -0.33 (-0.34 to -0.32), Er -52 (-66 to -38), dmYp50E 203 (-60 to 459), cost -20 (-29 to -12), wtF0E -0.31 (-0.43 to -0.20), wtPovE -0.36 (-0.45 to -0.27), snCdcM -1.26 (-1.44 to -1.08), snEitcM -6.02 (-6.76 to -5.29), snCtcM -1.35 (-1.94 to -0.77); bound fgt2PY -0.33 (-0.34 to -0.32), Er -130 (-145 to -116), dmYp50E 257 (-5 to 510), cost 124 (116 to 133), wtF0E -0.32 (-0.44 to -0.21), wtPovE -0.37 (-0.46 to -0.28), snCdcM -26.53 (-27.06 to -25.98), snEitcM -6.14 (-6.87 to -5.40), snCtcM -2.63 (-3.24 to -2.04)
- full coverage, Reference, 40 years: both fgt2PY -0.33 (-0.33 to -0.32), Er -35 (-48 to -23), dmYp50E -155 (-451 to 168), cost -14 (-20 to -7), wtF0E -0.71 (-0.81 to -0.61), wtPovE -0.91 (-1.00 to -0.82), snCdcM -1.01 (-1.19 to -0.84), snEitcM -8.04 (-8.66 to -7.41), snCtcM -2.02 (-2.54 to -1.53); bound fgt2PY -0.33 (-0.33 to -0.32), Er -130 (-143 to -117), dmYp50E -118 (-411 to 208), cost 152 (144 to 160), wtF0E -0.72 (-0.82 to -0.62), wtPovE -0.91 (-1.00 to -0.83), snCdcM -26.75 (-27.26 to -26.21), snEitcM -8.11 (-8.74 to -7.48), snCtcM -2.94 (-3.45 to -2.45)
- full coverage, Adverse, 20 years: both fgt2PY -0.35 (-0.36 to -0.33), Er -17 (-30 to -4), dmYp50E 220 (28 to 414), cost -24 (-32 to -15), wtF0E 0.51 (0.38 to 0.63), wtPovE -0.015 (-0.12 to 0.081), snCdcM -0.86 (-1.05 to -0.67), snEitcM -2.06 (-2.86 to -1.24), snCtcM 1.68 (1.07 to 2.27); bound fgt2PY -0.35 (-0.36 to -0.34), Er -67 (-80 to -54), dmYp50E 265 (75 to 462), cost 92 (83 to 102), wtF0E 0.51 (0.38 to 0.63), wtPovE -0.016 (-0.12 to 0.080), snCdcM -25.41 (-25.93 to -24.88), snEitcM -2.20 (-2.99 to -1.37), snCtcM 0.33 (-0.29 to 0.93)
- full coverage, Adverse, 40 years: both fgt2PY -0.35 (-0.36 to -0.34), Er -14 (-25 to -3), dmYp50E 107 (-71 to 288), cost -19 (-26 to -11), wtF0E 0.64 (0.51 to 0.77), wtPovE -0.22 (-0.32 to -0.12), snCdcM -0.045 (-0.25 to 0.16), snEitcM 2.37 (1.55 to 3.24), snCtcM 5.36 (4.78 to 5.97); bound fgt2PY -0.35 (-0.36 to -0.34), Er -58 (-70 to -47), dmYp50E 157 (-20 to 339), cost 101 (92 to 110), wtF0E 0.63 (0.49 to 0.75), wtPovE -0.22 (-0.33 to -0.12), snCdcM -24.43 (-24.91 to -23.93), snEitcM 2.25 (1.43 to 3.11), snCtcM 4.23 (3.66 to 4.84)
- full coverage, Stress, 20 years: both fgt2PY -0.35 (-0.36 to -0.33), Er -30 (-42 to -18), dmYp50E 83 (-105 to 267), cost -26 (-33 to -18), wtF0E 0.60 (0.47 to 0.72), wtPovE 0.090 (-0.007 to 0.19), snCdcM -0.91 (-1.10 to -0.71), snEitcM -0.93 (-1.74 to -0.090), snCtcM 1.97 (1.38 to 2.58); bound fgt2PY -0.35 (-0.36 to -0.34), Er -78 (-90 to -66), dmYp50E 109 (-78 to 295), cost 72 (64 to 81), wtF0E 0.59 (0.47 to 0.72), wtPovE 0.082 (-0.016 to 0.18), snCdcM -25.41 (-25.93 to -24.88), snEitcM -1.14 (-1.97 to -0.30), snCtcM 0.19 (-0.42 to 0.80)
- full coverage, Stress, 40 years: both fgt2PY -0.35 (-0.36 to -0.34), Er -30 (-41 to -20), dmYp50E 53 (-105 to 225), cost -19 (-27 to -12), wtF0E 0.80 (0.66 to 0.92), wtPovE -0.090 (-0.19 to 0.011), snCdcM -0.21 (-0.41 to 0.000), snEitcM 3.98 (3.16 to 4.84), snCtcM 5.49 (4.92 to 6.09); bound fgt2PY -0.35 (-0.36 to -0.34), Er -72 (-83 to -62), dmYp50E 93 (-66 to 264), cost 81 (72 to 89), wtF0E 0.79 (0.65 to 0.91), wtPovE -0.091 (-0.19 to 0.010), snCdcM -24.43 (-24.91 to -23.93), snEitcM 3.75 (2.94 to 4.60), snCtcM 3.80 (3.23 to 4.39)
- opt-in, Reference, 20 years: both fgt2PY -0.21 (-0.22 to -0.21), Er -10 (-22 to 3), dmYp50E 280 (69 to 502), cost 61 (56 to 66), wtF0E 0.62 (0.49 to 0.75), wtPovE 0.37 (0.27 to 0.48), snCdcM -1.52 (-1.66 to -1.39), snEitcM -2.93 (-3.53 to -2.32), snCtcM -1.71 (-2.18 to -1.27); bound fgt2PY -0.20 (-0.21 to -0.19), Er -84 (-97 to -71), dmYp50E 110 (-101 to 335), cost -34 (-40 to -28), wtF0E 0.70 (0.57 to 0.83), wtPovE 0.42 (0.32 to 0.53), snCdcM -26.53 (-27.06 to -25.98), snEitcM -2.15 (-2.74 to -1.56), snCtcM -3.85 (-4.35 to -3.38)
- opt-in, Reference, 40 years: both fgt2PY -0.23 (-0.24 to -0.22), Er -13 (-24 to -1), dmYp50E -116 (-376 to 146), cost 60 (55 to 65), wtF0E 0.15 (0.041 to 0.25), wtPovE 0.16 (0.067 to 0.26), snCdcM -1.25 (-1.39 to -1.12), snEitcM -2.68 (-3.24 to -2.09), snCtcM -1.07 (-1.50 to -0.64); bound fgt2PY -0.22 (-0.22 to -0.21), Er -104 (-115 to -92), dmYp50E -316 (-574 to -61), cost -47 (-53 to -41), wtF0E 0.20 (0.089 to 0.31), wtPovE 0.20 (0.11 to 0.30), snCdcM -26.75 (-27.26 to -26.21), snEitcM -1.91 (-2.47 to -1.31), snCtcM -2.83 (-3.28 to -2.37)
- opt-in, Adverse, 20 years: both fgt2PY -0.15 (-0.16 to -0.14), Er 41 (32 to 51), dmYp50E 70 (-56 to 197), cost 49 (45 to 52), wtF0E 0.71 (0.55 to 0.86), wtPovE 0.50 (0.38 to 0.62), snCdcM -1.24 (-1.36 to -1.11), snEitcM -2.91 (-3.52 to -2.30), snCtcM -1.29 (-1.74 to -0.84); bound fgt2PY -0.13 (-0.14 to -0.12), Er -3 (-13 to 7), dmYp50E 10 (-117 to 137), cost 2 (-2 to 6), wtF0E 0.78 (0.62 to 0.94), wtPovE 0.53 (0.42 to 0.65), snCdcM -25.41 (-25.93 to -24.88), snEitcM -2.28 (-2.89 to -1.66), snCtcM -4.21 (-4.69 to -3.74)
- opt-in, Adverse, 40 years: both fgt2PY -0.099 (-0.11 to -0.091), Er 51 (43 to 59), dmYp50E -17 (-120 to 88), cost 39 (37 to 42), wtF0E 0.45 (0.28 to 0.61), wtPovE 0.50 (0.37 to 0.63), snCdcM -0.56 (-0.67 to -0.45), snEitcM 0.16 (-0.42 to 0.75), snCtcM 0.66 (0.26 to 1.07); bound fgt2PY -0.083 (-0.091 to -0.075), Er 12 (4 to 20), dmYp50E -75 (-178 to 31), cost 7 (4 to 9), wtF0E 0.50 (0.33 to 0.65), wtPovE 0.55 (0.41 to 0.68), snCdcM -24.43 (-24.91 to -23.93), snEitcM 0.93 (0.34 to 1.52), snCtcM -2.60 (-3.03 to -2.18)
- opt-in, Stress, 20 years: both fgt2PY -0.053 (-0.059 to -0.046), Er 42 (36 to 48), dmYp50E -12 (-95 to 66), cost 18 (17 to 19), wtF0E 0.21 (0.083 to 0.33), wtPovE 0.23 (0.14 to 0.33), snCdcM -0.48 (-0.56 to -0.41), snEitcM -1.44 (-1.90 to -0.99), snCtcM -0.66 (-0.97 to -0.34); bound fgt2PY -0.033 (-0.039 to -0.027), Er 2 (-4 to 8), dmYp50E -59 (-138 to 20), cost 2 (1 to 3), wtF0E 0.24 (0.12 to 0.37), wtPovE 0.26 (0.17 to 0.36), snCdcM -25.41 (-25.93 to -24.88), snEitcM -0.74 (-1.22 to -0.29), snCtcM -4.13 (-4.48 to -3.75)
- opt-in, Stress, 40 years: both fgt2PY -0.030 (-0.036 to -0.025), Er 28 (23 to 33), dmYp50E -2 (-67 to 64), cost 11 (10 to 12), wtF0E 0.20 (0.068 to 0.31), wtPovE 0.12 (0.010 to 0.22), snCdcM -0.23 (-0.31 to -0.17), snEitcM 0.066 (-0.32 to 0.44), snCtcM 0.34 (0.079 to 0.59); bound fgt2PY -0.011 (-0.017 to -0.006), Er 6 (0 to 11), dmYp50E -45 (-110 to 22), cost 1 (1 to 2), wtF0E 0.22 (0.089 to 0.33), wtPovE 0.15 (0.040 to 0.25), snCdcM -24.43 (-24.91 to -23.93), snEitcM 0.81 (0.42 to 1.19), snCtcM -3.48 (-3.79 to -3.18)
