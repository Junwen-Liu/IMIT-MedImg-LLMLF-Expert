#!/bin/bash
# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team

MODEL=/home/junwen/DeepSpeed-Chat/model-bloom-1b1-zh
OUTPUT_PATH=./output_chinese_bloom_in_16_zh_added
mkdir -p $OUTPUT_PATH
# The Chinese data we found mostly only contain one response without another
# "rejected" response. Thus we only test the step 1 finetuning and use
# a data_split of 10,0,0 (keep all data for step 1).
deepspeed --master_port=29503 /home/junwen/DeepSpeed-Chat/training/step1_supervised_finetuning/main.py \
   --data_path incretion \
   --data_split 10,0,0 \
   --model_name_or_path $MODEL \
   --per_device_train_batch_size 2 \
   --per_device_eval_batch_size 2 \
   --learning_rate 9.65e-6 \
   --num_train_epochs 16  \
   --deepspeed --seed 1235 --num_warmup_steps 0 \
   --lr_scheduler_type cosine \
   --output_dir $OUTPUT_PATH \
   &> $OUTPUT_PATH/training.log
