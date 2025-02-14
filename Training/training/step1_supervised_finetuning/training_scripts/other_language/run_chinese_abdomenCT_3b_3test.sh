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
deepspeed --num_nodes=2 --hostfile=hostfile --master_port=29502 /IMIT_User2/junwen/DeepSpeed-Chat_lw/training/step1_supervised_finetuning/main.py \
   --data_path abdomenCT \
   --data_split 10,0,0 \
   --model_name_or_path $MODEL \
   --per_device_train_batch_size 4 \
   --per_device_eval_batch_size 4 \
   --max_seq_len 512 \
   --learning_rate 1e-4 \
   --weight_decay 0.1 \
   --num_train_epochs 2  \
   --gradient_accumulation_steps 1 \
   --lr_scheduler_type cosine \
   --num_warmup_steps 0 \
   --seed 1234 \
   --gradient_checkpointing \
   --zero_stage 3 \
   --deepspeed \
   --output_dir $OUTPUT_PATH \
   &> $OUTPUT_PATH/training.log