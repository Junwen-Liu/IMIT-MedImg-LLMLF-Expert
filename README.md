# Expert-Specific Large Language Models for Radiology

[![Paper](https://img.shields.io/badge/Paper-The%20Lancet%20Digital%20Health-blue)](https://doi.org/xxx)
[![Code License](https://img.shields.io/badge/Code%20License-Apache_2.0-green.svg)](LICENSE)
[![Models](https://img.shields.io/badge/🤗%20Hugging%20Face-Models-yellow)](https://huggingface.co/IMIT-MedImg/IMIT-MedImg-LLMLF-Expert)

Official implementation of **"Expert-Specific Large Language Models for Radiology: Achieving Clinical-Grade Performance with Small Datasets"** submitted to *The Lancet Digital Health*.

## 🎯 Key Findings

- **Expert-specific models** trained on only **2,175–9,016 reports** achieve comparable performance to benchmark models trained on **520,442 reports**
- Up to **95.05% time efficiency gains** in prospective clinical deployment
- **97.8% concordance** with radiologist-finalised impressions (BERTScore F1: 0.95–1.00)
- Significantly outperforms public LLMs (GPT-4, Baidu Qianfan) on all CHARM dimensions

## 📁 Repository Structure

```
IMIT-MedImg-LLMLF-Expert/
├── Inference/                 # Inference scripts and example data
│   ├── chatbot.py            # Main inference script (interactive & batch)
│   ├── tokenizer/            # BLOOMZ tokenizer files
│   └── example_gbk_input.csv # Example input file
├── Training/                  # Training pipeline based on DeepSpeed-Chat
│   ├── training/
│   │   ├── step1_supervised_finetuning/    # SFT training
│   │   ├── step2_reward_model_finetuning/  # Reward model training
│   │   └── step3_rlhf_finetuning/          # RLHF/PPO training
│   └── assets/               # Training diagrams and figures
└── Supporting Websites/       # Web applications for annotation and evaluation
    ├── web1-Ruidiology_reward/       # Reward annotation website
    ├── web2-Ruidiology_Product_Prosp/ # Prospective study website
    ├── web3-Ruidiology_Product/      # Production website
    └── web4-Ruidiology_multicenter/  # Multi-center study website
```

## 🚀 Quick Start

### Inference

```bash
# Clone repository
git clone https://github.com/Junwen-Liu/IMIT-MedImg-LLMLF-Expert.git
cd IMIT-MedImg-LLMLF-Expert/Inference

# Create environment
conda create -n llmlf python=3.10.14
conda activate llmlf
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cu121
pip install pandas==2.2.3 transformers==4.40.2

# Download models from Hugging Face and run inference
python chatbot.py --path ./models/3b_radiologist1 --token_path ./tokenizer --device cuda:0
```

See [Inference/README.md](Inference/README.md) for detailed instructions.

### Training

```bash
# Install DeepSpeed
pip install deepspeed>=0.9.0
cd Training/training/step1_supervised_finetuning/

# Run supervised fine-tuning
bash training_scripts/single_gpu/run_1.3b.sh
```

See [Training/README.md](Training/README.md) for the complete 3-step RLHF pipeline.

## 📦 Pre-trained Models

Download from [Hugging Face](https://huggingface.co/IMIT-MedImg/IMIT-MedImg-LLMLF-Expert):

| Model | Base | Training Data | Description |
|-------|------|---------------|-------------|
| `7b_radiologist1/4/5` | BLOOMZ-7B | 2,175–9,016 reports | Expert-specific models |
| `3b_radiologist1/4/5` | BLOOMZ-3B | 2,175–9,016 reports | Compact expert-specific models |
| `bloom_1b1_3/16` | BLOOMZ-1B | 520,442 reports | Benchmark SFT models |
| `bloom_3b_3/16` | BLOOMZ-3B | 520,442 reports | Benchmark SFT models |
| `rlhf_checkpoint-80/120` | BLOOMZ-3B | RLHF refined | RLHF-optimized models |

## 📋 Training Hyperparameters

| Parameter | SFT | RLHF (PPO) |
|-----------|-----|------------|
| Learning Rate | 2×10⁻⁵ | 1.41×10⁻⁵ |
| Batch Size | 8 | 256 |
| Max Sequence Length | 2048 | 2048 |
| Epochs | 16 | — |
| Hardware | 8× NVIDIA A100 (40GB) | 8× NVIDIA A100 (40GB) |


## 📜 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [DeepSpeed-Chat](https://github.com/microsoft/DeepSpeedExamples/tree/master/applications/DeepSpeed-Chat) for the RLHF training framework
- [BLOOMZ](https://huggingface.co/bigscience/bloomz) for the base language models
