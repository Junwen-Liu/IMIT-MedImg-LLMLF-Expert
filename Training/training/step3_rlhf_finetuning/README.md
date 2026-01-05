# Step 3: RLHF Fine-Tuning

Optimize the SFT model using reinforcement learning with the reward model from Step 2.

<img src="../../assets/image/ppo_trainer.png" width="900"/>

## Key Challenges & Solutions

| Challenge | Solution |
| --------- | -------- |
| Memory consumption | ZeRO optimization, reference model offloading, LoRA |
| Generation efficiency | DeepSpeed Hybrid Engine (auto-switches training/inference modes) |

## Training

```bash
bash training_scripts/single_gpu/run_1.3b.sh
```

## Key Arguments

| Argument | Description |
| -------- | ----------- |
| `--per_device_train_batch_size` | Generation batch size |
| `--per_device_mini_batch_size` | PPO training batch size |
| `--ppo_epochs` | PPO epochs per generation |
| `--enable_hybrid_engine` | Enable DeepSpeed Hybrid Engine |
| `--offload_reference_model` | Offload reference model to CPU |
| `--enable_ema` | Enable exponential moving average |

## Memory Estimation

Maximum trainable model size = Total GPU Memory (GB) / 6

## Evaluation

Use `prompt_eval.py` from Step 1 for Q&A quality testing.

## Training Stability Tips

- Keep `per_device_train_batch_size = per_device_mini_batch_size`
- Set `ppo_epochs = generation_batch_numbers = 1`
- Hyperparameters are not exhaustively tuned; experiment for your use case