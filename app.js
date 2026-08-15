
const pages=[...document.querySelectorAll('.page')];
function go(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='diagnosis')renderDiag();if(id==='salesMode')renderSalesMode();}

const services=[
 {name:'ドコモ光',type:'光回線',accent:'#2357ff',why:'docomo利用者＋固定回線を希望',good:'スマホとの組み合わせを確認しやすい',check:'1G/10G・提供エリア・電話・TV・手続き区分',word:'「docomoならまず候補に。工事NGならhome 5Gも比較」'},
 {name:'SoftBank 光',type:'光回線',accent:'#64748b',why:'SoftBank利用者＋固定回線を希望',good:'固定回線とスマホ側を一緒に比較',check:'1G/10G・電話・TV・工事・手続き区分',word:'「工事OKなら光、工事NGならAirも比較」'},
 {name:'@nifty光',type:'光回線',accent:'#f4c542',why:'ノジマ店頭で比較提案したい',good:'ノジマグループ回線として提案候補',check:'1G/10G・新規/転用/事業者変更・電話・TV',word:'「今の回線からどう移るかを先に確認」'},
 {name:'auひかり',type:'独自回線',accent:'#f97316',why:'au/UQ利用者＋エリア内',good:'独自回線も含めて比較したい人',check:'提供エリア・建物・工事・電話・撤去条件',word:'「光コラボとは別系統。エリア確認を先に」'},
 {name:'NURO光',type:'独自回線',accent:'#10b981',why:'速度重視＋提供エリア内',good:'速度を重視するお客様の有力候補',check:'戸建/マンション・エリア・工事日程・現行プラン',word:'「速さ重視なら候補。ただし工事とエリア確認」'},
 {name:'ドコモ home 5G',type:'ホームルーター',accent:'#ef4444',why:'工事を避けたいdocomo利用者',good:'工事不要で始めやすい',check:'登録住所・電波状況・端末条件・固定回線との差',word:'「工事NGならまず比較」'},
 {name:'SoftBank Air',type:'ホームルーター',accent:'#0ea5e9',why:'工事を避けたいSoftBank利用者',good:'工事不要で家のWi-Fiを作れる',check:'登録住所・電波状況・端末条件・固定回線との差',word:'「工事NGなら光とAirを並べて比較」'}
];
document.getElementById('serviceCards').innerHTML=services.map(s=>`<article class="svc card" style="--accent:${s.accent}">
<div class="svc-head"><h3>${s.name}</h3><span class="type">${s.type}</span></div>
<div class="why">${s.why}</div>
<dl><dt>ポイント</dt><dd>${s.good}</dd><dt>必ず確認</dt><dd>${s.check}</dd><dt>一言トーク</dt><dd>${s.word}</dd></dl>
</article>`).join('');

const diag=[
 {q:'今使っているインターネットは？',sub:'まず「現在地」を確認します。',opts:['フレッツ光','光コラボ','auひかり / NURO等','ホームルーター','CATV / その他','何も使っていない']},
 {q:'スマホはどこを使っていますか？',sub:'セット割や候補整理の入口。',opts:['docomo','SoftBank','au / UQ','その他 / 複数']},
 {q:'お住まいは？',sub:'提供可否・工事・料金体系に関わります。',opts:['戸建','集合住宅']},
 {q:'固定電話・テレビは使っていますか？',sub:'ネットだけ見て決めると失敗しやすい所。',opts:['電話あり','TVあり','両方あり','どちらもなし']},
 {q:'一番重視することは？',sub:'最後に優先順位を確認。',opts:['月々の料金','速度','工事したくない','スマホとのセット','電話・TVを維持','よく分からない']}
];
let step=0, answers=[];

function renderDiag(){
 const card=document.getElementById('diagCard'), bar=document.querySelector('#diagProgress i');
 bar.style.width=(step>=diag.length?100:((step+1)/diag.length*100))+'%';
 if(step>=diag.length){
   const a=answers.join('|'); let tags=[];
   if(a.includes('docomo'))tags.push('ドコモ光','home 5G');
   if(a.includes('SoftBank'))tags.push('SoftBank 光','SoftBank Air');
   if(a.includes('au / UQ'))tags.push('auひかり');
   if(a.includes('工事したくない'))tags.push('home 5G / SoftBank Air');
   if(a.includes('速度'))tags.push('10G / NURO光 / auひかりも確認');
   if(a.includes('電話あり')||a.includes('TVあり')||a.includes('両方あり'))tags.push('電話・TVの引継ぎ条件を先に確認');
   if(!tags.length)tags.push('@nifty光を含め固定回線を比較');
   tags=[...new Set(tags)];
   card.innerHTML=`<div class="diag-navrow"><button class="diag-back" onclick="backDiag()">← 1つ前に戻る</button><span class="step-no">診断完了</span></div>
   <h3>候補をここから絞る</h3><p>最終決定ではなく「次に確認する候補」です。</p>
   <div class="result-box"><h4>提案候補</h4><div class="result-tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div>
   <div class="mini-flow"><div>候補</div><i>→</i><div>提供エリア</div><i>→</i><div>電話・TV</div><i>→</i><div>最新条件</div></div>
   <p style="font-size:13px;color:#667085;line-height:1.7;margin-bottom:0">提供エリア・建物・1G/10G・電話/TV・最新キャンペーン・受付条件を確認して最終提案してください。</p></div>
   <button class="cta" onclick="resetDiag()">最初からやり直す</button>`;
   return;
 }
 const d=diag[step];
 const prev=step>0?`<button class="diag-back" onclick="backDiag()">← 1つ前に戻る</button>`:`<span></span>`;
 card.innerHTML=`<div class="diag-navrow">${prev}<span class="step-no">STEP ${step+1} / ${diag.length}</span></div>
 <h3>${d.q}</h3><p>${d.sub}</p>
 <div class="choice-grid">${d.opts.map(o=>`<button class="choice" onclick="chooseDiag('${o.replaceAll("'","")}')">${o}</button>`).join('')}</div>
 ${answers.length?`<div class="answer-trail"><b>ここまで：</b>${answers.map((x,i)=>`<span>${i+1}. ${x}</span>`).join('')}</div>`:''}`;
}
function chooseDiag(v){answers.push(v);step++;renderDiag();}
function backDiag(){if(step<=0)return;step--;answers.pop();renderDiag();}
function resetDiag(){step=0;answers=[];renderDiag();}


const serviceGuideData={
 docomo:{
   name:'ドコモ光',type:'光回線',color:'#d7263d',
   icon:'D',catch:'docomo利用者の固定回線候補',
   fit:['docomoスマホを利用','工事できる','固定電話やTVも含めて検討'],
   ask:['現在の回線名','戸建 / 集合住宅','1G / 10G','固定電話・TV','工事希望時期'],
   work:'光回線なので、建物設備や現在の回線状況により工事内容が変わります。フレッツ光利用中なら転用の可能性、光コラボ利用中なら事業者変更の可能性を確認。',
   phone:'固定電話やTVを使っている場合は、番号引継ぎ・現在サービス・工事要否を先に確認。',
   caution:['スマホ会社だけで即決しない','1G / 10Gで手続きが変わる場合あり','工事費・特典は最新資料確認'],
   talk:'「docomoをお使いなら、まずドコモ光を候補にして、工事できるか・電話やTVを残すかまで一緒に確認します」'
 },
 softbank:{
   name:'SoftBank 光',type:'光回線',color:'#111827',
   icon:'S',catch:'SoftBank利用者の固定回線候補',
   fit:['SoftBankスマホを利用','工事できる','固定電話も使いたい'],
   ask:['現在の回線名','戸建 / 集合住宅','1G / 10G','電話番号を残すか','TV利用'],
   work:'固定回線なので、建物設備と現在回線を確認。光コラボ間なら事業者変更の可能性、フレッツからなら転用の可能性があります。',
   phone:'電話・TV利用中なら、ネットだけ先に決めず引継ぎ条件を確認。',
   caution:['Airと違い工事が必要になる場合あり','乗り換え区分を確認','最新キャンペーンは店頭資料確認'],
   talk:'「工事できるならSoftBank 光、工事を避けたいならAirも一緒に比較すると分かりやすいです」'
 },
 nifty:{
   name:'@nifty光',type:'光回線',color:'#f2c94c',
   icon:'N',catch:'ノジマグループの光回線として提案候補',
   fit:['店頭で比較しながら選びたい','光コラボ間の乗り換えを検討','固定回線を使いたい'],
   ask:['現在の回線名','新規 / 転用 / 事業者変更','1G / 10G','電話・TV','工事希望時期'],
   work:'現在の回線によって、新規・転用・事業者変更のどれに当たるかを先に整理。設備状況により工事内容が変わります。',
   phone:'番号を残す場合や光TV利用中は、回線だけではなく電話・TVの引継ぎも確認。',
   caution:['現在回線を曖昧にしない','1G / 10Gを確認','特典・工事費は最新資料確認'],
   talk:'「まず今の回線を確認して、@nifty光へどう移るのが一番スムーズか整理しましょう」'
 },
 au:{
   name:'auひかり',type:'独自回線',color:'#f97316',
   icon:'au',catch:'au / UQ利用者＋独自回線も比較したい人',
   fit:['au / UQを利用','提供エリア内','速度・安定性も重視'],
   ask:['提供エリア','戸建 / 集合住宅','現在回線','電話番号維持','工事可能か'],
   work:'フレッツ系の光コラボとは別系統として考えるのが分かりやすい。住所・建物で提供可否と工事条件を先に確認。',
   phone:'固定電話を残したい場合は、番号・現在の電話サービスを確認。TVも視聴方法を確認。',
   caution:['光コラボと同じ乗り換え手続きと決めつけない','提供エリア確認が先','撤去・工事条件は最新資料確認'],
   talk:'「au / UQをお使いなら、エリアが合えばauひかりも有力候補です。まず住所から確認します」'
 },
 nuro:{
   name:'NURO光',type:'独自回線',color:'#10b981',
   icon:'N',catch:'速度重視＋提供エリア内のお客様',
   fit:['速度を重視','工事できる','提供エリア内'],
   ask:['住所・提供エリア','戸建 / 集合住宅','工事希望時期','現在回線','電話・TV'],
   work:'独自回線のため、エリア・建物・工事日程を先に確認。現在の回線からの移行方法も個別に整理。',
   phone:'固定電話・TVを利用中なら、現サービスの終了や引継ぎ条件を確認。',
   caution:['エリア外では提案不可','工事日程を確認','旧プラン情報と混同しない'],
   talk:'「速度重視ならNURO光も候補です。まずエリアと工事できるかを確認しましょう」'
 },
 home5g:{
   name:'ドコモ home 5G',type:'ホームルーター',color:'#e11d48',
   icon:'5G',catch:'工事を避けたいdocomo利用者',
   fit:['工事したくない','早くWi‑Fiを使いたい','docomo利用'],
   ask:['利用住所','電波状況','端末条件','固定電話が必要か','利用人数・用途'],
   work:'光回線を家へ引く工事は不要。設置場所と電波状況が重要。',
   phone:'固定回線の光電話とは仕組みが違うため、固定電話が必要なら別途確認。',
   caution:['登録住所と利用場所を確認','光回線と同じ性能と断定しない','端末条件は最新資料確認'],
   talk:'「工事せずに使いたいならhome 5Gが候補です。ご自宅の電波と使い方を確認しましょう」'
 },
 air:{
   name:'SoftBank Air',type:'ホームルーター',color:'#0ea5e9',
   icon:'Air',catch:'工事を避けたいSoftBank利用者',
   fit:['工事したくない','SoftBank利用','早くWi‑Fiを使いたい'],
   ask:['利用住所','電波状況','端末条件','固定電話の必要性','利用人数・用途'],
   work:'光回線の引込工事は不要。住所と電波状況を中心に確認。',
   phone:'固定電話を使いたい場合は、光回線との違いを確認してから案内。',
   caution:['固定回線と同じと説明しない','電波状況が重要','端末・特典条件は最新資料確認'],
   talk:'「工事を避けたいならAir、固定回線の安定性を重視するならSoftBank 光も比較しましょう」'
 }
};

function showService(key){
 const s=serviceGuideData[key], box=document.getElementById('serviceDetail');
 if(!s||!box)return;
 box.innerHTML=`
 <article class="service-master card" style="--svc:${s.color}">
   <div class="master-head">
     <div class="master-logo">${s.icon}</div>
     <div><span>${s.type}</span><h3>${s.name}</h3><p>${s.catch}</p></div>
   </div>

   <div class="master-visual">
     <div class="mv-person">👤<small>お客様</small></div><i>→</i>
     <div class="mv-question">聞く<small>回線・住居・スマホ</small></div><i>→</i>
     <div class="mv-check">確認<small>工事・電話・TV</small></div><i>→</i>
     <div class="mv-propose">提案<small>${s.name}</small></div>
   </div>

   <div class="master-grid">
     <section><h4>◎ 向いている人</h4>${s.fit.map(x=>`<div class="bullet ok">${x}</div>`).join('')}</section>
     <section><h4>？ 最初に聞く</h4>${s.ask.map(x=>`<div class="bullet ask">${x}</div>`).join('')}</section>
   </div>

   <div class="info-flow">
     <div class="if-card"><b>工事</b><span>${s.work}</span></div>
     <div class="if-card"><b>電話・TV</b><span>${s.phone}</span></div>
   </div>

   <section class="caution-box">
     <h4>⚠ 新人さん注意</h4>
     <div class="caution-list">${s.caution.map(x=>`<span>${x}</span>`).join('')}</div>
   </section>

   <section class="talk-box"><span>そのまま使える一言</span><p>${s.talk}</p></section>
   <div class="latest-note">料金・工事費・特典・受付条件は必ず最新の店頭資料で確認。</div>
 </article>`;
 document.querySelectorAll('.service-selector button').forEach(b=>b.classList.remove('active'));
 const names={docomo:'ドコモ光',softbank:'SoftBank 光',nifty:'@nifty光',au:'auひかり',nuro:'NURO光',home5g:'home 5G',air:'SoftBank Air'};
 [...document.querySelectorAll('.service-selector button')].find(b=>b.textContent===names[key])?.classList.add('active');
}
setTimeout(()=>showService('docomo'),0);


const quiz=[
 {q:'お客様「今はフレッツ光。ドコモ光にしたい」。まず考える手続きは？',a:['転用','事業者変更','必ず解約新規'],c:0,e:'フレッツ光から光コラボへの移行は「転用」が基本。ただし1G/10Gや契約状況も確認します。'},
 {q:'お客様「SoftBank 光から@nifty光へ変えたい」。まず確認するのは？',a:['事業者変更が可能な組み合わせか','必ず新規工事になると案内','スマホ機種だけ確認'],c:0,e:'光コラボ間は事業者変更の可能性があります。電話・TV・1G/10Gも一緒に確認。'},
 {q:'「工事したくない。早くWi-Fiを使いたい」お客様への候補は？',a:['home 5G / SoftBank Air','必ず10G光回線','必ずNURO光'],c:0,e:'ホームルーターは工事不要が大きな特徴。住所・電波・端末条件の確認が必要です。'},
 {q:'固定電話を利用中。最初に聞くと良いことは？',a:['電話番号を残したいか','テレビのメーカー','パソコンの色'],c:0,e:'番号引継ぎの可否は重要。発番元や利用中サービスも確認します。'},
 {q:'10Gを案内する時の説明として適切なのは？',a:['エリア・機器・配線など条件も確認する','1Gの10倍必ず速い','どの建物でも使える'],c:0,e:'最大速度だけで断定せず、提供エリア・機器・宅内環境を確認します。'},
 {q:'auひかりやNURO光への乗り換えで注意する点は？',a:['光コラボと同じ手続きと決めつけない','必ず事業者変更承諾番号だけ取る','工事確認は不要'],c:0,e:'独自回線はフレッツ系と別のため、提供エリア・工事・電話などを個別に確認します。'}
];
const qb=document.getElementById('quizbox');
qb.innerHTML=quiz.map((x,i)=>`<article class="qcard card"><h3>Q${i+1}. ${x.q}</h3><div class="answers">${x.a.map((v,j)=>`<button class="ans" data-q="${i}" data-a="${j}">${v}</button>`).join('')}</div><div class="explain">${x.e}</div></article>`).join('');
qb.addEventListener('click',e=>{
 if(!e.target.classList.contains('ans'))return;
 let qi=+e.target.dataset.q, ai=+e.target.dataset.a, wrap=e.target.closest('.qcard');
 wrap.querySelectorAll('.ans').forEach((b,k)=>{b.disabled=true;if(k===quiz[qi].c)b.classList.add('correct')});
 if(ai!==quiz[qi].c)e.target.classList.add('wrong');
 wrap.querySelector('.explain').style.display='block';
});
renderDiag();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}


function yenNum(id){
 const el=document.getElementById(id);
 if(!el)return 0;
 return Number(String(el.value||'0').replace(/[^\d.-]/g,''))||0;
}
function calcSwitchCost(){
 const total = yenNum('cancelFee') + yenNum('deviceBalance') + yenNum('workBalance') + yenNum('otherCost')
             - yenNum('instantBenefit') - yenNum('laterBenefit');
 const box=document.getElementById('costResult');
 if(!box)return;
 const display = total<0 ? `▲${Math.abs(total).toLocaleString()}円` : `${total.toLocaleString()}円`;
 box.querySelector('strong').textContent=display;
 box.classList.toggle('plus-benefit', total<0);
}

function makeBillMemo(){
 const val=id=>document.getElementById(id)?.value?.trim()||'未確認';
 const money=id=>{
   const v=document.getElementById(id)?.value?.trim();
   if(!v)return '未確認';
   const n=Number(v.replace(/[^\d.-]/g,''));
   return Number.isFinite(n)?`${n.toLocaleString()}円`:v;
 };
 const box=document.getElementById('billMemoResult');
 if(!box)return;
 box.innerHTML=`
   <b>現在回線：</b>${val('memoLine')}<br>
   <b>月額合計：</b>${money('memoTotal')}<br>
   <b>電話：</b>${val('memoPhone')}　<b>TV：</b>${val('memoTv')}<br>
   <b>端末残債：</b>${money('memoDevice')}　<b>工事費残債：</b>${money('memoWork')}
 `;
}


const salesSteps=[
 {
  title:'今のインターネットを確認',
  sub:'まず現在地を正確にします。',
  key:'line',
  opts:['フレッツ光','光コラボ','auひかり / NURO光','home 5G / SoftBank Air','CATV / その他','なし']
 },
 {
  title:'スマホ会社を確認',
  sub:'セット割だけでなく、候補整理の入口にします。',
  key:'mobile',
  opts:['docomo','SoftBank','au / UQ','その他 / 複数']
 },
 {
  title:'住居と工事可否',
  sub:'戸建 / 集合と、工事できるかを同時に確認。',
  key:'house',
  opts:['戸建・工事OK','戸建・工事NG','集合・工事OK','集合・工事NG']
 },
 {
  title:'固定電話・TV',
  sub:'ネットより先に引継ぎ条件を見ることがあります。',
  key:'options',
  opts:['電話あり','TVあり','両方あり','どちらもなし']
 },
 {
  title:'何を一番重視？',
  sub:'最後に優先順位を確認。',
  key:'priority',
  opts:['月額','速度','工事不要','スマホセット','電話・TV維持','よく分からない']
 },
 {
  title:'乗り換え負担を確認',
  sub:'解約金だけでなく残債も確認。',
  key:'cost',
  opts:['解約金あり','端末残債あり','工事費残債あり','負担ほぼなし','まだ不明']
 },
 {
  title:'最終提案チェック',
  sub:'候補・手続き・工事・費用をまとめます。',
  key:'finish',
  opts:['結果を見る']
 }
];

let salesStep=0;
let salesAnswers={};

function renderSalesMode(){
 const card=document.getElementById('salesModeCard');
 const bar=document.getElementById('salesProgressBar');
 if(!card||!bar)return;
 const pct=Math.min(100,((salesStep+1)/salesSteps.length)*100);
 bar.style.width=pct+'%';

 if(salesStep>=salesSteps.length-1){
   const a=Object.values(salesAnswers).join('|');
   let candidates=[];
   if(a.includes('docomo'))candidates.push('ドコモ光','home 5G');
   if(a.includes('SoftBank'))candidates.push('SoftBank 光','SoftBank Air');
   if(a.includes('au / UQ'))candidates.push('auひかり');
   if(a.includes('速度'))candidates.push('NURO光 / 10G系');
   if(a.includes('工事NG')||a.includes('工事不要'))candidates.push('home 5G / SoftBank Air');
   if(!candidates.length)candidates.push('@nifty光を含め固定回線を比較');
   candidates=[...new Set(candidates)];

   let procedure='新規の可能性';
   if((salesAnswers.line||'').includes('フレッツ光'))procedure='転用の可能性';
   if((salesAnswers.line||'').includes('光コラボ'))procedure='事業者変更の可能性';

   let checks=[];
   if((salesAnswers.options||'').includes('電話'))checks.push('固定電話の番号引継ぎ');
   if((salesAnswers.options||'').includes('TV'))checks.push('TV工事・視聴方法');
   if((salesAnswers.house||'').includes('工事NG'))checks.push('ホームルーター優先比較');
   if((salesAnswers.cost||'').includes('残債'))checks.push('残債を含め実質負担計算');
   if(!checks.length)checks.push('提供エリア・最新キャンペーン');

   card.innerHTML=`
   <div class="salesmode-headrow">
     <button class="sales-back" onclick="salesBack()">← 1つ前</button>
     <span>STEP ${salesSteps.length}/${salesSteps.length}</span>
   </div>
   <h3>接客結果</h3>
   <p>最終案内前に、この内容を確認。</p>
   <div class="sales-result-grid">
     <div class="sales-result-box"><small>候補</small>${candidates.map(x=>`<b>${x}</b>`).join('')}</div>
     <div class="sales-result-box"><small>手続き</small><b>${procedure}</b></div>
     <div class="sales-result-box"><small>追加確認</small>${checks.map(x=>`<b>${x}</b>`).join('')}</div>
   </div>
   <div class="sales-final-flow">
     <div>候補</div><i>→</i><div>エリア</div><i>→</i><div>工事</div><i>→</i><div>電話・TV</div><i>→</i><div>費用</div><i>→</i><div class="final">提案</div>
   </div>
   <div class="sales-summary">
     <h4>今回の聞き取り</h4>
     <div>${Object.entries(salesAnswers).map(([k,v])=>`<span>${v}</span>`).join('')}</div>
   </div>
   <div class="sales-talk"><span>一言</span><p>「ここまで確認できたので、あとは提供エリアと最新条件を見て、一番合う回線を絞りますね」</p></div>
   <div class="next-actions">
     <button onclick="go('quickTable')">超早見表で比較</button>
     <button onclick="go('fees')">工事費を確認</button>
     <button onclick="go('switchCost')">乗り換え費用を確認</button>
   </div>
   <button class="sales-reset" onclick="resetSalesMode()">最初からやり直す</button>`;
   return;
 }

 const s=salesSteps[salesStep];
 const trail=Object.entries(salesAnswers).map(([k,v],i)=>`<span>${i+1}. ${v}</span>`).join('');
 card.innerHTML=`
 <div class="salesmode-headrow">
   ${salesStep>0?'<button class="sales-back" onclick="salesBack()">← 1つ前</button>':'<span></span>'}
   <span>STEP ${salesStep+1}/${salesSteps.length}</span>
 </div>
 <h3>${s.title}</h3><p>${s.sub}</p>
 <div class="sales-choice-grid">${s.opts.map(o=>`<button onclick="salesChoose('${s.key}','${o}')">${o}</button>`).join('')}</div>
 ${trail?`<div class="sales-trail"><b>ここまで：</b>${trail}</div>`:''}`;
}

function salesChoose(key,val){
 salesAnswers[key]=val;
 salesStep++;
 renderSalesMode();
}
function salesBack(){
 if(salesStep<=0)return;
 salesStep--;
 const key=salesSteps[salesStep].key;
 delete salesAnswers[key];
 renderSalesMode();
}
function resetSalesMode(){salesStep=0;salesAnswers={};renderSalesMode();}

renderSalesMode();


const bbSearchIndex=[
 {title:'接客モード',keys:'接客 流れ ヒアリング 候補 提案',page:'salesMode'},
 {title:'超早見表',keys:'比較 回線 7サービス 工事 電話 TV 転用 事業者変更',page:'quickTable'},
 {title:'手続き図解',keys:'新規 転用 事業者変更 フレッツ 光コラボ',page:'procedure'},
 {title:'工事マスター',keys:'工事 戸建 集合 ONU 光コンセント 無派遣 1G 10G',page:'construction'},
 {title:'工事費・費用',keys:'工事費 事務手数料 電話工事 TV工事 金額',page:'fees'},
 {title:'乗り換え費用',keys:'解約金 残債 端末 工事費残債 キャンペーン',page:'switchCost'},
 {title:'請求書チェック',keys:'請求書 明細 月額 オプション 割引 残債',page:'billCheck'},
 {title:'サービス攻略',keys:'ドコモ光 SoftBank光 nifty auひかり NURO home5G Air',page:'serviceGuide'},
 {title:'図解ライブラリ',keys:'図解 絵 Wi-Fi 光回線 ホームルーター 電話 TV',page:'visuals'},
 {title:'超基礎',keys:'1G 10G IPv6 光コラボ 独自回線 ホームルーター',page:'basics'},
 {title:'絶対確認',keys:'確認 見落とし 注意 危険 チェック',page:'mustCheck'}
];

function runBBSearch(){
 const q=(document.getElementById('bbSearch')?.value||'').trim().toLowerCase();
 const box=document.getElementById('searchResults');
 if(!box)return;
 if(!q){box.innerHTML='';return;}
 const words=q.split(/\s+/);
 const hits=bbSearchIndex.filter(x=>{
   const hay=(x.title+' '+x.keys).toLowerCase();
   return words.every(w=>hay.includes(w));
 });
 box.innerHTML=hits.length
   ? hits.map(x=>`<button onclick="go('${x.page}')"><b>${x.title}</b><span>開く →</span></button>`).join('')
   : `<div class="no-hit">該当なし。別の言葉で検索してみてください。</div>`;
}
document.addEventListener('keydown',e=>{
 if(e.key==='Enter' && document.activeElement?.id==='bbSearch')runBBSearch();
});
