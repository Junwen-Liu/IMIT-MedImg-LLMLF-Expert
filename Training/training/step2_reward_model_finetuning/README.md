# Step 2: Reward Model Fine-Tuning

Train a reward model to evaluate the quality of generated radiology impressions.

## Key Differences from SFT

| Aspect | SFT (Step 1) | Reward Model (Step 2) |
| ------ | ------------ | --------------------- |
| **Data** | Single query-answer pair | Paired responses (high/low score) |
| **Objective** | Generate text | Assign pairwise ranking scores |

## Training

```bash
bash training_scripts/single_gpu/run_350m.sh
```

## Evaluation

```bash
bash evaluation_scripts/run_eval.sh
```

The `rw_eval.py` script tests the reward model's ability to score responses.

## Key Arguments

| Argument | Description |
| -------- | ----------- |
| `--num_padding_at_beginning` | Handle tokenizer padding differences (OPT adds padding at start) |

## Notes

- Negative average reward scores during training are normal and don't prevent Step 3 from working
- Hyperparameters are not exhaustively tuned; experiment for your use case
