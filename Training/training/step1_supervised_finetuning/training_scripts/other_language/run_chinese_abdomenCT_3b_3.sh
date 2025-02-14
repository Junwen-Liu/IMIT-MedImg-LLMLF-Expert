#!/bin/bash
# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team

MODEL=/IMIT_User2/junwen/DeepSpeed-Chat_lw/pretrainedModels/bloomz-3b
OUTPUT_PATH=./output_bloom_3b_3
mkdir -p $OUTPUT_PATH
# The Chinese data we found mostly only contain one response without another
# "rejected" response. Thus we only test the step 1 finetuning and use
# a data_split of 10,0,0 (keep all data for step 1).
deepspeed --master_port=29502 /IMIT_User2/junwen/DeepSpeed-Chat_lw/training/step1_supervised_finetuning/main.py \
   --data_path abdomenCT \
   --data_split 10,0,0 \
   --model_name_or_path $MODEL \
   --per_device_train_batch_size 2 \
   --per_device_eval_batch_size 2 \
   --learning_rate 9.65e-6 \
   --num_train_epochs 3  \
   --deepspeed --seed 1234 --num_warmup_steps 0 \
   --lr_scheduler_type cosine \
   --zero_stage 3 \
   --output_dir $OUTPUT_PATH \
   &> $OUTPUT_PATH/training.log
