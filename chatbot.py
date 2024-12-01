# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team

import argparse
import csv
import logging
import time

import pandas as pd
import transformers  # noqa: F401
from torch.utils.data import Dataset
from transformers import AutoConfig, AutoTokenizer, BloomForCausalLM, pipeline, set_seed


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--path",
        type=str,
        help="Directory containing the model"
    )
    parser.add_argument(
        "--token_path",
        type=str,
        help="Directory containing the tokenizer",
    )
    parser.add_argument(
        "--max_new_tokens",
        type=int,
        default=512,
        help="Maximum new tokens to generate per response",
    )
    parser.add_argument(
        "--in_csv",
        type=str,
        help="Path to the input csv file",
    )
    parser.add_argument(
        "--out_csv",
        type=str,
        help="Path to the output csv file",
    )
    parser.add_argument(
        "--new_col_name",
        type=str,
        help="Name of the generated answer column"
    )
    parser.add_argument(
        "--device",
        type=str,
        default="cuda:0",
        help="Which GPU to use",
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=1,
        help="Pipeline batch size",
    )
    args = parser.parse_args()
    return args


def get_generator(path, token_path):
    tokenizer = AutoTokenizer.from_pretrained(token_path, fast_tokenizer=True)
    print('=> tokenizer loaded')

    tokenizer.pad_token = tokenizer.eos_token

    model_config = AutoConfig.from_pretrained(path)
    print('=> model config loaded')
    model = BloomForCausalLM.from_pretrained(path, from_tf=bool(".ckpt" in path), config=model_config).half()
    print('=> model loaded')

    model.config.end_token_id = tokenizer.eos_token_id
    model.config.pad_token_id = model.config.eos_token_id
    model.resize_token_embeddings(len(tokenizer))
    generator = pipeline("text-generation",
                         model=model,
                         tokenizer=tokenizer,
                         device=args.device,
                         batch_size=args.batch_size)
    print('=> pipeline initialized')
    return generator


def get_model_response(generator, user_input, max_new_tokens):
    response = generator(user_input, max_new_tokens=max_new_tokens)
    return response


def process_response(response):
    output = str(response[0]['generated_text'])
    output = output[output.find('生成一份对应的诊断意见�?') + 12:output.find('<|endoftext|>')].replace(' ', '')
    return output


def main(args):
    generator = get_generator(args.path, args.token_path)
    set_seed(42)

    if args.in_csv is not None:
        in_csv = pd.read_csv(args.in_csv, encoding='gbk', quoting=csv.QUOTE_ALL, escapechar=None, dtype=str)
        final_output = []
        n_instr = 0
        idx_multi = []

        start = time.time()
        for response in get_model_response(generator, in_csv['INSTRUCTION'], args.max_new_tokens):
            output = process_response(response)
            end = output.find('根据下面一段上腹部CT的影像描述：')
            if end != -1:
                idx_multi.append(n_instr)
                output = output[:end]

            final_output.append(output)
            n_instr += 1
            print(f'{output},{n_instr}')
        end = time.time()

        print(f'=> seconds used: {end-start}')
        print(f'=> number of processed instructions: {n_instr}')
        print(f'=> {len(idx_multi)} cases have multiple responses, their indices are: {idx_multi}')

        in_csv[args.new_col_name] = final_output
        in_csv.to_csv(args.out_csv, index=False, encoding='gbk', quoting=csv.QUOTE_ALL, escapechar=None)
    else:
        while True:
            user_input = input("\nPlease input image description (input 'quit' to exit):\n")
            if user_input == 'quit':
                break
            response = get_model_response(generator, user_input, args.max_new_tokens)
            output = process_response(response)
            print('-' * 40 + '\nThe impression generated by LLM is:\n' + output)


if __name__ == "__main__":
    # Silence warnings about `max_new_tokens` and `max_length` being set
    logging.getLogger("transformers").setLevel(logging.ERROR)

    args = parse_args()
    main(args)
