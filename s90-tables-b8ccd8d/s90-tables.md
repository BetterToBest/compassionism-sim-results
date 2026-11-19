# The main rows with the private BU price at the sale: tables

Engine `b8ccd8d`; published rows `r2-m-*-104691f`; paired over seeds 1-500; 95% intervals by paired bootstrap (2000 resamples, generator seed 9001).

## Checks

- Reference, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Reference, 40 years: check 1 passes (1,465,500 values); check 2 passes
- Adverse, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Adverse, 40 years: check 1 passes (1,465,500 values); check 2 passes
- Stress, 20 years: check 1 passes (1,465,500 values); check 2 passes
- Stress, 40 years: check 1 passes (1,465,500 values); check 2 passes
- Check 3 (accounting identities on the at-sale rows, seeds 1-5, 20 years): passes

## Question 1: the swing (mean year-to-year change in BU spent, years 2-12, seeds 1-20, full-coverage row, 20 years)

| Environment | Lagged | At the sale | Ratio | Pooled series: lagged | at the sale |
|---|---|---|---|---|---|
| Reference | 18.33% | 2.27% | 0.124 | 16.32% | 1.57% |
| Adverse | 16.58% | 3.33% | 0.201 | 14.83% | 2.49% |
| Stress | 14.24% | 3.19% | 0.224 | 13.24% | 2.44% |

Decision rule 2 (at the sale below half of lagged in every environment): **holds**.

## Question 2: effects against no programme, and the change at the sale

### full coverage, Reference, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -18.72 (-18.84 to -18.61) | -18.80 (-18.92 to -18.69) | -0.075 (-0.080 to -0.071) | 0 | rounding |
| basket poverty (points) | -32.39 (-32.54 to -32.24) | -32.95 (-33.10 to -32.79) | -0.55 (-0.56 to -0.54) | 0 | rounding |
| too little wealth, yearly average (points) | -18.60 (-18.72 to -18.49) | -18.90 (-19.01 to -18.78) | -0.30 (-0.30 to -0.29) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 208,444 (207,067 to 209,870) | 209,026 (207,655 to 210,439) | 582 (456 to 703) | 0 | rounding |
| programme inflation (points a year) | 0.15 (0.15 to 0.15) | 0.15 (0.15 to 0.15) | -0.000 (-0.000 to 0.000) | 0.76 | no |
| FGT2, poverty severity (secondary) | -9.28 (-9.34 to -9.23) | -9.35 (-9.40 to -9.30) | -0.069 (-0.070 to -0.068) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | -752 (-794 to -708) | -807 (-850 to -764) | -55 (-57 to -54) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 49,644 (49,362 to 49,922) | 49,735 (49,460 to 50,021) | 91 (59 to 126) | 1.3e-07 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 16,685 (16,672 to 16,698) | 16,659 (16,646 to 16,672) | -26 (-28 to -24) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 7,637 (7,629 to 7,645) | 7,673 (7,664 to 7,681) | 35 (34 to 37) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 80,493 (80,403 to 80,587) | 80,714 (80,624 to 80,807) | 221 (217 to 225) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -32.37 (-32.59 to -32.17) | -32.38 (-32.59 to -32.17) | -0.003 (-0.009 to 0.002) | 0.24 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -22.95 (-23.10 to -22.81) | -22.98 (-23.12 to -22.84) | -0.025 (-0.035 to -0.014) | 5.4e-06 (unadjusted) | – |

### full coverage, Reference, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -18.90 (-19.03 to -18.79) | -18.94 (-19.07 to -18.83) | -0.038 (-0.040 to -0.036) | 0 | rounding |
| basket poverty (points) | -30.73 (-30.87 to -30.60) | -31.01 (-31.14 to -30.88) | -0.28 (-0.28 to -0.27) | 0 | rounding |
| too little wealth, yearly average (points) | -20.05 (-20.17 to -19.94) | -20.20 (-20.32 to -20.08) | -0.15 (-0.15 to -0.14) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 442,654 (440,252 to 445,205) | 443,135 (440,722 to 445,705) | 481 (345 to 619) | 2.3e-11 | rounding |
| programme inflation (points a year) | 0.062 (0.062 to 0.063) | 0.062 (0.062 to 0.063) | -0.000 (-0.000 to 0.000) | 0.38 | no |
| FGT2, poverty severity (secondary) | -8.68 (-8.72 to -8.64) | -8.71 (-8.76 to -8.67) | -0.034 (-0.035 to -0.034) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 2,723 (2,673 to 2,772) | 2,696 (2,645 to 2,745) | -27 (-28 to -26) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 59,495 (59,167 to 59,841) | 59,479 (59,147 to 59,830) | -16 (-35 to 1) | 0.073 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 16,465 (16,452 to 16,478) | 16,452 (16,439 to 16,465) | -13 (-14 to -12) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 7,837 (7,829 to 7,845) | 7,854 (7,846 to 7,862) | 17 (16 to 18) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 84,175 (84,080 to 84,270) | 84,283 (84,188 to 84,378) | 107 (105 to 110) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -27.20 (-27.39 to -27.03) | -27.20 (-27.39 to -27.03) | 0.002 (-0.001 to 0.005) | 0.27 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -20.35 (-20.50 to -20.21) | -20.35 (-20.50 to -20.21) | -0.000 (-0.002 to 0.002) | 0.95 (unadjusted) | – |

### full coverage, Adverse, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -19.83 (-19.95 to -19.72) | -19.91 (-20.03 to -19.79) | -0.077 (-0.081 to -0.072) | 0 | rounding |
| basket poverty (points) | -40.63 (-40.81 to -40.46) | -41.21 (-41.40 to -41.03) | -0.58 (-0.59 to -0.57) | 0 | rounding |
| too little wealth, yearly average (points) | -19.63 (-19.76 to -19.51) | -19.96 (-20.08 to -19.84) | -0.33 (-0.33 to -0.32) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 197,418 (196,213 to 198,651) | 198,559 (197,334 to 199,805) | 1,141 (1,023 to 1,264) | 0 | rounding |
| programme inflation (points a year) | 0.18 (0.18 to 0.18) | 0.18 (0.18 to 0.18) | 0.000 (0.000 to 0.000) | 0 | no |
| FGT2, poverty severity (secondary) | -11.52 (-11.58 to -11.46) | -11.59 (-11.65 to -11.53) | -0.070 (-0.071 to -0.069) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | -582 (-643 to -519) | -644 (-706 to -581) | -63 (-64 to -61) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 45,117 (44,834 to 45,399) | 45,455 (45,172 to 45,739) | 338 (315 to 360) | 0 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 16,845 (16,832 to 16,858) | 16,736 (16,722 to 16,749) | -109 (-111 to -107) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 7,573 (7,564 to 7,581) | 7,691 (7,682 to 7,700) | 119 (117 to 121) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 79,396 (79,307 to 79,489) | 79,890 (79,800 to 79,983) | 494 (490 to 498) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -48.36 (-48.64 to -48.08) | -48.38 (-48.66 to -48.10) | -0.020 (-0.027 to -0.014) | 7.8e-09 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -26.06 (-26.22 to -25.90) | -26.11 (-26.27 to -25.95) | -0.049 (-0.060 to -0.038) | 0 (unadjusted) | – |

### full coverage, Adverse, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -22.96 (-23.08 to -22.84) | -23.00 (-23.12 to -22.88) | -0.040 (-0.042 to -0.037) | 0 | rounding |
| basket poverty (points) | -46.10 (-46.27 to -45.93) | -46.40 (-46.57 to -46.23) | -0.30 (-0.30 to -0.29) | 0 | rounding |
| too little wealth, yearly average (points) | -23.79 (-23.92 to -23.66) | -23.96 (-24.09 to -23.83) | -0.17 (-0.17 to -0.17) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 388,827 (386,693 to 391,220) | 390,352 (388,223 to 392,741) | 1,525 (1,415 to 1,636) | 0 | rounding |
| programme inflation (points a year) | 0.090 (0.089 to 0.091) | 0.090 (0.089 to 0.091) | 0.000 (0.000 to 0.000) | 0 | no |
| FGT2, poverty severity (secondary) | -12.88 (-12.94 to -12.82) | -12.92 (-12.98 to -12.86) | -0.035 (-0.035 to -0.035) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 1,146 (1,094 to 1,199) | 1,111 (1,059 to 1,165) | -35 (-36 to -34) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 48,109 (47,839 to 48,371) | 48,419 (48,143 to 48,680) | 310 (298 to 320) | 0 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 16,641 (16,628 to 16,654) | 16,552 (16,539 to 16,565) | -90 (-90 to -89) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 7,835 (7,826 to 7,844) | 7,929 (7,920 to 7,939) | 94 (93 to 95) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 83,322 (83,227 to 83,416) | 83,696 (83,602 to 83,792) | 375 (372 to 377) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -55.29 (-55.58 to -55.02) | -55.31 (-55.60 to -55.04) | -0.017 (-0.024 to -0.011) | 7.2e-08 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -29.83 (-29.99 to -29.67) | -29.85 (-30.01 to -29.69) | -0.023 (-0.030 to -0.017) | 4.5e-11 (unadjusted) | – |

### full coverage, Stress, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -19.83 (-19.95 to -19.72) | -19.91 (-20.03 to -19.79) | -0.076 (-0.081 to -0.072) | 0 | rounding |
| basket poverty (points) | -40.13 (-40.30 to -39.95) | -40.72 (-40.90 to -40.54) | -0.59 (-0.60 to -0.58) | 0 | rounding |
| too little wealth, yearly average (points) | -19.06 (-19.19 to -18.94) | -19.44 (-19.58 to -19.32) | -0.38 (-0.39 to -0.37) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 169,491 (168,304 to 170,690) | 170,351 (169,163 to 171,561) | 860 (757 to 973) | 0 | rounding |
| programme inflation (points a year) | 0.18 (0.18 to 0.18) | 0.18 (0.18 to 0.18) | 0.000 (0.000 to 0.000) | 0 | no |
| FGT2, poverty severity (secondary) | -11.51 (-11.57 to -11.45) | -11.58 (-11.65 to -11.52) | -0.076 (-0.077 to -0.075) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | -1,742 (-1,804 to -1,678) | -1,805 (-1,868 to -1,742) | -64 (-66 to -62) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 32,697 (32,433 to 32,940) | 32,970 (32,705 to 33,213) | 273 (249 to 297) | 0 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 17,933 (17,920 to 17,947) | 17,836 (17,823 to 17,850) | -97 (-99 to -95) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 6,483 (6,474 to 6,491) | 6,590 (6,581 to 6,599) | 107 (105 to 109) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 68,178 (68,096 to 68,253) | 68,600 (68,518 to 68,677) | 422 (419 to 425) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -47.47 (-47.76 to -47.19) | -47.52 (-47.81 to -47.24) | -0.052 (-0.065 to -0.040) | 1.8e-15 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -25.46 (-25.63 to -25.31) | -25.54 (-25.70 to -25.38) | -0.073 (-0.089 to -0.058) | 0 (unadjusted) | – |

### full coverage, Stress, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -22.95 (-23.07 to -22.83) | -22.99 (-23.11 to -22.87) | -0.040 (-0.043 to -0.038) | 0 | rounding |
| basket poverty (points) | -45.37 (-45.55 to -45.20) | -45.69 (-45.86 to -45.52) | -0.32 (-0.32 to -0.31) | 0 | rounding |
| too little wealth, yearly average (points) | -23.25 (-23.38 to -23.12) | -23.45 (-23.58 to -23.33) | -0.20 (-0.21 to -0.20) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 330,711 (328,594 to 332,886) | 331,971 (329,875 to 334,196) | 1,260 (1,162 to 1,354) | 0 | rounding |
| programme inflation (points a year) | 0.089 (0.089 to 0.090) | 0.089 (0.089 to 0.090) | 0.000 (0.000 to 0.000) | 0 | no |
| FGT2, poverty severity (secondary) | -12.87 (-12.93 to -12.81) | -12.91 (-12.97 to -12.85) | -0.038 (-0.039 to -0.038) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | -777 (-828 to -725) | -812 (-862 to -759) | -35 (-36 to -34) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 34,095 (33,864 to 34,316) | 34,351 (34,118 to 34,574) | 256 (245 to 268) | 0 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 17,735 (17,722 to 17,749) | 17,652 (17,639 to 17,666) | -83 (-84 to -82) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 6,738 (6,729 to 6,747) | 6,826 (6,817 to 6,835) | 88 (87 to 89) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 70,946 (70,860 to 71,027) | 71,265 (71,178 to 71,346) | 319 (317 to 320) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -54.22 (-54.50 to -53.95) | -54.26 (-54.55 to -53.99) | -0.040 (-0.050 to -0.031) | 1.8e-14 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -29.31 (-29.47 to -29.15) | -29.33 (-29.50 to -29.17) | -0.022 (-0.030 to -0.015) | 3.2e-08 (unadjusted) | – |

### opt-in, Reference, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -12.32 (-12.43 to -12.21) | -12.51 (-12.62 to -12.40) | -0.19 (-0.20 to -0.18) | 0 | rounding |
| basket poverty (points) | -20.92 (-21.04 to -20.78) | -21.18 (-21.31 to -21.04) | -0.26 (-0.27 to -0.25) | 0 | rounding |
| too little wealth, yearly average (points) | -10.90 (-11.00 to -10.80) | -11.15 (-11.25 to -11.04) | -0.25 (-0.26 to -0.24) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 99,425 (98,300 to 100,639) | 99,925 (98,783 to 101,144) | 500 (422 to 581) | 0 | rounding |
| programme inflation (points a year) | 0.12 (0.12 to 0.12) | 0.12 (0.12 to 0.12) | 0.000 (-0.000 to 0.000) | 0.58 | no |
| FGT2, poverty severity (secondary) | -7.61 (-7.65 to -7.56) | -7.68 (-7.72 to -7.63) | -0.070 (-0.072 to -0.069) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | -279 (-316 to -243) | -329 (-367 to -292) | -50 (-52 to -48) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 10,327 (10,124 to 10,548) | 10,336 (10,135 to 10,557) | 9 (-6 to 24) | 0.22 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 12,137 (12,111 to 12,163) | 12,141 (12,115 to 12,167) | 4 (4 to 5) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 708 (703 to 712) | 699 (694 to 703) | -9 (-9 to -9) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 38,093 (38,005 to 38,179) | 38,299 (38,211 to 38,385) | 206 (205 to 208) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -20.87 (-21.05 to -20.68) | -20.87 (-21.06 to -20.68) | -0.007 (-0.019 to 0.004) | 0.21 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -14.63 (-14.79 to -14.49) | -14.73 (-14.88 to -14.59) | -0.099 (-0.12 to -0.079) | 0 (unadjusted) | – |

### opt-in, Reference, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -13.53 (-13.64 to -13.43) | -13.64 (-13.74 to -13.53) | -0.10 (-0.11 to -0.097) | 0 | rounding |
| basket poverty (points) | -19.98 (-20.09 to -19.87) | -20.11 (-20.22 to -20.00) | -0.13 (-0.14 to -0.13) | 0 | rounding |
| too little wealth, yearly average (points) | -12.90 (-13.01 to -12.80) | -13.05 (-13.16 to -12.95) | -0.15 (-0.16 to -0.15) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 212,147 (209,974 to 214,420) | 212,752 (210,550 to 215,051) | 605 (521 to 696) | 0 | rounding |
| programme inflation (points a year) | 0.050 (0.049 to 0.050) | 0.050 (0.049 to 0.050) | 0.000 (-0.000 to 0.000) | 0.36 | no |
| FGT2, poverty severity (secondary) | -7.24 (-7.28 to -7.20) | -7.28 (-7.32 to -7.24) | -0.035 (-0.036 to -0.035) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 3,043 (3,001 to 3,087) | 3,021 (2,978 to 3,065) | -22 (-23 to -21) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 18,308 (18,044 to 18,579) | 18,317 (18,053 to 18,583) | 9 (-4 to 23) | 0.2 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 12,146 (12,120 to 12,171) | 12,148 (12,122 to 12,174) | 2 (2 to 3) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 727 (722 to 731) | 722 (717 to 726) | -5 (-5 to -5) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 39,420 (39,328 to 39,509) | 39,523 (39,430 to 39,612) | 103 (102 to 104) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -18.03 (-18.20 to -17.86) | -18.03 (-18.20 to -17.86) | 0.001 (-0.008 to 0.009) | 0.86 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -14.80 (-14.94 to -14.67) | -14.83 (-14.97 to -14.69) | -0.028 (-0.039 to -0.016) | 4.2e-06 (unadjusted) | – |

### opt-in, Adverse, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -10.60 (-10.71 to -10.50) | -10.82 (-10.93 to -10.72) | -0.22 (-0.23 to -0.21) | 0 | rounding |
| basket poverty (points) | -18.92 (-19.05 to -18.77) | -19.10 (-19.24 to -18.96) | -0.18 (-0.19 to -0.17) | 0 | rounding |
| too little wealth, yearly average (points) | -9.58 (-9.70 to -9.47) | -9.79 (-9.91 to -9.68) | -0.21 (-0.22 to -0.20) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 72,011 (70,948 to 73,097) | 72,497 (71,412 to 73,563) | 487 (404 to 567) | 0 | rounding |
| programme inflation (points a year) | 0.079 (0.077 to 0.080) | 0.079 (0.077 to 0.080) | -0.000 (-0.000 to -0.000) | 4e-09 | no |
| FGT2, poverty severity (secondary) | -7.94 (-8.00 to -7.90) | -8.00 (-8.06 to -7.96) | -0.060 (-0.061 to -0.059) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 371 (313 to 427) | 336 (277 to 393) | -35 (-38 to -32) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 3,204 (3,025 to 3,375) | 3,209 (3,030 to 3,380) | 6 (-2 to 13) | 0.16 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 9,020 (8,995 to 9,045) | 9,017 (8,993 to 9,042) | -2 (-3 to -2) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 178 (176 to 179) | 176 (175 to 178) | -2 (-2 to -1) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 26,994 (26,918 to 27,067) | 27,178 (27,102 to 27,253) | 185 (184 to 186) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -16.77 (-16.99 to -16.53) | -16.73 (-16.96 to -16.49) | 0.037 (0.022 to 0.052) | 1.4e-06 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -12.15 (-12.30 to -12.00) | -12.22 (-12.37 to -12.07) | -0.068 (-0.087 to -0.049) | 2.7e-12 (unadjusted) | – |

### opt-in, Adverse, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -11.18 (-11.29 to -11.08) | -11.31 (-11.42 to -11.20) | -0.13 (-0.13 to -0.12) | 0 | rounding |
| basket poverty (points) | -16.67 (-16.78 to -16.55) | -16.75 (-16.86 to -16.63) | -0.079 (-0.084 to -0.074) | 0 | rounding |
| too little wealth, yearly average (points) | -10.71 (-10.82 to -10.59) | -10.83 (-10.95 to -10.72) | -0.12 (-0.13 to -0.12) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 113,325 (111,496 to 115,019) | 113,561 (111,744 to 115,254) | 236 (177 to 293) | 1.6e-14 | rounding |
| programme inflation (points a year) | 0.011 (0.010 to 0.011) | 0.011 (0.010 to 0.011) | -0.000 (-0.000 to -0.000) | 0.00058 | no |
| FGT2, poverty severity (secondary) | -7.69 (-7.74 to -7.65) | -7.72 (-7.76 to -7.68) | -0.028 (-0.028 to -0.027) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 2,292 (2,250 to 2,334) | 2,279 (2,237 to 2,321) | -13 (-14 to -11) | 0 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 4,257 (4,135 to 4,380) | 4,264 (4,141 to 4,387) | 7 (2 to 13) | 0.019 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 6,648 (6,627 to 6,669) | 6,647 (6,626 to 6,668) | -1 (-1 to -1) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 89 (88 to 90) | 88 (87 to 89) | -1 (-1 to -1) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 20,689 (20,626 to 20,753) | 20,765 (20,701 to 20,829) | 76 (75 to 76) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -12.81 (-13.02 to -12.59) | -12.80 (-13.01 to -12.58) | 0.013 (0.000 to 0.025) | 0.047 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -11.52 (-11.67 to -11.37) | -11.55 (-11.70 to -11.39) | -0.030 (-0.045 to -0.016) | 3.2e-05 (unadjusted) | – |

### opt-in, Stress, 20 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -4.26 (-4.33 to -4.18) | -4.38 (-4.46 to -4.31) | -0.13 (-0.13 to -0.12) | 0 | rounding |
| basket poverty (points) | -7.67 (-7.76 to -7.57) | -7.77 (-7.86 to -7.67) | -0.094 (-0.100 to -0.088) | 0 | rounding |
| too little wealth, yearly average (points) | -3.88 (-3.96 to -3.81) | -3.99 (-4.07 to -3.92) | -0.11 (-0.12 to -0.11) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 28,820 (28,023 to 29,709) | 29,048 (28,244 to 29,936) | 229 (185 to 276) | 0 | rounding |
| programme inflation (points a year) | 0.016 (0.014 to 0.017) | 0.015 (0.014 to 0.016) | -0.000 (-0.000 to -0.000) | 0 | no |
| FGT2, poverty severity (secondary) | -3.72 (-3.76 to -3.69) | -3.76 (-3.79 to -3.72) | -0.032 (-0.033 to -0.031) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 467 (423 to 510) | 456 (411 to 499) | -11 (-14 to -8) | 3.3e-13 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 1,109 (1,004 to 1,215) | 1,117 (1,012 to 1,220) | 8 (1 to 15) | 0.02 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 3,638 (3,616 to 3,660) | 3,638 (3,615 to 3,660) | -1 (-1 to -1) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 1 (1 to 2) | 1 (1 to 1) | -0 (-0 to -0) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 9,660 (9,601 to 9,717) | 9,768 (9,708 to 9,825) | 108 (107 to 109) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -6.75 (-6.90 to -6.58) | -6.69 (-6.84 to -6.52) | 0.056 (0.041 to 0.071) | 4.2e-12 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -4.96 (-5.07 to -4.85) | -4.99 (-5.10 to -4.88) | -0.030 (-0.043 to -0.017) | 8.2e-06 (unadjusted) | – |

### opt-in, Stress, 40 years

| Outcome | Effect, lagged | Effect, at the sale | Change (at the sale − lagged) | p (Holm) | Sign or rounding changes |
|---|---|---|---|---|---|
| below 30 days of basic living (points) | -4.54 (-4.61 to -4.47) | -4.61 (-4.69 to -4.54) | -0.071 (-0.075 to -0.067) | 0 | rounding |
| basket poverty (points) | -6.75 (-6.82 to -6.67) | -6.78 (-6.85 to -6.71) | -0.037 (-0.040 to -0.033) | 0 | rounding |
| too little wealth, yearly average (points) | -4.35 (-4.42 to -4.27) | -4.41 (-4.48 to -4.33) | -0.062 (-0.066 to -0.059) | 0 | rounding |
| median real wealth, weighted (year-0 $) | 46,353 (45,193 to 47,605) | 46,462 (45,275 to 47,728) | 110 (67 to 163) | 1.9e-05 | rounding |
| programme inflation (points a year) | 0.000 (0.000 to 0.000) | 0.000 (0.000 to 0.000) | -0.000 (-0.000 to 0.000) | 0.68 | no |
| FGT2, poverty severity (secondary) | -3.71 (-3.74 to -3.68) | -3.72 (-3.76 to -3.69) | -0.012 (-0.013 to -0.012) | 0 (unadjusted) | – |
| real wage earnings per adult-year ($) (secondary) | 1,194 (1,167 to 1,221) | 1,191 (1,164 to 1,218) | -3 (-5 to -2) | 0.00011 (unadjusted) | – |
| median real disposable income, last year, weighted ($) (secondary) | 930 (863 to 996) | 932 (865 to 997) | 2 (-1 to 5) | 0.17 (unadjusted) | – |
| BU spent per adult-year ($) (secondary) | 2,660 (2,642 to 2,677) | 2,660 (2,642 to 2,677) | -0 (-0 to -0) | 0 (unadjusted) | – |
| BU issued and not spent per adult-year ($) (secondary) | 1 (1 to 1) | 1 (1 to 1) | -0 (-0 to -0) | 0 (unadjusted) | – |
| programme cost per adult-year ($) (secondary) | 7,771 (7,722 to 7,818) | 7,812 (7,762 to 7,859) | 41 (41 to 41) | 0 (unadjusted) | – |
| basket poverty, last year, weighted (%) (secondary) | -5.02 (-5.15 to -4.89) | -5.01 (-5.14 to -4.89) | 0.009 (0.002 to 0.016) | 0.011 (unadjusted) | – |
| too little wealth, last year, weighted (%) (secondary) | -4.68 (-4.78 to -4.57) | -4.68 (-4.79 to -4.58) | -0.006 (-0.015 to 0.002) | 0.14 (unadjusted) | – |

