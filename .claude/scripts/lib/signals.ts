/**
 * Signal definitions for the classify-message hook.
 *
 * Architecture: data-driven signal matching. Each signal has a list of trigger
 * patterns checked via regex with Latin-letter lookarounds (not \b). Words can
 * appear in multiple signals (explicit overlaps) because the cost of a false
 * positive hint is ~0 (the agent ignores irrelevant hints) while a false
 * negative means missed routing.
 *
 * Patterns include English and Simplified Chinese.
 */

export type Signal = {
	readonly name: string;
	readonly message: string;
	readonly patterns: readonly string[];
};

export const SIGNALS: readonly Signal[] = [
	{
		name: "IDEA",
		message:
			"IDEA detected — consider writing to 02.笔记/灵感想法/ with proper tags and wikilinks",
		patterns: [
			// English
			"idea",
			"thought of",
			"thinking about",
			"realized",
			"inspiration",
			"brainstorm",
			"what if",
			// Chinese
			"想法",
			"灵感",
			"突然想到",
			"想到一个",
			"有个点子",
			"记一下",
			"随手记",
			"我发现",
			"感悟",
		],
	},
	{
		name: "TASK",
		message:
			"TASK detected — consider adding to 01.每日工作台/今日任务/ as a checklist item",
		patterns: [
			// English
			"todo",
			"task",
			"need to",
			"have to",
			"should do",
			"must do",
			"don't forget",
			"remember to",
			"plan to",
			// Chinese
			"要干",
			"要做",
			"得做",
			"别忘了",
			"待办",
			"任务",
			"计划",
			"今天要",
			"明天要",
			"安排",
			"日程",
		],
	},
	{
		name: "MATERIAL",
		message:
			"MATERIAL detected — consider saving to 03.素材库/文章收藏/ (articles), 金句语录/ (quotes), or 案例参考/ (cases) with source and summary",
		patterns: [
			// English
			"saved",
			"collected",
			"bookmark",
			"found this",
			"read this",
			"saw this",
			"interesting article",
			"good resource",
			// Chinese
			"存一下",
			"收藏",
			"看到一篇",
			"看到一个",
			"好文章",
			"素材",
			"资料",
			"这个不错",
			"分享一下",
			"转载",
			"金句",
			"这句话",
			"案例",
		],
	},
	{
		name: "BUSINESS",
		message:
			"BUSINESS context detected — consider writing to 04.业务/项目管理/ (projects), 客户档案/ (clients), or 财务记录/ (finance), and linking to relevant notes",
		patterns: [
			// English
			"client",
			"customer",
			"project",
			"revenue",
			"contract",
			"meeting with",
			"deadline",
			"deliverable",
			// Chinese
			"客户",
			"项目",
			"合同",
			"收入",
			"营收",
			"交付",
			"deadline",
			"合作",
			"报价",
			"签约",
			"业务",
			"收入",
			"支出",
			"记账",
			"利润",
			"成本",
		],
	},
	{
		name: "PERSONAL",
		message:
			"PERSONAL context detected — consider writing to 05.个人/日记感悟/ (journal), 目标计划/ (goals), or 健康记录/ (health)",
		patterns: [
			// English
			"today i",
			"feeling",
			"mood",
			"journal",
			"diary",
			"personal",
			"family",
			"health",
			"growth",
			// Chinese
			"今天",
			"心情",
			"日记",
			"记录一下",
			"生活",
			"家庭",
			"健康",
			"成长",
			"读书",
			"运动",
			"感悟生活",
			"体重",
			"睡眠",
			"饮食",
		],
	},
	{
		name: "LEARN",
		message:
			"LEARN context detected — consider writing to 02.笔记/学习笔记/ with source, key takeaways, and wikilinks",
		patterns: [
			// English
			"learned",
			"studying",
			"course",
			"lecture",
			"reading notes",
			"textbook",
			// Chinese
			"学习",
			"课程",
			"上课",
			"看书",
			"读书笔记",
			"知识点",
			"复习",
			"考点",
		],
	},
	{
		name: "MEETING",
		message:
			"MEETING context detected — consider writing to 02.笔记/会议记录/ with attendees, key points, and action items",
		patterns: [
			// English
			"meeting",
			"call with",
			"sync",
			"standup",
			"1:1",
			// Chinese
			"开会",
			"会议",
			"沟通",
			"讨论",
			"会议纪要",
			"开会记录",
		],
	},
	{
		name: "DECISION",
		message:
			"DECISION detected — consider logging in brain/Key Decisions.md with rationale and date",
		patterns: [
			// English
			"decided",
			"chose",
			"agreed to",
			"going with",
			"final call",
			"made up my mind",
			// Chinese
			"决定了",
			"选定了",
			"确定",
			"最终选择",
			"拍板",
			"敲定",
		],
	},
	{
		name: "GOAL",
		message:
			"GOAL context detected — consider updating brain/North Star.md or 05.个人/目标计划/ with the new direction or target",
		patterns: [
			// English
			"my goal",
			"target",
			"objective",
			"new year resolution",
			"i want to achieve",
			"working towards",
			"long term",
			// Chinese
			"目标",
			"方向",
			"今年要",
			"想要达到",
			"长期目标",
			"年度目标",
			"月度目标",
			"计划达成",
			"习惯",
		],
	},
];
