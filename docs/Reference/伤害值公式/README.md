主角打NPC敌人，打中的情况下：

★普通攻击（用剑砍）：

单元损血数=Max(主角攻击力-敌人防御力,50)

★使用武功攻击：

单元损血数=Max(武功单元攻击力-敌人防御力,50)

Max()函数，是取几个数当中最大的。比如Max(100,50)=100

NPC敌人打主角，打中的情况下：

单元损血数=Max(敌人攻击力-主角防御力,50)