(function(){
  if(document.getElementById('hit')){
  var bands=[[1,-2,'EAGLE'],[3,-1,'BIRDIE'],[5,0,'PAR'],[7,1,'BOGEY'],[Infinity,2,'DOUBLE']];
  var targetEl=document.getElementById('target'),prev=document.getElementById('prev'),tot=document.getElementById('total'),
      carry=document.getElementById('carry'),out=document.getElementById('carryOut'),log=document.getElementById('log');
  var target=142,total=0,n=0;
  function col(s){return s<0?'var(--green-lt)':s===0?'var(--cream)':'var(--flag)'}
  function fmt(s){return s===0?'E':(s>0?'+':'')+s}
  carry.addEventListener('input',function(){out.textContent=carry.value+' yds'});
  document.getElementById('hit').addEventListener('click',function(){
    var c=+carry.value,pct=Math.abs(c-target)/target*100,b=bands.find(function(x){return pct<=x[0]});
    total+=b[1];n++;
    if(n>9){total=b[1];n=1;log.innerHTML=''}
    prev.textContent=b[2];prev.style.color=col(b[1]);
    tot.textContent=fmt(total);tot.style.color=col(total);
    [prev,tot].forEach(function(e){e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash')});
    var s=document.createElement('span');s.textContent=target+'→'+c+' '+fmt(b[1]);s.style.color=col(b[1]);log.appendChild(s);
    target=100+Math.round(Math.random()*18)*5;
    targetEl.firstChild.nodeValue=target;
  });

  }
  if(document.getElementById('bars')){
  var CMP={range:{t:'RANGE',s:'Avg strokes gained per shot',v:[0.12,-0.04,0.05],pct:0},
    tee:{t:'TEE ACCURACY',s:'% fairways hit',v:[57,64,48],pct:1},
    short:{t:'SHORT GAME',s:'Avg strokes gained per shot',v:[0.08,0.15,-0.06],pct:0},
    putt:{t:'PUTTING — PRACTICE',s:'Avg strokes gained per putt',v:[0.03,-0.02,0.07],pct:0}};
  var names=['You','Jamie','Alex'];
  function showCmp(k){
    var d=CMP[k],lo=d.pct?0:Math.min.apply(0,d.v)-0.05,hi=d.pct?100:Math.max.apply(0,d.v)+0.05;
    document.getElementById('cTitle').textContent=d.t;document.getElementById('cSub').textContent=d.s;
    document.querySelectorAll('#bars .bar').forEach(function(b,i){
      var v=d.v[i];b.querySelector('.b').style.height=Math.max(4,(v-lo)/(hi-lo)*82)+'%';
      b.querySelector('.bv').textContent=d.pct?v+'%':(v>0?'+':'')+v.toFixed(2);
    });
    var best=d.v.indexOf(Math.max.apply(0,d.v));
    document.getElementById('cLead').textContent=(best===0?'You lead':names[best]+' leads')+' on '+d.t.toLowerCase().split(' —')[0];
    document.querySelectorAll('.seg button').forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k)});
  }
  document.querySelectorAll('.seg button').forEach(function(b){b.addEventListener('click',function(){showCmp(b.dataset.k)})});
  showCmp('range');
  }
  var mb=document.getElementById('menuBtn'),nav=document.querySelector('nav');
  mb.addEventListener('click',function(e){e.stopPropagation();var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  document.addEventListener('click',function(e){if(!nav.contains(e.target)){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
  function post(data){return fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString()}).then(function(r){if(!r.ok)throw 0})}
  var cf=document.getElementById('contactForm');
  if(cf)cf.addEventListener('submit',function(e){
    e.preventDefault();var n=document.getElementById('contactNote');
    post({'form-name':'contact',name:cf.name.value,email:cf.email.value,message:cf.message.value,'bot-field':cf['bot-field'].value})
      .then(function(){n.textContent="Message sent. We'll get back to you soon.";n.style.color='var(--green-lt)';cf.reset();})
      .catch(function(){n.textContent='Something went wrong. Please email info@thepracticeapp.co.uk.';n.style.color='var(--sand)';});
  });
  var tb=document.getElementById('tierBody');
  if(tb){var T=JSON.parse(tb.getAttribute('data-tiers'));
    function showTier(k){var r=T[k];tb.innerHTML='<tr><td>'+r[0]+'</td><td class="e">\u2264 '+r[1]+'%</td><td class="b">\u2264 '+r[2]+'%</td><td>\u2264 '+r[3]+'%</td><td class="bo">\u2264 '+r[4]+'%</td><td class="d">&gt; '+r[4]+'%</td></tr>';
      document.querySelectorAll('#tierSeg button').forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k)});}
    document.querySelectorAll('#tierSeg button').forEach(function(b){b.addEventListener('click',function(){showTier(b.dataset.k)})});}
  document.getElementById('waitlist').addEventListener('submit',function(e){
    e.preventDefault();
    var form=e.target,note=document.getElementById('formnote');
    var body=new URLSearchParams({'form-name':'waitlist','email':form.email.value,'bot-field-2':form['bot-field-2'].value}).toString();
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body})
      .then(function(r){if(!r.ok)throw 0;note.textContent="Thanks, you're on the list. We'll email you the moment it's live.";note.style.color='var(--green-lt)';form.reset();})
      .catch(function(){note.textContent='Something went wrong. Please email info@thepracticeapp.co.uk.';note.style.color='var(--sand)';});
  });
})();
