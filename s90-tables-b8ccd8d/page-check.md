# The findings page read against the rerun with the private price at the sale

Question 3 of the preregistration: does any statement on the findings page change in sign or in its printed rounding? Figures as `site/round2.js` prints them (effects at 1 decimal, median real wealth in whole dollars, programme inflation at 2 decimals). Mean over seeds 1-500. Command: `python3 dev/tools/s90_page_check.py s90-summary.json <results checkout> page-check.md`.

## 1. Every main-row figure in the v5.9 section

| Design | Environment | Years | Outcome | Printed now | At the sale | Printed figure changes | Sign changes | Outside the printed range across readings |
|---|---|---|---|---|---|---|---|---|
| full coverage | Reference | 20 | below 30 days of basic living | −18.7 | −18.8 | yes | no | no |
| full coverage | Reference | 20 | basket poverty | −32.4 | −32.9 | yes | no | no |
| full coverage | Reference | 20 | too little wealth, yearly average | −18.6 | −18.9 | yes | no | no |
| full coverage | Reference | 20 | median real wealth | +$208,444 | +$209,026 | yes | no | no |
| full coverage | Reference | 20 | programme inflation | 0.15 | 0.15 | no | no | no |
| full coverage | Reference | 40 | below 30 days of basic living | −18.9 | −18.9 | no | no | no |
| full coverage | Reference | 40 | basket poverty | −30.7 | −31.0 | yes | no | no |
| full coverage | Reference | 40 | too little wealth, yearly average | −20.1 | −20.2 | yes | no | no |
| full coverage | Reference | 40 | median real wealth | +$442,654 | +$443,135 | yes | no | no |
| full coverage | Reference | 40 | programme inflation | 0.06 | 0.06 | no | no | no |
| full coverage | Adverse | 20 | below 30 days of basic living | −19.8 | −19.9 | yes | no | no |
| full coverage | Adverse | 20 | basket poverty | −40.6 | −41.2 | yes | no | no |
| full coverage | Adverse | 20 | too little wealth, yearly average | −19.6 | −20.0 | yes | no | no |
| full coverage | Adverse | 20 | median real wealth | +$197,418 | +$198,559 | yes | no | no |
| full coverage | Adverse | 20 | programme inflation | 0.18 | 0.18 | no | no | no |
| full coverage | Adverse | 40 | below 30 days of basic living | −23.0 | −23.0 | no | no | no |
| full coverage | Adverse | 40 | basket poverty | −46.1 | −46.4 | yes | no | no |
| full coverage | Adverse | 40 | too little wealth, yearly average | −23.8 | −24.0 | yes | no | no |
| full coverage | Adverse | 40 | median real wealth | +$388,827 | +$390,352 | yes | no | no |
| full coverage | Adverse | 40 | programme inflation | 0.09 | 0.09 | no | no | no |
| full coverage | Stress | 20 | below 30 days of basic living | −19.8 | −19.9 | yes | no | no |
| full coverage | Stress | 20 | basket poverty | −40.1 | −40.7 | yes | no | no |
| full coverage | Stress | 20 | too little wealth, yearly average | −19.1 | −19.4 | yes | no | no |
| full coverage | Stress | 20 | median real wealth | +$169,491 | +$170,351 | yes | no | no |
| full coverage | Stress | 20 | programme inflation | 0.18 | 0.18 | no | no | no |
| full coverage | Stress | 40 | below 30 days of basic living | −22.9 | −23.0 | yes | no | no |
| full coverage | Stress | 40 | basket poverty | −45.4 | −45.7 | yes | no | no |
| full coverage | Stress | 40 | too little wealth, yearly average | −23.3 | −23.5 | yes | no | no |
| full coverage | Stress | 40 | median real wealth | +$330,711 | +$331,971 | yes | no | no |
| full coverage | Stress | 40 | programme inflation | 0.09 | 0.09 | no | no | no |
| opt-in | Reference | 20 | below 30 days of basic living | −12.3 | −12.5 | yes | no | no |
| opt-in | Reference | 20 | basket poverty | −20.9 | −21.2 | yes | no | no |
| opt-in | Reference | 20 | too little wealth, yearly average | −10.9 | −11.1 | yes | no | no |
| opt-in | Reference | 20 | median real wealth | +$99,425 | +$99,925 | yes | no | no |
| opt-in | Reference | 20 | programme inflation | 0.12 | 0.12 | no | no | no |
| opt-in | Reference | 40 | below 30 days of basic living | −13.5 | −13.6 | yes | no | no |
| opt-in | Reference | 40 | basket poverty | −20.0 | −20.1 | yes | no | no |
| opt-in | Reference | 40 | too little wealth, yearly average | −12.9 | −13.1 | yes | no | no |
| opt-in | Reference | 40 | median real wealth | +$212,147 | +$212,752 | yes | no | no |
| opt-in | Reference | 40 | programme inflation | 0.05 | 0.05 | no | no | no |
| opt-in | Adverse | 20 | below 30 days of basic living | −10.6 | −10.8 | yes | no | no |
| opt-in | Adverse | 20 | basket poverty | −18.9 | −19.1 | yes | no | no |
| opt-in | Adverse | 20 | too little wealth, yearly average | −9.6 | −9.8 | yes | no | no |
| opt-in | Adverse | 20 | median real wealth | +$72,011 | +$72,497 | yes | no | no |
| opt-in | Adverse | 20 | programme inflation | 0.08 | 0.08 | no | no | no |
| opt-in | Adverse | 40 | below 30 days of basic living | −11.2 | −11.3 | yes | no | no |
| opt-in | Adverse | 40 | basket poverty | −16.7 | −16.7 | no | no | no |
| opt-in | Adverse | 40 | too little wealth, yearly average | −10.7 | −10.8 | yes | no | no |
| opt-in | Adverse | 40 | median real wealth | +$113,325 | +$113,561 | yes | no | no |
| opt-in | Adverse | 40 | programme inflation | 0.01 | 0.01 | no | no | no |
| opt-in | Stress | 20 | below 30 days of basic living | −4.3 | −4.4 | yes | no | no |
| opt-in | Stress | 20 | basket poverty | −7.7 | −7.8 | yes | no | no |
| opt-in | Stress | 20 | too little wealth, yearly average | −3.9 | −4.0 | yes | no | no |
| opt-in | Stress | 20 | median real wealth | +$28,820 | +$29,048 | yes | no | no |
| opt-in | Stress | 20 | programme inflation | 0.02 | 0.02 | no | no | no |
| opt-in | Stress | 40 | below 30 days of basic living | −4.5 | −4.6 | yes | no | no |
| opt-in | Stress | 40 | basket poverty | −6.7 | −6.8 | yes | no | no |
| opt-in | Stress | 40 | too little wealth, yearly average | −4.3 | −4.4 | yes | no | no |
| opt-in | Stress | 40 | median real wealth | +$46,353 | +$46,462 | yes | no | no |
| opt-in | Stress | 40 | programme inflation | 0.00 | 0.00 | no | no | no |

60 figures: 45 change as printed, 0 change sign, 0 fall outside the printed range across readings.

## 2. The four cards (full coverage, Reference, 20 years): the programme level

| Outcome | No programme | Programme, printed now | Programme, at the sale |
|---|---|---|---|
| below 30 days of basic living | 19.6% | 0.9% | 0.8% |
| basket poverty | 36.1% | 3.7% | 3.2% |
| too little wealth, yearly average | 24.6% | 6.0% | 5.7% |
| median real wealth | $223,853 | $432,297 | $432,879 |
| programme inflation | 0.00 | 0.15 | 0.15 |

## 3. Inspection: distribution and work measures (not preregistered; seed means, no intervals)

The effect against no programme, lagged and at the sale, for the measures behind the page's "Who gains" and "Unfavourable results" prose.

| Design | Environment | Years | Measure | Lagged | At the sale | Sign changes |
|---|---|---|---|---|---|---|
| full coverage | Reference | 20 | top 1% share of wealth | -4.615 | -4.628 | no |
| full coverage | Reference | 20 | top 10% share of wealth | -9.349 | -9.378 | no |
| full coverage | Reference | 20 | top 1% share of income | -3.180 | -3.184 | no |
| full coverage | Reference | 20 | top 10% share of income | -5.672 | -5.688 | no |
| full coverage | Reference | 20 | Palma ratio of income | -1.039 | -1.042 | no |
| full coverage | Reference | 20 | bottom 50% share of wealth | +6.342 | +6.370 | no |
| full coverage | Reference | 20 | bottom 50% share of income | +5.623 | +5.640 | no |
| full coverage | Reference | 20 | stayed in the lowest wealth fifth | +3.483 | +3.319 | no |
| full coverage | Reference | 20 | stayed in the top wealth fifth | -1.864 | -1.859 | no |
| full coverage | Reference | 20 | lowest fifth to top fifth | +0.047 | +0.045 | no |
| full coverage | Reference | 20 | labour's share of money income | -30.460 | -30.437 | no |
| full coverage | Reference | 20 | families in debt | -21.256 | -21.265 | no |
| full coverage | Reference | 20 | employment | -3.446 | -3.491 | no |
| full coverage | Reference | 20 | hours | +0.102 | +0.102 | no |
| full coverage | Reference | 20 | participation | -3.485 | -3.483 | no |
| opt-in | Reference | 20 | top 1% share of wealth | -2.327 | -2.340 | no |
| opt-in | Reference | 20 | top 10% share of wealth | -4.675 | -4.703 | no |
| opt-in | Reference | 20 | top 1% share of income | -0.872 | -0.872 | no |
| opt-in | Reference | 20 | top 10% share of income | +0.027 | +0.026 | no |
| opt-in | Reference | 20 | Palma ratio of income | +0.070 | +0.069 | no |
| opt-in | Reference | 20 | bottom 50% share of wealth | +2.927 | +2.951 | no |
| opt-in | Reference | 20 | bottom 50% share of income | -0.467 | -0.463 | no |
| opt-in | Reference | 20 | stayed in the lowest wealth fifth | +5.890 | +5.732 | no |
| opt-in | Reference | 20 | stayed in the top wealth fifth | -1.074 | -1.049 | no |
| opt-in | Reference | 20 | lowest fifth to top fifth | +0.016 | +0.014 | no |
| opt-in | Reference | 20 | labour's share of money income | -11.655 | -11.605 | no |
| opt-in | Reference | 20 | families in debt | -14.555 | -14.592 | no |
| opt-in | Reference | 20 | employment | -2.563 | -2.599 | no |
| opt-in | Reference | 20 | hours | -0.025 | -0.026 | no |
| opt-in | Reference | 20 | participation | -2.620 | -2.604 | no |
| full coverage | Reference | 40 | top 1% share of wealth | -5.523 | -5.530 | no |
| full coverage | Reference | 40 | top 10% share of wealth | -10.798 | -10.813 | no |
| full coverage | Reference | 40 | top 1% share of income | -4.629 | -4.628 | no |
| full coverage | Reference | 40 | top 10% share of income | -7.426 | -7.425 | no |
| full coverage | Reference | 40 | Palma ratio of income | -1.584 | -1.584 | no |
| full coverage | Reference | 40 | bottom 50% share of wealth | +7.105 | +7.120 | no |
| full coverage | Reference | 40 | bottom 50% share of income | +6.405 | +6.403 | no |
| full coverage | Reference | 40 | stayed in the lowest wealth fifth | +0.311 | +0.051 | no |
| full coverage | Reference | 40 | stayed in the top wealth fifth | -2.647 | -2.655 | no |
| full coverage | Reference | 40 | lowest fifth to top fifth | +0.127 | +0.122 | no |
| full coverage | Reference | 40 | labour's share of money income | -26.817 | -26.807 | no |
| full coverage | Reference | 40 | families in debt | -18.709 | -18.707 | no |
| full coverage | Reference | 40 | employment | -3.045 | -3.068 | no |
| full coverage | Reference | 40 | hours | +0.115 | +0.115 | no |
| full coverage | Reference | 40 | participation | -3.061 | -3.060 | no |
| opt-in | Reference | 40 | top 1% share of wealth | -2.874 | -2.881 | no |
| opt-in | Reference | 40 | top 10% share of wealth | -5.545 | -5.561 | no |
| opt-in | Reference | 40 | top 1% share of income | -1.991 | -1.991 | no |
| opt-in | Reference | 40 | top 10% share of income | -1.797 | -1.798 | no |
| opt-in | Reference | 40 | Palma ratio of income | -0.330 | -0.331 | no |
| opt-in | Reference | 40 | bottom 50% share of wealth | +3.310 | +3.322 | no |
| opt-in | Reference | 40 | bottom 50% share of income | +0.697 | +0.699 | no |
| opt-in | Reference | 40 | stayed in the lowest wealth fifth | +2.908 | +2.688 | no |
| opt-in | Reference | 40 | stayed in the top wealth fifth | -1.857 | -1.837 | no |
| opt-in | Reference | 40 | lowest fifth to top fifth | +0.065 | +0.061 | no |
| opt-in | Reference | 40 | labour's share of money income | -9.710 | -9.689 | no |
| opt-in | Reference | 40 | families in debt | -13.959 | -13.963 | no |
| opt-in | Reference | 40 | employment | -2.314 | -2.332 | no |
| opt-in | Reference | 40 | hours | -0.015 | -0.016 | no |
| opt-in | Reference | 40 | participation | -2.340 | -2.333 | no |
| full coverage | Adverse | 20 | top 1% share of wealth | -4.590 | -4.613 | no |
| full coverage | Adverse | 20 | top 10% share of wealth | -9.281 | -9.333 | no |
| full coverage | Adverse | 20 | top 1% share of income | -4.760 | -4.784 | no |
| full coverage | Adverse | 20 | top 10% share of income | -6.882 | -6.957 | no |
| full coverage | Adverse | 20 | Palma ratio of income | -1.220 | -1.230 | no |
| full coverage | Adverse | 20 | bottom 50% share of wealth | +6.301 | +6.348 | no |
| full coverage | Adverse | 20 | bottom 50% share of income | +5.622 | +5.690 | no |
| full coverage | Adverse | 20 | stayed in the lowest wealth fifth | +7.248 | +6.982 | no |
| full coverage | Adverse | 20 | stayed in the top wealth fifth | -1.702 | -1.690 | no |
| full coverage | Adverse | 20 | lowest fifth to top fifth | +0.030 | +0.026 | no |
| full coverage | Adverse | 20 | labour's share of money income | -32.124 | -32.216 | no |
| full coverage | Adverse | 20 | families in debt | -25.235 | -25.261 | no |
| full coverage | Adverse | 20 | employment | -4.213 | -4.257 | no |
| full coverage | Adverse | 20 | hours | +0.102 | +0.104 | no |
| full coverage | Adverse | 20 | participation | -4.296 | -4.294 | no |
| opt-in | Adverse | 20 | top 1% share of wealth | -1.709 | -1.719 | no |
| opt-in | Adverse | 20 | top 10% share of wealth | -3.447 | -3.466 | no |
| opt-in | Adverse | 20 | top 1% share of income | -0.631 | -0.634 | no |
| opt-in | Adverse | 20 | top 10% share of income | +0.409 | +0.403 | no |
| opt-in | Adverse | 20 | Palma ratio of income | +0.231 | +0.228 | no |
| opt-in | Adverse | 20 | bottom 50% share of wealth | +2.136 | +2.151 | no |
| opt-in | Adverse | 20 | bottom 50% share of income | -0.971 | -0.963 | no |
| opt-in | Adverse | 20 | stayed in the lowest wealth fifth | +7.744 | +7.572 | no |
| opt-in | Adverse | 20 | stayed in the top wealth fifth | -0.345 | -0.324 | no |
| opt-in | Adverse | 20 | lowest fifth to top fifth | +0.006 | +0.006 | no |
| opt-in | Adverse | 20 | labour's share of money income | -8.007 | -7.970 | no |
| opt-in | Adverse | 20 | families in debt | -12.278 | -12.354 | no |
| opt-in | Adverse | 20 | employment | -2.386 | -2.412 | no |
| opt-in | Adverse | 20 | hours | -0.033 | -0.034 | no |
| opt-in | Adverse | 20 | participation | -2.434 | -2.408 | no |
| full coverage | Adverse | 40 | top 1% share of wealth | -5.470 | -5.488 | no |
| full coverage | Adverse | 40 | top 10% share of wealth | -10.676 | -10.716 | no |
| full coverage | Adverse | 40 | top 1% share of income | -8.916 | -8.943 | no |
| full coverage | Adverse | 40 | top 10% share of income | -11.670 | -11.745 | no |
| full coverage | Adverse | 40 | Palma ratio of income | -2.588 | -2.600 | no |
| full coverage | Adverse | 40 | bottom 50% share of wealth | +6.832 | +6.866 | no |
| full coverage | Adverse | 40 | bottom 50% share of income | +6.981 | +7.043 | no |
| full coverage | Adverse | 40 | stayed in the lowest wealth fifth | +9.965 | +9.705 | no |
| full coverage | Adverse | 40 | stayed in the top wealth fifth | -2.127 | -2.103 | no |
| full coverage | Adverse | 40 | lowest fifth to top fifth | +0.060 | +0.058 | no |
| full coverage | Adverse | 40 | labour's share of money income | -29.667 | -29.753 | no |
| full coverage | Adverse | 40 | families in debt | -29.986 | -29.997 | no |
| full coverage | Adverse | 40 | employment | -4.577 | -4.600 | no |
| full coverage | Adverse | 40 | hours | +0.108 | +0.110 | no |
| full coverage | Adverse | 40 | participation | -4.643 | -4.642 | no |
| opt-in | Adverse | 40 | top 1% share of wealth | -1.553 | -1.556 | no |
| opt-in | Adverse | 40 | top 10% share of wealth | -3.018 | -3.024 | no |
| opt-in | Adverse | 40 | top 1% share of income | -1.342 | -1.344 | no |
| opt-in | Adverse | 40 | top 10% share of income | -1.313 | -1.316 | no |
| opt-in | Adverse | 40 | Palma ratio of income | -0.154 | -0.157 | no |
| opt-in | Adverse | 40 | bottom 50% share of wealth | +1.665 | +1.669 | no |
| opt-in | Adverse | 40 | bottom 50% share of income | +0.130 | +0.135 | no |
| opt-in | Adverse | 40 | stayed in the lowest wealth fifth | +8.004 | +7.646 | no |
| opt-in | Adverse | 40 | stayed in the top wealth fifth | -0.333 | -0.333 | no |
| opt-in | Adverse | 40 | lowest fifth to top fifth | +0.010 | +0.010 | no |
| opt-in | Adverse | 40 | labour's share of money income | -4.662 | -4.645 | no |
| opt-in | Adverse | 40 | families in debt | -11.424 | -11.446 | no |
| opt-in | Adverse | 40 | employment | -2.009 | -2.019 | no |
| opt-in | Adverse | 40 | hours | -0.025 | -0.025 | no |
| opt-in | Adverse | 40 | participation | -2.030 | -2.014 | no |
| full coverage | Stress | 20 | top 1% share of wealth | -4.011 | -4.032 | no |
| full coverage | Stress | 20 | top 10% share of wealth | -8.145 | -8.190 | no |
| full coverage | Stress | 20 | top 1% share of income | -3.893 | -3.915 | no |
| full coverage | Stress | 20 | top 10% share of income | -5.391 | -5.463 | no |
| full coverage | Stress | 20 | Palma ratio of income | -1.010 | -1.021 | no |
| full coverage | Stress | 20 | bottom 50% share of wealth | +5.579 | +5.620 | no |
| full coverage | Stress | 20 | bottom 50% share of income | +4.365 | +4.429 | no |
| full coverage | Stress | 20 | stayed in the lowest wealth fifth | +8.548 | +8.326 | no |
| full coverage | Stress | 20 | stayed in the top wealth fifth | -1.141 | -1.126 | no |
| full coverage | Stress | 20 | lowest fifth to top fifth | +0.020 | +0.016 | no |
| full coverage | Stress | 20 | labour's share of money income | -27.708 | -27.770 | no |
| full coverage | Stress | 20 | families in debt | -24.868 | -24.899 | no |
| full coverage | Stress | 20 | employment | -4.266 | -4.315 | no |
| full coverage | Stress | 20 | hours | +0.073 | +0.075 | no |
| full coverage | Stress | 20 | participation | -4.355 | -4.356 | no |
| opt-in | Stress | 20 | top 1% share of wealth | -0.665 | -0.670 | no |
| opt-in | Stress | 20 | top 10% share of wealth | -1.342 | -1.353 | no |
| opt-in | Stress | 20 | top 1% share of income | -0.223 | -0.224 | no |
| opt-in | Stress | 20 | top 10% share of income | -0.011 | -0.015 | no |
| opt-in | Stress | 20 | Palma ratio of income | +0.050 | +0.048 | no |
| opt-in | Stress | 20 | bottom 50% share of wealth | +0.809 | +0.816 | no |
| opt-in | Stress | 20 | bottom 50% share of income | -0.233 | -0.228 | no |
| opt-in | Stress | 20 | stayed in the lowest wealth fifth | +3.140 | +3.186 | no |
| opt-in | Stress | 20 | stayed in the top wealth fifth | +0.032 | +0.046 | no |
| opt-in | Stress | 20 | lowest fifth to top fifth | +0.000 | +0.000 | no |
| opt-in | Stress | 20 | labour's share of money income | -2.125 | -2.127 | no |
| opt-in | Stress | 20 | families in debt | -4.998 | -5.018 | no |
| opt-in | Stress | 20 | employment | -0.970 | -0.982 | no |
| opt-in | Stress | 20 | hours | -0.016 | -0.017 | no |
| opt-in | Stress | 20 | participation | -0.991 | -0.980 | no |
| full coverage | Stress | 40 | top 1% share of wealth | -4.726 | -4.742 | no |
| full coverage | Stress | 40 | top 10% share of wealth | -9.267 | -9.302 | no |
| full coverage | Stress | 40 | top 1% share of income | -7.234 | -7.262 | no |
| full coverage | Stress | 40 | top 10% share of income | -9.207 | -9.277 | no |
| full coverage | Stress | 40 | Palma ratio of income | -2.176 | -2.190 | no |
| full coverage | Stress | 40 | bottom 50% share of wealth | +5.962 | +5.992 | no |
| full coverage | Stress | 40 | bottom 50% share of income | +5.323 | +5.381 | no |
| full coverage | Stress | 40 | stayed in the lowest wealth fifth | +11.319 | +11.056 | no |
| full coverage | Stress | 40 | stayed in the top wealth fifth | -1.427 | -1.414 | no |
| full coverage | Stress | 40 | lowest fifth to top fifth | +0.045 | +0.043 | no |
| full coverage | Stress | 40 | labour's share of money income | -25.986 | -26.061 | no |
| full coverage | Stress | 40 | families in debt | -29.520 | -29.538 | no |
| full coverage | Stress | 40 | employment | -4.733 | -4.758 | no |
| full coverage | Stress | 40 | hours | +0.075 | +0.077 | no |
| full coverage | Stress | 40 | participation | -4.804 | -4.806 | no |
| opt-in | Stress | 40 | top 1% share of wealth | -0.596 | -0.598 | no |
| opt-in | Stress | 40 | top 10% share of wealth | -1.162 | -1.165 | no |
| opt-in | Stress | 40 | top 1% share of income | -0.286 | -0.287 | no |
| opt-in | Stress | 40 | top 10% share of income | -0.286 | -0.288 | no |
| opt-in | Stress | 40 | Palma ratio of income | -0.022 | -0.023 | no |
| opt-in | Stress | 40 | bottom 50% share of wealth | +0.619 | +0.620 | no |
| opt-in | Stress | 40 | bottom 50% share of income | +0.014 | +0.017 | no |
| opt-in | Stress | 40 | stayed in the lowest wealth fifth | +3.058 | +3.004 | no |
| opt-in | Stress | 40 | stayed in the top wealth fifth | +0.003 | +0.011 | no |
| opt-in | Stress | 40 | lowest fifth to top fifth | +0.000 | +0.000 | no |
| opt-in | Stress | 40 | labour's share of money income | -1.066 | -1.067 | no |
| opt-in | Stress | 40 | families in debt | -4.634 | -4.645 | no |
| opt-in | Stress | 40 | employment | -0.862 | -0.865 | no |
| opt-in | Stress | 40 | hours | -0.014 | -0.014 | no |
| opt-in | Stress | 40 | participation | -0.873 | -0.865 | no |

180 effects: 0 change sign.
