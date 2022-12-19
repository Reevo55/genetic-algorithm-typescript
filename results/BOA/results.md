Wnioski:

- BOA jest wolniejszy jednak dla mniejszych populacji otrzymuje zdecydowanie lepsze rezultaty (ciągłe szukanie neighbours)

- BOA przy skomplikowanych problem zabiera więcej czasu, ale otrzymuje lepsze wyniki

- BOA jest o wiele bardziej czasochłonny przy takiej samej liczbie populacji co genetyczny algorytm

- BOA elityzm nie ma znaczenia przy prostych problemach, jednak ma kluczowe znaczenie przy skomplikowanych problemach

==== RESULTS without elitism =====
┌─────────┬───────────────────┬────────────────┬─────────────────┐
│ (index) │    averageTime    │ averageFitness │ averageCapacity │
├─────────┼───────────────────┼────────────────┼─────────────────┤
│   BOA   │ 35.8604399997741  │   13332765.5   │    6380814.9    │
│ Genetic │ 6.254660000279546 │   13362278.8   │    6387340.8    │
└─────────┴───────────────────┴────────────────┴─────────────────┘

==== RESULTS with elitism =====
┌─────────┬───────────────────┬────────────────┬─────────────────┐
│ (index) │    averageTime    │ averageFitness │ averageCapacity │
├─────────┼───────────────────┼────────────────┼─────────────────┤
│   BOA   │ 36.18597999997437 │   13367517.2   │     6384451     │
│ Genetic │  6.1990200009197  │   13364600.2   │    6392710.7    │
└─────────┴───────────────────┴────────────────┴─────────────────┘