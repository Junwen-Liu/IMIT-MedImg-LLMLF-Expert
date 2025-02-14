#!/usr/bin/env python
# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: Apache-2.0

# DeepSpeed Team
import argparse
import os
import torch

from transformers import AutoTokenizer
import sys

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))
from utils.model.model_utils import create_critic_model
from utils.utils import to_device


def parse_args():
    parser = argparse.ArgumentParser(
        description="Eval the finetued reward model")
    parser.add_argument(
        "--model_name_or_path",
        type=str,
        help=
        "Path to pretrained model or model identifier from huggingface.co/models.",
        required=True,
    )
    parser.add_argument(
        "--num_padding_at_beginning",
        type=int,
        default=1,
        help=
        "OPT model has a fixed number (1) of padding tokens at the beginning of the input. "
        "We did not see this in other models but keep it as an option for now.",
    )
    args = parser.parse_args()
    return args


def load_stuff(model_name_or_path, num_padding_at_beginning):

    tokenizer = AutoTokenizer.from_pretrained(model_name_or_path,
                                              fast_tokenizer=True)
    tokenizer.pad_token = tokenizer.eos_token
    model = create_critic_model(model_name_or_path, tokenizer, None,
                                num_padding_at_beginning, True)

    return model, tokenizer


def prepare_datapair(prompt,
                     good_ans,
                     bad_ans,
                     tokenizer,
                     max_seq_len=512,
                     end_of_conversation_token="<|endoftext|>"):
    chosen_sentence = prompt + good_ans + end_of_conversation_token  # the accept response
    reject_sentence = prompt + bad_ans + end_of_conversation_token  # the reject response
    chosen_token = tokenizer(chosen_sentence,
                             max_length=max_seq_len,
                             padding="max_length",
                             truncation=True,
                             return_tensors="pt")

    reject_token = tokenizer(reject_sentence,
                             max_length=max_seq_len,
                             padding="max_length",
                             truncation=True,
                             return_tensors="pt")

    batch = {}
    batch["input_ids"] = torch.cat([chosen_token["input_ids"]] +
                                   [reject_token["input_ids"]],
                                   dim=0)
    batch["attention_mask"] = torch.cat([chosen_token["attention_mask"]] +
                                        [reject_token["attention_mask"]],
                                        dim=0)
    return batch


def prepare_singlesample(prompt,
                         good_ans,
                         tokenizer,
                         max_seq_len=512,
                         end_of_conversation_token="<|endoftext|>"):
    chosen_sentence = prompt + good_ans + end_of_conversation_token
    chosen_token = tokenizer(chosen_sentence,
                             max_length=max_seq_len,
                             padding="max_length",
                             truncation=True,
                             return_tensors="pt")

    batch = {}
    batch["input_ids"] = chosen_token["input_ids"]
    batch["attention_mask"] = chosen_token["attention_mask"]

    return batch


def run_pair_comparison():
    args = parse_args()

    device = torch.device("cuda:0")

    rm_model, tokenizer = load_stuff(args.model_name_or_path,
                                     args.num_padding_at_beginning)
    rm_model.to(device)
    rm_model.eval()

    prompt_list = [
        "根据下面一段上腹部CT的影像描述：肝脏形态大小正常；肝左叶近膈顶部可见类圆形低密度影；边界清晰；直径约1.7cm。胆囊形态饱满；胆囊壁稍增厚；肝内外胆管扩张；直径约1.4cm；胆总管下段似见斑片状等密度影；十二指肠降段及水平段扩张积液。升结肠及结肠脾曲周围可见多发小圆形稍高密度影。胰腺形态大小正常；未见异常密度影。脾形态大小正常；未见异常密度影。所示左肾上极类圆形等密度影；右肾未见异常。腹膜后未见异常增大的淋巴结影。生成一份对应的诊断意见： ",
        "根据下面一段上腹部CT的影像描述：肝脏形态大小正常；肝右后叶可见小片状低密度影。胆囊体积略大；胆囊底部似见略高密度影。胰腺形态大小正常；未见异常密度影。脾形态大小正常；未见异常密度影。双侧肾上腺未见明显异常；右肾实质内见直径约0.6CM囊状低密度影；CT值约-75HU；边界尚清。腹膜后未见异常增大的淋巴结影。附见阑尾内高密度影。生成一份对应的诊断意见："
    ]
    good_ans_list = [
        "胆囊饱满；胆囊壁稍增厚；肝内外胆管扩张；胆总管下段可疑斑片状等密度影；十二指肠降段及水平段扩张积液；肝左叶囊肿；左肾上极复杂性囊肿；升结肠及结肠脾曲多发憩室；请结合临床必要时MRCP检查、随访。",
        "肝右后叶低密度影；胆囊泥沙样结石可能；右肾错构瘤；附见阑尾粪石；请结合临床及其他检查；随访。"
    ]
    bad_ans_list = [
        "胰腺脂肪浸润；左侧肾上腺稍粗；十二指肠憩室；腹主动脉管壁钙化。请结合临床及其他相关检查；随诊。"
    ]

    for prompt, good_ans, bad_ans in zip(prompt_list, good_ans_list,
                                         bad_ans_list):
        batch = prepare_datapair(prompt,
                                 good_ans,
                                 bad_ans,
                                 tokenizer,
                                 max_seq_len=512,
                                 end_of_conversation_token="<|endoftext|>")
        batch = to_device(batch, device)
        # Run inference
        with torch.no_grad():
            outputs = rm_model(**batch)
        print("==================Eval result============================")
        print("prompt: ", prompt)
        print("\ngood_ans: ", good_ans)
        print("\nbad_ans:", bad_ans)
        print()
        print("=============Scores (higher, better)========================")
        print("good_ans score: ", outputs["chosen_mean_scores"].item())
        print("bad_ans score: ", outputs["rejected_mean_scores"].item())


def run_single_sample():
    args = parse_args()
    device = torch.device("cuda")

    rm_model, tokenizer = load_stuff(args.model_name_or_path,
                                     args.num_padding_at_beginning)
    rm_model.to(device)

    prompt = "Human: Explain the moon landing to a 6 year old in a few sentences."
    my_ans = "Assistant: The moon landing was a major milestone in the history of human exploration of the solar system. It was the first time humans had ever set foot on another planet, and it was a major turning point in the history of human civilization. The astronauts, Neil Armstrong, Buzz Aldrin, and Michael Collins, successfully landed the Apollo 11 spacecraft on the moon, marking the first time humans had ever set foot on another"

    batch = prepare_singlesample(prompt,
                                 my_ans,
                                 tokenizer,
                                 max_seq_len=512,
                                 end_of_conversation_token="<|endoftext|>")
    batch = to_device(batch, device)

    rm_model.eval()
    # Run inference
    with torch.no_grad():
        outputs = rm_model.forward_value(
            **batch, prompt_length=max(2, args.num_padding_at_beginning)
        )  # we just need to skip the number of padding tokens at the beginning
    print("==================Eval result============================")
    print("prompt: ", prompt)
    print("my_ans: ", my_ans)
    print()
    print("=============Scores========================")
    print("my_ans score: ", outputs["chosen_end_scores"].item())


if __name__ == "__main__":
    run_pair_comparison()
    # run_single_sample()
