# Supervised finetuning (SFT)

Supervised fine-tuning (SFT) is similar to standard language model fine-tuning on general language tasks (e.g., WikiText-103), with the primary difference being the use of high-quality query-answer pairs to fine-tune the model for human-preferred generation in specific domains.

## How We Trained the Model

For our research, we utilized several scripts that support training on different setups, ranging from single GPUs (e.g., A6000-48G, V100-32G, A100-40G, etc.) to single-node (e.g., 8/16x V100-32G, 8 A100-40G/80G) and multi-node systems (e.g., 64x A100-80G). These scripts can be found in the `training_scripts` directory. For instance, to train the OPT-1.3B model using a single A6000-48G GPU, we simply ran:

```bash
training_scripts/single_gpu/run_1.3b.sh
```

It's straightforward to extend this script to a multi-node setup, depending on the available hardware resources.

## How to evaluate the SFT checkpoint?

Once training is complete, evaluating the model is simple. You can run the following script:
`bash evaluation_scripts/run_prompt.sh`

his script prompts users to provide the paths to two models: (a) the original pretrained model (e.g., `--model_name_or_path_baseline facebook/opt-1.3b`) and (b) the fine-tuned model (e.g., `--model_name_or_path_finetune output/check_base`). The `prompt_eval.py` script includes several prompt examples that can be customized as needed.

## Models and Datasets

In our work, since there were no open-source checkpoints available for GPT-3, we utilized the Bloom family pretrained models (i.e. BLOOMZ). However, other pretrained models like GPT-Neo, Bloom, and others can be used as well. For datasets, we relied on several open-sourced datasets from Huggingface, including:

```text
Dahoas/rm-static
Dahoas/full-hh-rlhf
Dahoas/synthetic-instruct-gptj-pairwise
yitingxie/rlhf-reward-datasets
openai/webgpt_comparisons stanfordnlp/SHP
```

The DeepSpeed RLHF data abstraction and blending techniques enabled us to combine multiple sources of data for training. However, it is important to note that different datasets use different prompt words (e.g., _Dahoas/rm-static_ uses "Human:" for queries and "Assistant:" for answers), so users must align these prompts accordingly. In our case, we consistently used the format from _Dahoas/rm-static_ for uniformity. Our experiments showed that integrating diverse datasets improved the overall quality of the model. Below, you will find examples of query-answer pairs from OPT-1.3B and its fine-tuned variants using different datasets.
|

## Some arguments explanation and the largest trainable model

Most of the arguments used in the `main.py` file are straightforward, especially for those familiar with fine-tuning decoder models. However, if any are unclear, feel free to reach out via GitHub issues. Below, we provide specific explanations of some arguments and their usage.

| Args                                                   | Explanation                                                                            | Note                                                                                                                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --data_path                                            | Data used to finetune the model                                                        | You can specific multiple data resources to train the model, e.g., Dahoas/rm-static Dahoas/full-hh-rlhf                                                                                                        |
| --data_data_split                                      | Split the data for three-step training                                                 | Following InstructGPT, we make sure the three-step training has no overlap data. Also we use 20%, 40%, 40% for each step respectively. You can change it to 10 0 0 if you only do SFT.                         |
| --sft_only_data_path                                   | Single-response data used to finetune the model                                        | For single-response data that will only be used in step 1, you shall put them as part of this arg instead of the above data_path arg. Datasets in this arg will not be splitted and fully used in step 1 only. |
| --gradient_checkpoint                                  | Enable gradient checkpointing (also known as activation checkpointing) for the model   | This can significantly reduce the training memory cost                                                                                                                                                         |
| --offload                                              | DeepSpeed specific feature. Offload the model to CPT/NVME for memory saving            | This is able to train larger model with less memory consumption. But it will slow down the training.                                                                                                           |
| --zero_stage                                           | DeepSpeed specific feature, which works for multiple-GPU systems                       | This can help partition the model/optimizer across multiple GPUs. Please see[here](https://www.deepspeed.ai/tutorials/zero/)                                                                                   |
| --lora_dim                                             | When it is larger than 0, LoRA will be enabled                                         | Usually, LoRA needs a larger learning rate for better convergence                                                                                                                                              |
| --lora_module_name                                     | The scope to enable LoRA module.                                                       |                                                                                                                                                                                                                |
| --only_optimize_lora                                   | Freeze all othre paramters and only optimize LoRA-related prameters                    |                                                                                                                                                                                                                |
| --gradient_checkpoint, --lora_dim, only_optimizer_lora | When LoRA and Gradient Checkpointing are enabled. Only Optimize LoRA cannot be enabled | If all three are enabled, it will affect the gradient flow (aka the augo-grad system backend by PyTorch)                                                                                                       |

To estimate the maximum model size you can train with your system, use the following rule of thumb: divide the total GPU memory (in GB) by 3. For example, a single A6000-48G GPU could train a model with up to 16 billion parameters, though this is an approximation, and you should test your system's limits.

## Others

From InstructGPT's experience, longer training epochs are often beneficial to improve model performance and human-preferred answers. In our research, we found this particularly helpful when fine-tuning smaller models, such as OPT-1.3B. The hyperparameters used in our scripts have not been exhaustively tuned, so we encourage users to experiment and find the optimal configuration for their tasks. Additionally, our system can be easily extended to other languages, including Chinese and Japanese, as demonstrated in the "training_scripts/other_language" directory.
