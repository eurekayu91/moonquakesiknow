/* ============================================
   报告生成逻辑文件
   包含计分算法和报告内容生成
   ============================================ */

// ============================================
// 计分算法：统计 A, B, C, D 出现频率最高的选项
// ============================================
function calculatePersonalityType(answers) {
    // 统计每个选项的出现次数
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    
    answers.forEach(answer => {
        if (counts.hasOwnProperty(answer)) {
            counts[answer]++;
        }
    });
    
    // 找出出现次数最多的选项
    let maxCount = 0;
    let personalityType = 'A';
    
    Object.keys(counts).forEach(key => {
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            personalityType = key;
        }
    });
    
    // 根据最多选项返回对应的人格类型
    const typeMap = {
        'A': 'secure',      // 【恒星系】安全型
        'B': 'anxious',     // 【向日葵】焦虑型
        'C': 'dismissive',  // 【深海鱼】疏离回避型
        'D': 'fearful'      // 【极光】恐惧回避型
    };
    
    return typeMap[personalityType] || 'secure';
}

// ============================================
// 报告内容数据
// ============================================
const reportData = {
    secure: {
        name: "【恒星系】安全型",
        tagline: "恋爱天花板、情绪定海神针、成熟的爱者",
        quote: "我值得被爱，也值得去爱",
        formation: '童年时期，你的主要照顾者提供了稳定且高质量的陪伴。当你哭泣或求助时，他们总能给予及时的回应。这种"被看见"的经历让你确信：我是值得被爱的，他人是可靠的。',
        compatibility: {
            best: "【恒星系】安全型（双向奔赴，最稳稳的幸福）",
            challenge: '【向日葵】焦虑型或【深海鱼】疏离回避型（你是他们的治愈者，但要注意不要产生"助人者情结"而忽视自己的需求）'
        },
        guides: [
            "保持自信，继续在关系中建立健康的边界。",
            '学习识别回避型人格的"推开"动作，不要将其误读为自己的失败。',
            "引导伴侣建立有效的沟通习惯。"
        ]
    },
    anxious: {
        name: "【向日葵】焦虑型",
        tagline: "情感细嗅者、高敏恋人、永远在讨好的孩子",
        quote: "我如此渴望被爱，却总是害怕失去",
        formation: '成长过程中，照顾者对你的态度可能"忽冷忽热"。当你表现得乖巧或情绪爆发时才能获得关注。这导致你对关系的变动极度敏感，总觉得只有不断确认"你还爱我吗"，才能缓解内心的被抛弃感。',
        compatibility: {
            best: "【恒星系】安全型（TA的稳定能接住你的不安）",
            challenge: '【深海鱼】疏离回避型（典型的"追逃模式"，TA越逃你越追，最后双方都精疲力竭）'
        },
        guides: [
            '刻意练习"断联期"：对方不回消息时，强制去做一件让自己专注的事，剥离对 TA 的情绪依赖。',
            "建立自我价值体系：你的价值不取决于伴侣的评价。",
            '直白沟通需求：用"我希望获得一些鼓励"代替"你为什么不关心我"。'
        ]
    },
    dismissive: {
        name: "【深海鱼】疏离回避型",
        tagline: "独立孤岛、亲密恐惧者、冷静的观察家",
        quote: "我筑起高墙，却渴望有人翻越",
        formation: '早期经历中，你的情感需求可能被忽视或被教导要"坚强"。你学会了通过压抑感情、通过"不需要任何人"来保护自己免受伤害。对于你来说，过度亲密意味着失去自由。',
        compatibility: {
            best: "【恒星系】安全型（TA能给你空间，也能让你感到安全）",
            challenge: "【向日葵】焦虑型（TA的黏人会让你感到窒息，诱发你冷暴力消失的防御机制）"
        },
        guides: [
            '48小时预警机制：想消失时，告诉对方"我需要一点个人空间冷静一下，后天我会回来"，这能极大减少冲突。',
            "练习微小的分享：每天分享一件琐事，练习打开坚硬的外壳。",
            '意识到"独处"不是唯一的安全：真正的强大是敢于在关系中展现脆弱。'
        ]
    },
    fearful: {
        name: "【极光】恐惧回避型",
        tagline: "矛盾纠结体、深情与防御共存、碎裂的理想主义者",
        quote: "我渴望拥抱，却又害怕被灼伤",
        formation: "你的童年环境可能带有不可预测的压力。照顾者既是你的避风港，又是你的压力源。这导致你长大后既疯狂渴望亲密，又在对方靠近时因害怕受伤害而表现得冷酷无情。",
        compatibility: {
            best: "【恒星系】安全型（拥有极高耐心和专业素养）",
            challenge: "【极光】恐惧回避型（同类型，两颗易碎的心碰撞，容易造成二次伤害）"
        },
        guides: [
            '觉察内在真音：承认内心的矛盾，当你推开对方时，告诉自己"这只是我在害怕，并不是真的讨厌 TA"。',
            "寻找稳定的锚点：除了爱情，在事业或爱好中寻找确定的掌控感。",
            "长期心理建设：建议通过心理咨询或深度阅读，重塑对他人的基本信任。"
        ]
    }
};

// ============================================
// 生成报告HTML内容
// ============================================
function generateReportHTML(personalityType) {
    const data = reportData[personalityType];
    
    if (!data) {
        return '<div class="text-center text-red-500">报告生成错误</div>';
    }
    
    return `
        <!-- 人格标题和标签 -->
        <div class="text-center mb-8">
            <h1 class="personality-title">${data.name}</h1>
            <p class="personality-tagline">${data.tagline}</p>
            <p class="text-xl text-gray-600 italic mt-4">"${data.quote}"</p>
        </div>
        
        <!-- 形成原因 -->
        <h2 class="report-section-title">形成原因</h2>
        <p class="report-content">${data.formation}</p>
        
        <!-- 恋爱兼容表 -->
        <h2 class="report-section-title">恋爱兼容表</h2>
        <table class="compatibility-table">
            <thead>
                <tr>
                    <th>你是</th>
                    <th>最佳拍档</th>
                    <th>磨合重灾区</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>${data.name}</strong></td>
                    <td>${data.compatibility.best}</td>
                    <td>${data.compatibility.challenge}</td>
                </tr>
            </tbody>
        </table>
        
        <!-- 破局指南 -->
        <h2 class="report-section-title">破局指南</h2>
        <div class="space-y-4">
            ${data.guides.map((guide, index) => `
                <div class="guide-item">
                    <span class="guide-item-number">${index + 1}.</span>
                    <span class="report-content">${guide}</span>
                </div>
            `).join('')}
        </div>
        
        <!-- 底部提示 -->
        <div class="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600">
            <p>这份报告只是开始，真正的成长在于持续的自我觉察和实践。</p>
            <p class="mt-2 text-sm">愿你在爱的路上，遇见更好的自己。</p>
        </div>
    `;
}

// ============================================
// 导出函数供其他文件使用
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePersonalityType,
        generateReportHTML,
        reportData
    };
}
