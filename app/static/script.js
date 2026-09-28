const patternInput=document.getElementById("pattern");
const flagsInput=document.getElementById("flags");
const testText=document.getElementById("testText");
const highlighted=document.getElementById("highlighted");
const matchList=document.getElementById("matchList");
const matchCount=document.getElementById("matchCount");
const errorBox=document.getElementById("error");

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showError(message){errorBox.textContent=message;errorBox.hidden=false;matchCount.textContent="INVALID";highlighted.textContent="Fix the expression to view matches.";matchList.textContent="No results until the pattern is valid.";}

function runTest(){
  errorBox.hidden=true;
  const pattern=patternInput.value, text=testText.value, flags=flagsInput.value;
  if(/[^gimsuyd]/.test(flags)||new Set(flags).size!==flags.length){showError("Use valid, non-repeated JavaScript regex flags.");return;}
  let regex;
  try{regex=new RegExp(pattern,flags);}catch(e){showError("Invalid regular expression: "+e.message);return;}
  const matches=[];
  if(regex.global||regex.sticky){
    let m;
    while((m=regex.exec(text))!==null){
      matches.push({value:m[0],index:m.index,groups:m.slice(1)});
      if(m[0]==="")regex.lastIndex++; // Avoid an infinite loop for empty matches.
    }
  }else{const m=regex.exec(text);if(m)matches.push({value:m[0],index:m.index,groups:m.slice(1)});}
  matchCount.textContent=`${matches.length} MATCH${matches.length===1?"":"ES"}`;
  if(!matches.length){highlighted.textContent=text||"No test text entered.";matchList.textContent="No matches found. Try another pattern.";return;}
  let out="",cursor=0;
  for(const m of matches){out+=escapeHtml(text.slice(cursor,m.index))+`<mark>${escapeHtml(m.value)}</mark>`;cursor=m.index+m.value.length;}
  highlighted.innerHTML=out+escapeHtml(text.slice(cursor));
  matchList.innerHTML=matches.map((m,i)=>`<div class="match-item"><div class="match-value">${String(i+1).padStart(2,"0")} · ${escapeHtml(m.value||"(empty match)")}</div><div class="meta">Position: ${m.index}</div>${m.groups.length?`<div class="meta">Groups: ${m.groups.map(g=>g===undefined?"—":escapeHtml(g)).join(" · ")}</div>`:""}</div>`).join("");
}
document.getElementById("testBtn").addEventListener("click",runTest);
document.getElementById("clearBtn").addEventListener("click",()=>{patternInput.value="";flagsInput.value="g";testText.value="";runTest();});
document.getElementById("sampleBtn").addEventListener("click",()=>{patternInput.value="\\b\\w+@\\w+\\.\\w+\\b";flagsInput.value="gi";testText.value="Contact support@example.com or hello@regexlab.dev for help.\\nThis address is invalid: user@localhost";runTest();});
[patternInput,flagsInput,testText].forEach(el=>el.addEventListener("input",runTest));
runTest();
