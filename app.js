
const pages=[...document.querySelectorAll('.page')];
function go(id){
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
const quiz=[
 {q:'お客様が「工事はしたくない。すぐWi-Fiを使いたい」と希望。最初に比較しやすいのは？',a:['ドコモ home 5G / SoftBank Air','必ず10G光回線','必ずNURO光'],c:0,e:'工事を避けたい場合はホームルーターが候補。スマホ会社・住所・電波状況も確認します。'},
 {q:'「事業者変更」とは？',a:['光コラボから別の光コラボへ移る手続き','フレッツ光を新規契約すること','ホームルーターへ機種変更すること'],c:0,e:'光コラボ間の移行が事業者変更。現在回線と移行先の組み合わせ確認が必要です。'},
 {q:'固定電話を使っているお客様で、先に確認すべきことは？',a:['電話番号を残したいか','Wi-Fiの色','テレビの画面サイズ'],c:0,e:'番号引継ぎは発番元や利用サービスで条件が変わるため、必ず先に確認します。'},
 {q:'10Gを提案するときに大切なのは？',a:['提供エリア・機器・配線条件も確認','1Gより必ず安いと伝える','どの建物でも使えると案内'],c:0,e:'10Gは提供エリアや設備条件の確認が重要です。料金・キャンペーンは最新資料で確認します。'},
 {q:'回線変更時、ネット料金だけ見て決めてよい？',a:['電話・TV・工事・解約条件まで確認する','月額だけで決める','スマホ会社だけで決める'],c:0,e:'回線変更は電話番号、TV、工事、解約金、提供エリアなど複数条件をまとめて確認します。'}
];
const box=document.getElementById('quizbox');
quiz.forEach((x,i)=>{
 const d=document.createElement('div'); d.className='q card';
 d.innerHTML=`<h3>Q${i+1}. ${x.q}</h3><div class="answers">${x.a.map((v,j)=>`<button class="ans" data-i="${i}" data-j="${j}">${v}</button>`).join('')}</div><div class="explain">${x.e}</div>`;
 box.appendChild(d);
});
box.addEventListener('click',e=>{
 if(!e.target.classList.contains('ans')) return;
 const q=+e.target.dataset.i, j=+e.target.dataset.j;
 const wrap=e.target.closest('.q');
 wrap.querySelectorAll('.ans').forEach((b,k)=>{b.disabled=true;if(k===quiz[q].c)b.classList.add('correct');});
 if(j!==quiz[q].c)e.target.classList.add('wrong');
 wrap.querySelector('.explain').style.display='block';
});
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}
