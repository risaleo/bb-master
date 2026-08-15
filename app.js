
const pages=[...document.querySelectorAll('.page')];
function go(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='diagnosis')renderDiag();}

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
 bar.style.width=((step+1)/diag.length*100)+'%';
 if(step>=diag.length){
   const a=answers.join('|');
   let tags=[];
   if(a.includes('docomo'))tags.push('ドコモ光','home 5G');
   if(a.includes('SoftBank'))tags.push('SoftBank 光','SoftBank Air');
   if(a.includes('au / UQ'))tags.push('auひかり');
   if(a.includes('工事したくない'))tags.push('home 5G / SoftBank Air');
   if(a.includes('速度'))tags.push('10G / NURO光 / auひかりも確認');
   if(!tags.length)tags.push('@nifty光を含め固定回線を比較');
   tags=[...new Set(tags)];
   card.innerHTML=`<span class="step-no">診断完了</span><h3>候補をここから絞る</h3><p>最終決定ではなく「次に確認する候補」です。</p>
   <div class="result-box"><h4>提案候補</h4><div class="result-tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div>
   <p style="font-size:13px;color:#667085;line-height:1.7;margin-bottom:0">提供エリア・建物・1G/10G・電話/TV・最新キャンペーン・受付条件を確認して最終提案してください。</p></div>
   <button class="cta" onclick="resetDiag()">最初からやり直す</button>`;
   return;
 }
 const d=diag[step];
 card.innerHTML=`<span class="step-no">STEP ${step+1} / ${diag.length}</span><h3>${d.q}</h3><p>${d.sub}</p>
 <div class="choice-grid">${d.opts.map(o=>`<button class="choice" onclick="chooseDiag('${o.replaceAll("'","")}')">${o}</button>`).join('')}</div>`;
}
function chooseDiag(v){answers.push(v);step++;renderDiag();}
function resetDiag(){step=0;answers=[];renderDiag();}

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
