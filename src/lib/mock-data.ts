import type { ExerciseQuestion, GrammarPoint, PhoneticItem, ScenarioItem, SentenceItem, WordItem } from "@/types/learning";

const basicPairs = [
  ["ability", "能力"], ["accept", "接受"], ["active", "积极的"], ["address", "地址；处理"], ["advice", "建议"],
  ["agree", "同意"], ["allow", "允许"], ["almost", "几乎"], ["answer", "回答"], ["appear", "出现"],
  ["arrive", "到达"], ["attention", "注意力"], ["basic", "基础的"], ["believe", "相信"], ["borrow", "借入"],
  ["break", "休息；打破"], ["bright", "明亮的"], ["budget", "预算"], ["cancel", "取消"], ["careful", "仔细的"],
  ["choice", "选择"], ["clear", "清楚的"], ["collect", "收集"], ["common", "常见的"], ["compare", "比较"],
  ["complete", "完成"], ["concern", "担心；关注"], ["connect", "连接"], ["continue", "继续"], ["correct", "正确的"],
  ["daily", "每日的"], ["decide", "决定"], ["deliver", "交付"], ["depend", "取决于"], ["describe", "描述"],
  ["detail", "细节"], ["develop", "发展"], ["different", "不同的"], ["direct", "直接的"], ["discuss", "讨论"],
  ["early", "早的"], ["effort", "努力"], ["enough", "足够的"], ["example", "例子"], ["expect", "期待"],
  ["explain", "解释"], ["finish", "完成"], ["focus", "专注"], ["follow", "跟随；遵守"], ["forget", "忘记"],
  ["forward", "向前"], ["friendly", "友好的"], ["future", "未来"], ["improve", "提升"], ["include", "包含"],
  ["increase", "增加"], ["interest", "兴趣"], ["language", "语言"], ["listen", "听"], ["manage", "管理"],
  ["matter", "事情；要紧"], ["message", "消息"], ["minute", "分钟"], ["mistake", "错误"], ["natural", "自然的"],
  ["notice", "注意到"], ["office", "办公室"], ["practice", "练习"], ["prepare", "准备"], ["problem", "问题"],
  ["progress", "进步"], ["quick", "快的"], ["reason", "原因"], ["remember", "记住"], ["repeat", "重复"],
  ["result", "结果"], ["review", "复习"], ["simple", "简单的"], ["slowly", "慢慢地"], ["support", "支持"],
  ["useful", "有用的"], ["usually", "通常"], ["value", "价值"], ["workday", "工作日"], ["write", "写"],
];

const categoryPairs: Record<WordItem["category"], string[][]> = {
  basic: basicPairs,
  workplace: [
    ["agenda", "议程"], ["alignment", "对齐共识"], ["approval", "批准"], ["briefing", "简报"], ["deadline", "截止日期"],
    ["feedback", "反馈"], ["handover", "交接"], ["meeting", "会议"], ["onboarding", "入职"], ["priority", "优先级"],
    ["proposal", "提案"], ["remote", "远程的"], ["report", "报告"], ["request", "请求"], ["schedule", "日程"],
    ["stakeholder", "相关方"], ["summary", "总结"], ["task", "任务"], ["update", "更新"], ["workflow", "工作流"],
  ],
  testing: [
    ["assertion", "断言"], ["automation", "自动化"], ["baseline", "基线"], ["bug", "缺陷"], ["coverage", "覆盖率"],
    ["defect", "缺陷"], ["environment", "环境"], ["failure", "失败"], ["fixture", "测试夹具"], ["mock", "模拟数据"],
    ["regression", "回归"], ["release", "发布"], ["reproduce", "复现"], ["scenario", "场景"], ["screenshot", "截图"],
    ["severity", "严重程度"], ["smoke", "冒烟测试"], ["testcase", "测试用例"], ["validation", "验证"], ["workflow", "流程"],
  ],
  finance: [
    ["asset", "资产"], ["bond", "债券"], ["broker", "券商"], ["capital", "资本"], ["dividend", "股息"],
    ["equity", "权益"], ["exchange", "交易所"], ["fund", "基金"], ["index", "指数"], ["inflation", "通胀"],
    ["interest", "利息"], ["liquidity", "流动性"], ["market", "市场"], ["portfolio", "投资组合"], ["profit", "利润"],
    ["rate", "利率"], ["revenue", "营收"], ["risk", "风险"], ["security", "证券"], ["volatility", "波动率"],
  ],
  commerce: [
    ["cart", "购物车"], ["catalog", "商品目录"], ["checkout", "结账"], ["coupon", "优惠券"], ["customs", "海关"],
    ["delivery", "配送"], ["discount", "折扣"], ["fulfillment", "履约"], ["inventory", "库存"], ["listing", "商品刊登"],
    ["logistics", "物流"], ["merchant", "商家"], ["order", "订单"], ["payment", "支付"], ["refund", "退款"],
    ["review", "评价"], ["shipment", "货运"], ["supplier", "供应商"], ["tracking", "物流追踪"], ["warehouse", "仓库"],
  ],
};

export const words: WordItem[] = Object.entries(categoryPairs).flatMap(([category, entries]) =>
  entries.map(([word, meaning], index) => ({
    id: `${category}-${index + 1}`,
    word,
    phonetic: `/${word.slice(0, 2)}-${word.slice(2, 5) || "ə"}/`,
    meaning,
    category: category as WordItem["category"],
    example: `I can use "${word}" in a simple workday sentence.`,
    exampleCn: `我可以把“${meaning}”用在一个简单的工作日句子里。`,
  })),
);

export const grammarPoints: GrammarPoint[] = [
  ["一般现在时", "描述习惯、事实或规律，主语为第三人称单数时动词常加 s。", "She reviews five words every morning.", "她每天早上复习五个单词。"],
  ["一般过去时", "描述过去发生并结束的动作，动词使用过去式。", "I joined the meeting at nine.", "我九点参加了会议。"],
  ["现在进行时", "描述正在发生的动作，结构为 be + doing。", "I am practicing pronunciation now.", "我现在正在练习发音。"],
  ["现在完成时", "强调过去动作对现在的影响，结构为 have/has + done。", "I have finished today's plan.", "我已经完成了今天的计划。"],
  ["一般将来时", "描述未来计划或预测，常用 will 或 be going to。", "I will review the lesson tonight.", "我今晚会复习这节课。"],
  ["情态动词 can", "表达能力、许可或可能性，后接动词原形。", "I can explain the problem simply.", "我能简单解释这个问题。"],
  ["should 建议", "表达建议或适当做法，语气温和。", "You should take a short break.", "你应该短暂休息一下。"],
  ["there be 句型", "表达某处有某物或某事。", "There is a note on the desk.", "桌上有一张便签。"],
  ["可数名词复数", "可数名词表示多个时通常加 s 或 es。", "I learned three phrases today.", "我今天学了三个短语。"],
  ["不可数名词", "不可数名词通常不直接加复数。", "This advice is useful.", "这个建议很有用。"],
  ["比较级", "比较两者差异，常用 -er 或 more。", "This sentence is clearer than that one.", "这个句子比那个更清楚。"],
  ["最高级", "比较三者及以上，常用 -est 或 most。", "This is the most useful phrase.", "这是最有用的短语。"],
  ["宾语从句", "一个句子作宾语，常由 that/if/what 引导。", "I know that practice matters.", "我知道练习很重要。"],
  ["原因状语从句", "用 because/as/since 表示原因。", "I study because I want progress.", "我学习是因为我想进步。"],
  ["条件状语从句", "用 if 表示条件，主将从现很常见。", "If I have time, I will review.", "如果我有时间，我会复习。"],
  ["动名词作主语", "动词 ing 形式可以作主语。", "Listening every day helps.", "每天听一点有帮助。"],
  ["不定式作目的", "to do 可以表达目的。", "I write notes to remember words.", "我写笔记是为了记单词。"],
  ["被动语态", "强调动作承受者，结构为 be + done。", "The report was updated yesterday.", "报告昨天被更新了。"],
  ["祈使句", "用于建议、请求或指令，常省略主语。", "Please check the details.", "请检查细节。"],
  ["频率副词", "always/usually/often/sometimes 表示频率。", "I usually study after dinner.", "我通常晚饭后学习。"],
].map(([title, rule, example, translation], index) => ({ id: `grammar-${index + 1}`, title, rule, example, translation }));

export const phonetics: PhoneticItem[] = [
  ["/i:/", "嘴角向两侧拉长，声音拉长。", ["see", "team", "need"]],
  ["/ɪ/", "短促放松，像 sit 中的 i。", ["sit", "busy", "minute"]],
  ["/e/", "口型自然打开，声音短。", ["bed", "desk", "help"]],
  ["/æ/", "嘴巴张大，舌位低。", ["cat", "plan", "practice"]],
  ["/ɑ:/", "口腔打开，声音较长。", ["car", "start", "market"]],
  ["/ʌ/", "短促有力，像 cup。", ["cup", "budget", "update"]],
  ["/ɔ:/", "圆唇，声音拉长。", ["talk", "order", "support"]],
  ["/u:/", "双唇收圆，声音拉长。", ["blue", "rule", "improve"]],
  ["/ə/", "弱读常见音，轻而短。", ["about", "again", "grammar"]],
  ["/eɪ/", "从 e 滑向 i。", ["day", "make", "schedule"]],
  ["/aɪ/", "从 a 滑向 i。", ["time", "write", "priority"]],
  ["/ɔɪ/", "从 ɔ 滑向 i。", ["choice", "voice", "join"]],
  ["/p/", "双唇爆破，清辅音。", ["plan", "practice", "progress"]],
  ["/b/", "双唇爆破，浊辅音。", ["basic", "budget", "borrow"]],
  ["/t/", "舌尖轻触上齿龈爆破。", ["task", "today", "testing"]],
  ["/d/", "对应 t 的浊辅音。", ["daily", "decide", "deadline"]],
  ["/k/", "舌后部爆破，清辅音。", ["clear", "correct", "catalog"]],
  ["/g/", "对应 k 的浊辅音。", ["good", "grammar", "agree"]],
  ["/θ/", "舌尖轻放上下齿间，送气。", ["think", "three", "thanks"]],
  ["/ð/", "舌尖轻放上下齿间，带声。", ["this", "that", "there"]],
].map(([symbol, tip, words], index) => ({ id: `phonetic-${index + 1}`, symbol: symbol as string, tip: tip as string, words: words as string[] }));

export const sentences: SentenceItem[] = [
  ["Let me check the details first.", "我先确认一下细节。", "职场沟通"],
  ["Could you say that again, please?", "你可以再说一遍吗？", "听不清"],
  ["I need a few more minutes.", "我还需要几分钟。", "时间管理"],
  ["That makes sense to me.", "我觉得这说得通。", "会议反馈"],
  ["I will get back to you later.", "我稍后回复你。", "邮件沟通"],
  ["Can we move this to tomorrow?", "我们可以把这个挪到明天吗？", "日程调整"],
  ["I am still working on it.", "我还在处理这件事。", "进度说明"],
  ["Here is a quick summary.", "这里是一个简短总结。", "汇报"],
  ["I am not sure yet.", "我现在还不确定。", "谨慎表达"],
  ["Let's keep it simple.", "我们先保持简单。", "协作"],
  ["I agree with this direction.", "我同意这个方向。", "讨论"],
  ["What is the main problem?", "主要问题是什么？", "问题定位"],
  ["I made a small mistake.", "我犯了一个小错误。", "自我修正"],
  ["Thanks for your patience.", "谢谢你的耐心。", "礼貌表达"],
  ["This part is clear now.", "这部分现在清楚了。", "确认理解"],
  ["I need to review it again.", "我需要再复习一遍。", "学习"],
  ["Could you give me an example?", "你能给我一个例子吗？", "提问"],
  ["I will try another way.", "我会试试另一种方法。", "解决问题"],
  ["It is better than before.", "这比之前好多了。", "进步反馈"],
  ["I can start with the basics.", "我可以从基础开始。", "低压学习"],
  ["The meeting starts at ten.", "会议十点开始。", "日程"],
  ["Please send me the file.", "请把文件发给我。", "文件协作"],
  ["I forgot the exact word.", "我忘了准确的单词。", "表达卡顿"],
  ["This phrase is useful.", "这个短语很实用。", "学习反馈"],
  ["I prefer a short plan.", "我更喜欢简短计划。", "计划"],
  ["Let's review the key points.", "我们复盘一下重点。", "复盘"],
  ["I need more practice.", "我需要更多练习。", "自我评估"],
  ["The deadline is close.", "截止日期快到了。", "工作提醒"],
  ["I feel more confident now.", "我现在更有信心了。", "成长"],
  ["Small steps still count.", "小步前进也算数。", "鼓励"],
].map(([en, cn, scene], index) => ({ id: `sentence-${index + 1}`, en, cn, scene }));

export const exercises: ExerciseQuestion[] = Array.from({ length: 20 }, (_, index) => {
  const base = [
    ["I usually ___ after dinner.", ["study", "studies", "studied", "studying"], "study", "主语是 I，一般现在时用动词原形。"],
    ["She ___ five words every day.", ["review", "reviews", "reviewed", "reviewing"], "reviews", "第三人称单数一般现在时，动词加 s。"],
    ["Could you ___ that again?", ["say", "says", "said", "saying"], "say", "情态动词 could 后接动词原形。"],
    ["I have ___ today's task.", ["finish", "finishes", "finished", "finishing"], "finished", "现在完成时使用 have + 过去分词。"],
  ][index % 4];
  return { id: `exercise-${index + 1}`, prompt: base[0] as string, options: base[1] as string[], answer: base[2] as string, explanation: base[3] as string };
});

export const scenarios: ScenarioItem[] = Array.from({ length: 15 }, (_, index) => {
  const titles = ["会议开场", "询问进度", "邮件确认", "延期说明", "需求澄清", "线上面试", "客户支持", "订酒店", "机场问路", "跨境订单", "复盘总结", "请求帮助", "电话沟通", "演示介绍", "下班学习"];
  return {
    id: `scenario-${index + 1}`,
    title: titles[index],
    context: `${titles[index]}场景下的低压力表达训练。`,
    lines: [
      { en: "Could you help me with this part?", cn: "你可以帮我看一下这部分吗？" },
      { en: "I want to make sure I understand it correctly.", cn: "我想确认我理解正确。" },
      { en: "Thanks, that is much clearer now.", cn: "谢谢，现在清楚多了。" },
    ],
  };
});
