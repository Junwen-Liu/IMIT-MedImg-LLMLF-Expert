# IMIT-MedImg-LLMLF-Expert

## Installation

```bash
git clone https://github.com/Junwen-Liu/IMIT-MedImg-LLMLF-Expert.git
cd IMIT-MedImg-LLMLF-Expert
conda create -n llmlf python=3.10.14
conda activate llmlf
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cu121
pip install pandas==2.2.3 transformers==4.40.2
```

## Download Models

Download pre-trained models from [Hugging Face](https://huggingface.co/IMIT-MedImg/IMIT-MedImg-LLMLF-Expert/tree/main) and put them under `./models`. The path of pre-trained models should be organized as:

```
├── /path/to/IMIT-MedImg-LLMLF-Expert
    ├── models
        ├── 3b_radiologist1
            ├── config.json
            ├── merges.txt
            ├── pytorch_model.bin
            ├── training.log
            └── vocab.json
        ├── 3b_radiologist4
        ...
        └── rlhf_checkpoint-80
    ...
```

## Method 1: Interactive Inference

Here's an examplep of using [3b_radiologist1](https://huggingface.co/IMIT-MedImg/IMIT-MedImg-LLMLF-Expert/tree/main/3b_radiologist1) model to do interactive inference.

```bash
python chatbot.py \
    --path ./models/3b_radiologist1 \
    --token_path ./tokenizer \
    --max_new_tokens 512 \
    --device cuda:0
```

The command line should look like the following.

```bash
user@machine:/path/to/IMIT-MedImg-LLMLF-Expert$ python chatbot.py \
> --path ./models/3b_radiologist1 \
> --token_path ./tokenizer \
> --max_new_tokens 512 \
> --device cuda:0
=> tokenizer loaded
=> model config loaded
=> model loaded
=> pipeline initialized

Please input image description (input 'quit' to exit):
根据下面一段上腹部CT的影像描述：肝脏右叶见巨大囊性占位影；大小约103*98mm。胆囊未见异常。胰腺形态大小正常；胰尾部点状钙化；余未见异常密度影。脾形态大小正常；未见异常密度影。两肾未见异常。双侧肾上腺未见明显异常。腹膜后未见异常增大的淋巴结影。附见左下肺结节影；右下肺内基底段斑片影。生成一份对应的诊断意见：
----------------------------------------
The impression generated by LLM is:
肝右叶巨大囊性占位。胰尾部点状钙化。附见左下肺结节影；右下肺内基底段斑片影。请结合临床及其他相关检查；随诊。
----------------------------------------

Please input image description (input 'quit' to exit):
根据下面一段上腹部CT的影像描述：肝脏形态大小正常；其内见多发囊性低密度灶；未见明显强化；肝3段见小类圆形强化灶；静脉期强化程度略高于肝实质。胆囊未见显示。胆总管轻微扩张。脾脏形态大小正常；未见异常密度影。胰腺形态大小正常；未见异常密度影。所示两肾未见异常。腹膜后未见异常增大的淋巴结影。生成一份对应的诊断意见：
----------------------------------------
The impression generated by LLM is:
肝内多发囊肿；肝3段小血管瘤可能；胆囊未见显示；胆总管轻微扩张；请结合临床及其它检查；随访。
----------------------------------------

Please input image description (input 'quit' to exit):
quit
user@machine:/path/to/IMIT-MedImg-LLMLF-Expert$
```

## Method 2: Inference at Scale

Here's an example of using [3b_radiologist1](https://huggingface.co/IMIT-MedImg/IMIT-MedImg-LLMLF-Expert/tree/main/3b_radiologist1) model to do inference at scale on image descriptions stored in `./example_gbk_input.csv`. The python script will generate a new csv file in `./example_gbk_output.csv`, with the LLM generated impression stored in a new column named *RESPONSE_3b_radiologist1*.

```bash
python chatbot.py \
    --path ./models/3b_radiologist1 \
    --token_path ./tokenizer \
    --max_new_tokens 512 \
    --device cuda:0 \
    --batch_size 4 \
    --in_csv ./example_gbk_input.csv \
    --out_csv ./example_gbk_output.csv \
    --new_col_name RESPONSE_3b_radiologist1
```

When preparing the input csv file, users shoud put image descriptions in a column named *INSTRUCTION*, then properly quote the content, and save the file in GBK encoding. Users may refer to the following python code. 

```python
import csv
import pandas
...
dataframe = pandas.DataFrame(...)
dataframe.to_csv('/path/to/output.csv', index=False, encoding='gbk', quoting=csv.QUOTE_ALL, escapechar=None)
```