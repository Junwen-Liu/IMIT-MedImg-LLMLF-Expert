# Training Guide

This folder contains the training pipeline for **Expert-Specific Large Language Models for Radiology**, based on [DeepSpeed-Chat](https://github.com/microsoft/DeepSpeedExamples/tree/master/applications/DeepSpeed-Chat).

[![Code License](https://img.shields.io/badge/Code%20License-Apache_2.0-green.svg)](../LICENSE)

We leveraged **DeepSpeed-Chat** to train expert-specific radiology LLMs through a 3-step InstructGPT-style pipeline:

1. **Supervised Fine-Tuning (SFT)**: Fine-tune BLOOMZ models on radiologist-specific report data
2. **Reward Model Training**: Train a reward model to evaluate impression quality
3. **RLHF with PPO**: Refine the model using reinforcement learning with human feedback

<div align="center">
<img src="assets/image/overallresearchworkflow.png" alt="Research Workflow" width="800"/>
</div>

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Step-by-Step Training](#step-by-step-training)
  - [Step 1: Supervised Fine-Tuning](#step-1---supervised-fine-tuning)
  - [Step 2: Reward Model](#step-2---reward-model)
  - [Step 3: RLHF with PPO](#step-3---reinforcement-learning-with-human-feedback)
- [Custom Dataset Preparation](#adding-and-using-custom-datasets-in-deepspeed-chat)
- [Base Models](#base-models)
- [Supported Models](#supported-models)
- [Documentation](#documentation-and-tutorial)

## Base Models

In our study, we used the following pretrained models:

| Pretrained Models | Parameter Size | Hugging Face Link |
| ----------------- | -------------- | ----------------- |
| Bloomz-560m | 559M params | [bigscience/bloomz-560m](https://huggingface.co/bigscience/bloomz-560m) |
| Bloomz-1b1 | 1.07B params | [bigscience/bloomz-1b1](https://huggingface.co/bigscience/bloomz-1b1) |
| Bloomz-3b | 3B params | [bigscience/bloomz-3b](https://huggingface.co/bigscience/bloomz-3b) |
| Bloomz-7b1 | 7.07B params | [bigscience/bloomz-7b1](https://huggingface.co/bigscience/bloomz-7b1) |

## Installation

```bash
pip install deepspeed>=0.9.0

git clone https://github.com/microsoft/DeepSpeedExamples.git
cd DeepSpeedExamples/applications/DeepSpeed-Chat/
pip install -r requirements.txt
```

## Quick Start

Run the complete 3-step RLHF pipeline with a single command:

```bash
# Single GPU (1.3B model)
python train.py --actor-model facebook/opt-1.3b --reward-model facebook/opt-350m --deployment-type single_gpu

# Single node with multiple GPUs (13B model)
python train.py --actor-model facebook/opt-13b --reward-model facebook/opt-350m --deployment-type single_node
```

## Step-by-Step Training

### Step 1 - Supervised Fine-Tuning

Fine-tune a pretrained BLOOMZ model on radiology report data:

```bash
cd training/step1_supervised_finetuning/
bash training_scripts/single_gpu/run_1.3b.sh
bash evaluation_scripts/run_prompt.sh
```

### Step 2 - Reward Model

Train a reward model to evaluate impression quality:

```bash
cd training/step2_reward_model_finetuning
bash training_scripts/run_350m.sh
bash evaluation_scripts/run_eval.sh
```

### Step 3 - Reinforcement Learning with Human Feedback

<div align="center">
<img src="assets/image/ppo_trainer.png" alt="PPO Trainer" width="700"/>
</div>

Run PPO training with your fine-tuned actor and reward models:

```bash
cd training/step3_rlhf_finetuning/
bash training_scripts/single_gpu/run_1.3b.sh
```

## Adding and Using Custom Datasets in DeepSpeed-Chat

Format your data as instruction-response pairs:

| Instruction | Response |
| ----------- | -------- |
| Prefix + Findings + Suffix | Prefix + Impression |

**Convert CSV to Arrow format:**

```python
from datasets import load_dataset, load_from_disk

# Load and convert (use appropriate encoding for your language)
dataset = load_dataset('csv', data_files='path/to/data.csv', delimiter=',', encoding='gbk')
dataset.save_to_disk('path/to/data.arrow')

# Validate
data = load_from_disk('./data.arrow')
print(data)
```

**Integrate custom datasets:**

1. Define a new class in `training/utils/data/raw_datasets.py` following the `PromptRawDataset` structure
2. Update `get_raw_dataset` in `training/utils/data/data_utils.py` to handle your dataset
3. Add the dataset name to `--data_path` in your training script

> **Note:** Datasets with single responses should use `--sft_only_data_path` (Step 1 only). For Steps 2-3, use datasets with paired responses to ensure training consistency.

## Supported Models

Currently, Deepspeed-Chat support the following model families.

| model family                                                   | size range  |
| -------------------------------------------------------------- | ----------- |
| [opt](https://huggingface.co/models?other=opt)                 | 0.1B - 66B  |
| [bloom](https://huggingface.co/models?other=bloom)             | 0.3B - 176B |
| [gpt_neox](https://huggingface.co/models?other=gpt_neox)       | 1.3B - 20B  |
| [gptj](https://huggingface.co/models?other=gptj)               | 1.4B - 6B   |
| [gpt_neo](https://huggingface.co/models?other=gpt_neo)         | 0.1B - 2.7B |
| [gpt2](https://huggingface.co/models?other=gpt2)               | 0.3B - 1.5B |
| [codegen](https://huggingface.co/Salesforce/codegen-16B-multi) | 0.35b - 16B |

## Documentation and Tutorial

For detailed documentation on each training step:

- [Step 1: Supervised Fine-Tuning](./training/step1_supervised_finetuning/README.md)
- [Step 2: Reward Model](./training/step2_reward_model_finetuning/README.md)
- [Step 3: RLHF](./training/step3_rlhf_finetuning/README.md)

## References

- [DeepSpeed-Chat GitHub](https://github.com/microsoft/DeepSpeedExamples/tree/master/applications/DeepSpeed-Chat)
- [DeepSpeed](https://github.com/microsoft/DeepSpeed)
