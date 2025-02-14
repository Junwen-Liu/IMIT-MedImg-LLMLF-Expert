#!/bin/bash
# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team

MODEL=/IMIT_User2/junwen/DeepSpeed-Chat_lw/pretrainedModels/bloomz-1b1
OUTPUT_PATH=./output_bloom_1b1_16
mkdir -p $OUTPUT_PATH
# The Chinese data we found mostly only contain one response without another
# "rejected" response. Thus we only test the step 1 finetuning and use
# a data_split of 10,0,0 (keep all data for step 1).
   # --data_path abdomenCT \
deepspeed --master_port=29501 /IMIT_User2/junwen/DeepSpeed-Chat_lw/training/step1_supervised_finetuning/main.py \
   --data_path abdomenCT \
   --data_split 10,0,0 \
   --model_name_or_path $MODEL \
   --per_device_train_batch_size 2 \
   --per_device_eval_batch_size 2 \
   --learning_rate 9.65e-6 \
   --num_train_epochs 16  \
   --deepspeed --seed 1234 --num_warmup_steps 0 \
   --lr_scheduler_type cosine \
   --output_dir $OUTPUT_PATH \
   &> $OUTPUT_PATH/training.log
