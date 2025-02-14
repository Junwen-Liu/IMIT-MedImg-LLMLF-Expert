#!/bin/bash
# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team

OUTPUT=$1
ZERO_STAGE=$2
if [ "$OUTPUT" == "" ]; then
    OUTPUT=./output_bloom_560m
fi
if [ "$ZERO_STAGE" == "" ]; then
    ZERO_STAGE=0
fi
mkdir -p $OUTPUT

deepspeed /IMIT_User2/junwen/DeepSpeed-Chat_lw/training/step2_reward_model_finetuning/main.py \
   --data_path abdomenCT_reward \
   --data_split 2,4,4 \
   --model_name_or_path /IMIT_User2/junwen/DeepSpeed-Chat_lw/pretrainedModels/bloomz-560m \
   --num_padding_at_beginning 0 \
   --per_device_train_batch_size 8 \
   --per_device_eval_batch_size 8 \
   --max_seq_len 512 \
   --learning_rate 5e-5 \
   --weight_decay 0.1 \
   --num_train_epochs 1 \
   --gradient_accumulation_steps 1 \
   --lr_scheduler_type cosine \
   --num_warmup_steps 0 \
   --seed 1234 \
   --zero_stage 0 \
   --deepspeed \
   --output_dir $OUTPUT \
   &> $OUTPUT/training.log



