#!/usr/bin/env python3
"""按外部硬规则扫描 AI 写作特征。只扫口播正文，不扫交稿说明和制作表格。

规则来源，不是我自己定的：
1. 卡兹克 活人感写作 skill「硬规则（成稿绝对不能出现）」
   https://github.com/KKKKhazix/human-writing
   素材：素材池/04.工具资源/活人感写作skill-数字生命卡兹克.md 第 71 行起
2. Humanizer（21k star，基于 Wikipedia:Signs_of_AI_writing 的 30 种模式）
   https://github.com/blader/humanizer
   重点：否定平行、三连律、系动词回避、假范围、AI 词汇
3. dbs-ai-check（dontbesilent，22 个特征，强/中/弱三档）
   ~/.dbskill/skills/dbs-ai-check/SKILL.md

用法：
  python3 工具/check_ai.py 文件.md           只扫口播正文
  python3 工具/check_ai.py 文件.md --all     扫整份文件
"""
import re
import sys

HARD_PHRASES = [
    "不丢", "说白了", "说穿了", "先说结论",
    "更微妙的是", "还有一层", "只说对了一半",
    "综上所述", "值得注意的是", "建议您",
    "赋能", "抓手", "颗粒度", "生态位", "助力",
    "全方位", "多维度", "认知升级", "情绪价值", "持续赋能",
    "让我们", "在这个快速变化的时代", "深度剖析",
]
METAPHORS = ["仓库", "抽屉", "温度", "死亡", "坍塌"]


def strip_frontmatter(text: str) -> str:
    return re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)


def oral_block(text: str) -> str:
    """定位口播正文：标题含「口播」或「逐字稿」的那一节，到下一个 ## 或 --- 为止。"""
    lines = strip_frontmatter(text).splitlines()
    start = None
    for i, line in enumerate(lines):
        if line.startswith("#") and ("口播" in line or "逐字稿" in line):
            start = i + 1
            break
    if start is None:
        return "\n".join(lines)
    out = []
    for line in lines[start:]:
        s = line.strip()
        if s.startswith("## ") or s == "---":
            break
        out.append(line)
    return "\n".join(out)


def scan(src: str, whole: bool):
    hits = []
    for i, line in enumerate(src.splitlines(), 1):
        s = line.strip()
        if not s:
            continue
        if not whole and (s.startswith("#") or s.startswith("|") or s.startswith("```")
                          or s.startswith("- ") or s.startswith("* ") or s.startswith("> ")):
            continue
        if "：" in s or re.search(r"(?<!\d):(?!\d)", s):
            hits.append((i, "禁用标点·冒号", s))
        if "——" in s or "—" in s:
            hits.append((i, "禁用标点·破折号", s))
        for p in HARD_PHRASES:
            if p in s:
                hits.append((i, f"禁用词·{p}", s))
        for m in METAPHORS:
            if m in s:
                hits.append((i, f"慎用借喻·{m}", s))
        if re.search(r"不是[^，。]{1,12}[，,]\s*而是", s):
            hits.append((i, "禁用句式·不是…而是", s))
        if re.search(r"(不能|不会|不是)[^，。]{1,10}[，,]\s*(而是|是)", s):
            hits.append((i, "疑似否定平行", s))
    return hits


def main():
    if len(sys.argv) < 2:
        print("用法: python3 工具/check_ai.py 文件.md [--all]")
        return
    path = sys.argv[1]
    whole = "--all" in sys.argv
    text = open(path, encoding="utf-8").read()
    src = strip_frontmatter(text) if whole else oral_block(text)
    hits = scan(src, whole)
    print(f"# {path}")
    if not hits:
        print("0 处命中")
        return
    print(f"{len(hits)} 处命中\n")
    for i, rule, s in hits:
        print(f"第 {i} 行 [{rule}]")
        print(f"  {s}")


if __name__ == "__main__":
    main()
