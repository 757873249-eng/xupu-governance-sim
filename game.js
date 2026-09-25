const metricDefs={safety:{label:'公共安全',color:'#bd3b2d'},trust:{label:'群众信任',color:'#2d6652'},order:{label:'治理进度',color:'#356a78'},equity:{label:'利益公平',color:'#c39742'},capacity:{label:'长效能力',color:'#5f587d'}};
const initial={day:1,event:0,selected:null,demolition:0,energy:82,budget:76,metrics:{safety:24,trust:41,order:12,equity:45,capacity:20},stakeholders:{villagers:48,tenants:40,business:35,cadres:72},zones:{enterprise:0,housing:0,riverbank:0,market:0},logs:[]};
let state=JSON.parse(JSON.stringify(initial));
const events=[
{tag:'顶层研判',icon:'令',title:'第一枪打在哪里？',text:'市委调研后，区里要求尽快形成可推广的整治方案。许浦村的问题相互缠绕，先处理哪一项将决定后续节奏。',voice:['区级负责人','既要看见风险，也要看见每项风险背后的人。'],source:'案例材料与公开报道',choices:[
{t:'集中摸底，建立三张清单',d:'先做全覆盖测量、责任分工和风险排序，再分组进场。',cost:'耗时 +2天',days:4,fx:{order:7,trust:3,capacity:8,budget:-5,energy:-4}},
{t:'先拆村口大型违建',d:'快速形成可见成果，向全村释放执行信号。',cost:'冲突风险',days:3,fx:{order:12,safety:5,trust:-5,equity:-2,energy:-8},zone:'enterprise',demo:3.2},
{t:'先治理河道与消防隐患',d:'从群众感受最强的公共风险切入。',cost:'财政 -8',days:5,fx:{safety:13,trust:6,order:4,budget:-8},zone:'riverbank',demo:1.8}]},
{tag:'组织动员',icon:'众',title:'村干部自己也有违建',text:'村民明确表示，老板和干部先拆，普通村民才愿意跟进。村干部家庭的出租房也是重要收入来源。',voice:['普通村民','规矩要一样，不能只挑普通人下手。'],source:'新华社与共产党员网报道',choices:[
{t:'党员干部与村集体先行自拆',d:'公开申报，全程公示，违建情况纳入干部考核。',cost:'干部压力 +12',days:4,fx:{trust:17,equity:12,order:9,energy:-12,capacity:5},zone:'housing',demo:4.5,cadre:-7},
{t:'所有对象同步拆除',d:'采用统一日期和统一标准，避免身份差异。',cost:'组织压力',days:3,fx:{trust:5,equity:8,order:10,energy:-9},demo:5},
{t:'先劝村民，干部后续处理',d:'降低短期组织阻力，但容易引发公平性质疑。',cost:'信任 -16',days:3,fx:{order:6,trust:-16,equity:-13,energy:-3},demo:2.8}]},
{tag:'干部现场',icon:'夜',title:'连续工作进入第三周',text:'专班每天早上交班、下午总结，每周讲评。多名干部取消休假，疲劳正在累积，一户重点对象仍拒绝签约。',voice:['工作组成员','今天再去一次。他不信文件，但也许愿意听亲友说。'],source:'解放日报与新华社报道',choices:[
{t:'轮班休整，同时保留一线骨干',d:'降低疲劳失误，整治速度会暂时放慢。',cost:'进度 -3',days:5,fx:{energy:18,order:-3,trust:3,capacity:6}},
{t:'继续全员 5+2 工作制',d:'保持高压推进，干部健康和程序质量承压。',cost:'精力 -20',days:3,fx:{energy:-20,order:14,safety:-3,trust:-2},demo:6.2},
{t:'组建疑难户专组',d:'干部、律师和熟悉村情者共同反复入户。',cost:'财政 -5',days:5,fx:{energy:-7,budget:-5,trust:11,order:8,capacity:5},demo:3.8}]},
{tag:'法律程序',icon:'法',title:'房东同意，租户拒绝搬离',text:'违建出租人与租户的关系涉及合同、押金、设备和搬迁期限。剩余疑难个案已经影响整体进度。',voice:['外来租户','我知道房子有问题，可工作和孩子上学都在附近。'],source:'上海律师行业资料',choices:[
{t:'律师入组，一户一案协商清退',d:'提供规范文本、法律解释和合理搬离期限。',cost:'财政 -7',days:6,fx:{trust:12,equity:13,capacity:10,budget:-7,order:3},tenant:10},
{t:'统一期限，逾期依法强制清退',d:'进度可控，租户承受较大生活冲击。',cost:'租户压力',days:3,fx:{order:14,safety:5,trust:-9,equity:-14,energy:-5},demo:6.5,tenant:-15},
{t:'由房东自行解决租赁纠纷',d:'政府减少直接介入，但容易拖延并转移风险。',cost:'不确定性',days:5,fx:{order:-2,trust:-6,equity:-6,budget:3},tenant:-6}]},
{tag:'企业攻坚',icon:'企',title:'大型企业主发出威胁',text:'一处五千余平方米的违建厂房拒绝腾退。企业主强调长期合同和员工生计，并扬言报复工作人员。',voice:['企业主','合同签了二十年，机器、工人、订单怎么办？'],source:'新华社报道与案例材料',choices:[
{t:'联合执法，先核实再依法拆除',d:'公安、规土、城管、消防和律师共同进场，公开依据。',cost:'精力 -10',days:5,fx:{safety:13,order:14,trust:5,equity:4,energy:-10,budget:-5},zone:'enterprise',demo:8.5,business:-10},
{t:'延长企业搬迁期并协助对接园区',d:'保护就业和设备，但会拖慢整体计划。',cost:'耗时 +8天',days:8,fx:{trust:8,equity:12,order:-3,budget:-9,capacity:4},business:12},
{t:'立即实施强制拆除',d:'迅速推进，也可能引发程序和安全争议。',cost:'高冲突',days:2,fx:{order:18,safety:-6,trust:-15,equity:-10,energy:-13},zone:'enterprise',demo:10,business:-18}]},
{tag:'利益缓冲',icon:'衡',title:'村民失去主要租金收入',text:'一些家庭长期依靠违建出租维持生活。拆除合法，但收入骤降可能削弱配合，也会影响后续村庄治理。',voice:['本地村民','环境当然要好，可我们今后的日子怎么过？'],source:'案例材料',choices:[
{t:'材料回购加集体资产转型方案',d:'给予合规的材料处置费用，并公布长期增收计划。',cost:'财政 -14',days:5,fx:{trust:14,equity:15,budget:-14,capacity:10},villager:14},
{t:'只按统一标准支付处置费用',d:'标准清晰，财政可控，长期生计仍未解决。',cost:'财政 -7',days:3,fx:{trust:4,equity:3,budget:-7,order:4},villager:2},
{t:'不提供任何经济缓冲',d:'强调违法收益不受保护，短期节省资金。',cost:'信任 -18',days:2,fx:{budget:7,trust:-18,equity:-13,order:5},villager:-17}]},
{tag:'舆情现场',icon:'报',title:'媒体要求进入整治现场',text:'社会关注迅速升温。公开报道可以增加透明度，也可能放大程序瑕疵和个体冲突。',voice:['记者','公众想知道，拆了以后谁受益，困难群体怎么办？'],source:'许浦日记与主流媒体报道',choices:[
{t:'开放现场，发布进度与争议处理',d:'允许采访村民、租户和干部，持续公开数据。',cost:'舆情波动',days:3,fx:{trust:11,capacity:6,equity:4,energy:-3}},
{t:'只发布统一通稿',d:'信息集中稳定，但透明度和可信度较低。',cost:'信任 -4',days:2,fx:{order:3,trust:-4,budget:1}},
{t:'暂缓媒体进入',d:'减少现场干扰，也可能引起外界猜测。',cost:'合法性压力',days:2,fx:{trust:-9,energy:3}}]},
{tag:'突发善后',icon:'!',title:'拆除后水管爆裂',text:'夜间拆除区域出现水管破裂和电线短路，附近居民要求立即恢复。工作组必须在进度和善后之间调配人手。',voice:['附近居民','拆违是政府的事，停水停电却落在我们头上。'],source:'案例材料中的善后机制',choices:[
{t:'暂停该片区，善后组连夜抢修',d:'及时修复并公开说明事故原因。',cost:'耗时 +3天',days:4,fx:{safety:9,trust:10,order:-3,energy:-7,budget:-5}},
{t:'继续拆除，由村里后续维修',d:'保持进度，但居民直接承受不便。',cost:'信任 -10',days:2,fx:{order:9,trust:-10,safety:-6,energy:-3},demo:5.5},
{t:'外包抢修并继续推进',d:'兼顾速度，需要额外财政支出和现场协调。',cost:'财政 -11',days:3,fx:{order:6,safety:7,trust:5,budget:-11,energy:-3},demo:4}]},
{tag:'空间修复',icon:'水',title:'违建拆了，空地怎么用？',text:'腾出的空间可能成为停车场、绿地、防汛通道，也可能被重新出租。空间用途将决定治理成果由谁享有。',voice:['规划人员','拆除只是清场，新的公共空间才是居民每天能感受到的结果。'],source:'许浦日记与案例材料',choices:[
{t:'河道修复、公共绿地和停车场',d:'优先补足公共设施，土地直接收益较低。',cost:'财政 -13',days:7,fx:{safety:12,trust:14,equity:10,budget:-13,capacity:8},zone:'riverbank'},
{t:'引入合规企业发展集体经济',d:'增加长期收入，但公共空间改善有限。',cost:'公平争议',days:6,fx:{budget:12,capacity:9,trust:2,equity:-4},business:9},
{t:'公共设施与经营空间混合配置',d:'兼顾收益与使用需求，规划协商更复杂。',cost:'耗时 +8天',days:8,fx:{trust:9,equity:9,capacity:13,budget:-5},villager:5,business:5}]},
{tag:'人口治理',icon:'居',title:'低价住房快速减少',text:'一万余名租户搬离后，周边企业仍需要大量劳动者。现有租金明显上涨，新的居住压力正在邻近地区出现。',voice:['企业员工','厂还在附近，便宜房却越来越远。每天通勤怎么办？'],source:'案例材料中的租户访谈',choices:[
{t:'协调合规宿舍和租赁房源',d:'把基本居住需求纳入整治后安排。',cost:'财政 -10',days:6,fx:{equity:16,trust:9,capacity:9,budget:-10},tenant:17},
{t:'提供短期搬迁信息服务',d:'帮助租户寻找房源，政府投入较低。',cost:'效果有限',days:3,fx:{equity:6,trust:4,budget:-3},tenant:6},
{t:'将居住问题交给市场调节',d:'整治任务更集中，租户可能继续外迁。',cost:'公平 -13',days:2,fx:{order:5,equity:-13,trust:-6,budget:3},tenant:-16}]},
{tag:'治理移交',icon:'村',title:'专班即将撤离',text:'集中整治接近完成。镇级力量撤离后，新增违建、环境维护和人口服务将重新交给村级组织。',voice:['村干部','靠几百人驻村能打赢一仗，日常管理只能靠村里自己。'],source:'案例材料与后续报道',choices:[
{t:'村规民约、网格巡查与多方监督',d:'将控违、保洁和问题发现纳入日常制度。',cost:'财政 -7',days:5,fx:{capacity:18,trust:8,equity:6,budget:-7,energy:5}},
{t:'保留镇级常驻小组一年',d:'保持执行强度，但村级自主能力成长较慢。',cost:'财政 -12',days:4,fx:{capacity:8,order:7,budget:-12,energy:-5}},
{t:'完成任务后立即撤离',d:'节省资源，反弹风险较高。',cost:'长效能力 -14',days:2,fx:{budget:8,capacity:-14,order:4}}]},
{tag:'公共价值',icon:'民',title:'最后一次专班会议',text:'数字显示任务基本完成。现在需要向全体居民说明，这场治理创造了什么，又留下了什么。',voice:['会议主持人','拆除面积能够交卷，群众日后的生活才决定这份答卷能保存多久。'],source:'基于公共价值理论的教学情境',choices:[
{t:'公布公共价值报告与未解问题',d:'同时呈现环境、安全、成本分配和后续承诺。',cost:'接受监督',days:2,fx:{trust:12,equity:9,capacity:9}},
{t:'突出速度、面积和干部担当',d:'集中展示行动绩效，社会代价呈现较少。',cost:'评价单一',days:1,fx:{order:7,trust:1,equity:-6}},
{t:'交由第三方开展一年后评估',d:'延迟最终结论，持续跟踪居民和租户处境。',cost:'财政 -5',days:3,fx:{capacity:13,equity:12,trust:7,budget:-5}}]}
];
const $=s=>document.querySelector(s), clamp=n=>Math.max(0,Math.min(100,n));
function init(){renderMetrics();renderStakeholders();loadEvent();bind();}
function bind(){ $('#startBtn').onclick=()=>{$('#introScreen').classList.remove('active');$('#gameScreen').classList.add('active')}; $('#restartBtn').onclick=restart; $('#confirmBtn').onclick=confirmChoice; $('#sourcesBtn').onclick=()=>openModal('sourcesModal'); $('#logBtn').onclick=()=>{renderLogs();openModal('logModal')}; document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModals); $('#modalBackdrop').onclick=closeModals; document.querySelectorAll('.zone').forEach(z=>z.onclick=()=>showZone(z.dataset.zone)); $('#soundBtn').onclick=e=>{e.currentTarget.classList.toggle('muted');e.currentTarget.textContent=e.currentTarget.classList.contains('muted')?'○':'◉'}}
function renderMetrics(){const el=$('#metrics');el.innerHTML='';Object.entries(metricDefs).forEach(([k,d])=>{el.innerHTML+=`<div class="metric"><div class="metric-head"><span>${d.label}</span><b>${state.metrics[k]}</b></div><div class="metric-bar"><i style="width:${state.metrics[k]}%;background:${d.color}"></i></div><small>${metricHint(k,state.metrics[k])}</small></div>`});$('#energyValue').textContent=state.energy;$('#budgetValue').textContent=state.budget;$('#energyBar').style.width=state.energy+'%';$('#budgetBar').style.width=state.budget+'%';$('#dayValue').textContent=state.day;$('#dayProgress').style.width=Math.min(100,state.day/70*100)+'%';$('#demolitionValue').textContent=state.demolition.toFixed(1);$('#logCount').textContent=state.logs.length;$('#phaseName').textContent=state.event<3?'摸底与定策':state.event<8?'集中攻坚':state.event<11?'修复与移交':'公共价值评估'}
function metricHint(k,v){const h={safety:['隐患集中','风险下降','基本可控'],trust:['质疑较多','谨慎支持','主动配合'],order:['刚刚启动','持续推进','接近完成'],equity:['成本失衡','仍有争议','较为兼顾'],capacity:['依赖专班','制度成形','常态运行']};return h[k][v<40?0:v<70?1:2]}
function renderStakeholders(){const defs={villagers:['本地村民','租金与环境'],tenants:['外来租户','住房与就业'],business:['企业商户','合同与搬迁'],cadres:['基层干部','执行与压力']};$('#stakeholderStrip').innerHTML=Object.entries(defs).map(([k,v])=>`<div class="stakeholder"><span>${v[0]}</span><b>${state.stakeholders[k]}</b><small>${v[1]}</small><i class="mood">${state.stakeholders[k]>65?'●':state.stakeholders[k]>40?'◐':'○'}</i></div>`).join('')}
function loadEvent(){const e=events[state.event];if(!e)return finish();state.selected=null;$('#confirmBtn').disabled=true;$('#eventTag').textContent=e.tag;$('#eventNumber').textContent=String(state.event+1).padStart(2,'0')+' / '+events.length;$('#eventIcon').textContent=e.icon;$('#eventSource').textContent=e.source;$('#eventTitle').textContent=e.title;$('#eventText').textContent=e.text;$('#voices').innerHTML=`<div class="voice"><b>${e.voice[0]}</b>：${e.voice[1]}</div>`;$('#choiceList').innerHTML=e.choices.map((c,i)=>`<button class="choice" data-i="${i}"><b>${c.t}</b><small>${c.d}</small><span class="cost">${c.cost}</span></button>`).join('');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>selectChoice(+b.dataset.i));}
function selectChoice(i){state.selected=i;document.querySelectorAll('.choice').forEach((b,j)=>b.classList.toggle('selected',i===j));$('#confirmBtn').disabled=false}
function confirmChoice(){const e=events[state.event],c=e.choices[state.selected];state.day+=c.days||2;state.demolition=Math.min(57.2,state.demolition+(c.demo||Math.max(1,(c.fx.order||0)/4)));Object.entries(c.fx).forEach(([k,v])=>{if(k==='energy'||k==='budget')state[k]=clamp(state[k]+v);else state.metrics[k]=clamp(state.metrics[k]+v)});if(c.zone)state.zones[c.zone]=Math.min(100,state.zones[c.zone]+50);if(c.villager)state.stakeholders.villagers=clamp(state.stakeholders.villagers+c.villager);if(c.tenant)state.stakeholders.tenants=clamp(state.stakeholders.tenants+c.tenant);if(c.business)state.stakeholders.business=clamp(state.stakeholders.business+c.business);if(c.cadre)state.stakeholders.cadres=clamp(state.stakeholders.cadres+c.cadre);state.stakeholders.cadres=clamp(state.stakeholders.cadres+Math.round((c.fx.trust||0)/5)+(c.fx.energy||0)/4);state.logs.unshift({day:state.day,title:e.title,choice:c.t,note:logNote(c.fx)});state.event++;updateZones();renderMetrics();renderStakeholders();document.querySelector('.game-screen').classList.add('shake');setTimeout(()=>document.querySelector('.game-screen').classList.remove('shake'),350);loadEvent()}
function logNote(fx){const sorted=Object.entries(fx).filter(([k])=>metricDefs[k]).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,2);return sorted.map(([k,v])=>`${metricDefs[k].label}${v>0?'提升':'下降'} ${Math.abs(v)}`).join('，')}
function updateZones(){Object.entries(state.zones).forEach(([k,v])=>{const z=document.querySelector(`[data-zone="${k}"]`);if(v>=50)z.classList.add('resolved')});if(state.zones.enterprise>=50)$('#enterpriseRisk').textContent='整治中';if(state.zones.housing>=50)$('#housingRisk').textContent='逐户清退';if(state.zones.riverbank>=50)$('#riverRisk').textContent='修复中';if(state.zones.market>=50)$('#marketRisk').textContent='已清理'}
function showZone(k){const info={enterprise:['企业违建区','历史违法用地、厂房和层层转租集中。'],housing:['民房群租区','村民收入、租户居住与消防安全交织。'],riverbank:['河道沿线','违建侵占防汛通道，污水直排河道。'],market:['无证经营点','经营便利、就业与食品消防风险并存。']}[k];$('#resultContent').innerHTML=`<p class="eyebrow">片区档案</p><h2>${info[0]}</h2><p>${info[1]}</p><div class="result-item"><span>治理程度</span><b>${state.zones[k]}%</b></div>`;openModal('resultModal')}
function finish(){state.demolition=Math.max(state.demolition,Math.min(57.2,state.metrics.order/100*57.2));renderMetrics();const vals=Object.values(state.metrics),avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length),grade=avg>=78?'A':avg>=65?'B':avg>=52?'C':'D';const title=grade==='A'?'兼顾行动与制度':grade==='B'?'完成攻坚，仍需修复':grade==='C'?'速度领先，代价明显':'整治陷入信任危机';$('#resultContent').innerHTML=`<p class="eyebrow">第 ${state.day} 天 · 公共价值报告</p><h2>${title}</h2><div class="result-grade"><strong>${grade}</strong><span>综合公共价值 ${avg} 分<br>拆除进度 ${state.demolition.toFixed(1)} 万平方米</span></div><div class="result-grid">${Object.entries(metricDefs).map(([k,d])=>`<div class="result-item"><span>${d.label}</span><b>${state.metrics[k]}</b></div>`).join('')}</div><p>${endingText()}</p><button class="primary-button" onclick="restart()">再治理一次 <span>↻</span></button>`;openModal('resultModal')}
function endingText(){const m=state.metrics;if(m.order>75&&m.equity<45)return'你完成了高强度整治，但租户、商户和部分村民承担了较高成本。行动绩效突出，公共价值的共享仍需补课。';if(m.capacity>70&&m.trust>65)return'集中行动已经转化为日常制度，群众支持也较稳定。下一步需要用一年后的生活变化检验成果。';if(m.trust<40)return'任务推进削弱了群众信任。法律授权保证行动可以进行，长期治理仍需要可被理解和接受的制度安排。';return'治理在安全、秩序和利益协调之间取得了一定平衡。仍需追踪低收入租户、村民增收和村级组织的持续能力。'}
function renderLogs(){$('#logEntries').innerHTML=state.logs.length?state.logs.map(l=>`<div class="timeline-entry"><small>第 ${l.day} 天</small><b>${l.title}</b><p>决定：${l.choice}。${l.note}</p></div>`).join(''):'<p>尚无决策记录。</p>'}
function openModal(id){$('#modalBackdrop').classList.add('active');$('#'+id).classList.add('active')}function closeModals(){$('#modalBackdrop').classList.remove('active');document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'))}
function restart(){state=JSON.parse(JSON.stringify(initial));closeModals();document.querySelectorAll('.zone').forEach(z=>z.classList.remove('resolved'));renderMetrics();renderStakeholders();loadEvent();$('#introScreen').classList.remove('active');$('#gameScreen').classList.add('active')}
init();
