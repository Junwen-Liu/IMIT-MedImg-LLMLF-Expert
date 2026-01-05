# Step 1: Supervised Fine-Tuning (SFT)

Fine-tune BLOOMZ models on radiologist-specific CT report data to generate impressions from findings.

## Training

```bash
# Single GPU
bash training_scripts/single_gpu/run_1.3b.sh

# Multi-GPU (modify script for your setup)
bash training_scripts/multi_gpu/run_1.3b.sh
```

## Evaluation

```bash
bash evaluation_scripts/run_prompt.sh
```

This compares the baseline model (`--model_name_or_path_baseline`) with the fine-tuned model (`--model_name_or_path_finetune`).

## Models and Datasets

We used BLOOMZ models (560M to 7B parameters) as base models. For training data, we used radiologist-specific CT report datasets formatted as instruction-response pairs.

## Key Arguments

| Argument | Description |
| -------- | ----------- |
| `--data_path` | Training data path(s) |
| `--data_split` | Data split ratio for 3-step training (default: 20/40/40) |
| `--sft_only_data_path` | Single-response data (Step 1 only) |
| `--gradient_checkpoint` | Enable gradient checkpointing to reduce memory |
| `--offload` | Offload model to CPU/NVME for memory saving |
| `--zero_stage` | DeepSpeed ZeRO stage (0-3) |
| `--lora_dim` | LoRA dimension (>0 enables LoRA) |

## Memory Estimation

Maximum trainable model size ≈ Total GPU Memory (GB) / 3

## Notes

- Longer training epochs improve performance, especially for smaller models
- Hyperparameters are not exhaustively tuned; experiment for your use case
- See `training_scripts/other_language` for Chinese/Japanese examples
