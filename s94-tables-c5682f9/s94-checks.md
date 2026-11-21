# Checks of the lending study (c5682f9)

**All checks pass.**

Every check must pass before any table is read (preregistration, Checks). Checks 1 and 5-8 rest on the engine's unit tests and the build's proofs (compassionism-simulation `clUnitSuite`, 8 of 8 on `c5682f9`; the off-equals-identical proofs of the build); check 2b (the no-programme run unchanged with the switch set on it) was proved in the dry run.

## Reference, 20 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1425 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1425 stored: none
- PASS check 2: row D equals M in all 1412 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1405 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-ref-20-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-ref-20-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-ref-20-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 6.4e-16)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy

## Reference, 40 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1427 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1427 stored: none
- PASS check 2: row D equals M in all 1414 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1407 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-ref-40-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-ref-40-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-ref-40-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 1.0e-15)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy

## Adverse, 20 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1425 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1425 stored: none
- PASS check 2: row D equals M in all 1412 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1405 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-adv-20-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-adv-20-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-adv-20-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 6.4e-16)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy

## Adverse, 40 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1427 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1427 stored: none
- PASS check 2: row D equals M in all 1414 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1407 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-adv-40-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-adv-40-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-adv-40-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 1.0e-15)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy

## Stress, 20 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1425 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1425 stored: none
- PASS check 2: row D equals M in all 1412 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1405 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-str-20-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-str-20-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-str-20-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 9.8e-16)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy
- PASS check 3b (non-vacuity): Stress, opt-in, seed 1: the fund lends (outlay 201.0) and the pace limit binds in 94.7% of adult-years

## Stress, 40 years

- PASS DONE and run.txt present
- PASS check 9: SHA256SUMS, 60 files, all match (the file does not list itself)
- PASS check 9: 20 shards cover seeds 1-500 once; engine c5682f9 and a clean checkout in every shard
- PASS check 9: the release start's baseline check passed in every shard
- PASS every value this analysis reads is finite (31 rows; 1427 keys per row stored)
- · (inspection) keys with a missing value somewhere among the 1427 stored: none
- PASS check 2: row D equals M in all 1414 shared keys, every seed (full coverage); keys only in D: the switch's own reporting keys (13)
- PASS check 2: row D equals M in all 1407 shared keys, every seed (opt-in); keys only in D: the switch's own reporting keys (13)
- PASS M (full coverage) equals the published main row with the private price at the sale (s90-sale-str-40-b8ccd8d) in all 990 of its keys, every seed
- PASS M (opt-in) equals the published main row with the private price at the sale (s90-sale-str-40-b8ccd8d) in all 983 of its keys, every seed
- PASS the no-programme run equals the published main row with the private price at the sale (s90-sale-str-40-b8ccd8d) in all 958 of its keys, every seed
- PASS check 4: the fund's accounts close (outlays = (outstanding + lost funded capacity) x K) within 1e-9 relative in every fund row and seed (largest miss 1.0e-15)
- PASS charter rows without the fund lend nothing (outlay and funded capacity 0 in every seed)
- PASS fund rows without charters pay no charter subsidy
- PASS check 3b (non-vacuity): Stress, opt-in, seed 1: the fund lends (outlay 100.5) and the pace limit binds in 46.2% of adult-years

