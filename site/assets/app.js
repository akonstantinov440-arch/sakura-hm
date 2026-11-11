// Refuse to run inside someone else's frame (protects against clickjacking).
if (window.top !== window.self) { try { window.top.location = window.self.location.href; } catch (e) { document.documentElement.style.display = "none"; } }
(function(){
'use strict';

var reduce = matchMedia('(prefers-reduced-motion: reduce)');

/* ---- price data (copied from the salon's price list) ---- */
var DATA = [
  {id:'cuts', title:'Стрижки', items:[
    {g:'Женская стрижка (от)', p:'от 1 500 ₽', kids:[
      {n:'на короткие волосы', p:'1 500 ₽', v:1500},
      {n:'на средние волосы', p:'1 800 – 2 000 ₽', v:1800},
      {n:'на длинные волосы', p:'3 500 – 4 000 ₽', v:3500}]},
    {n:'Подравнивание кончиков волос', p:'1 000 ₽', v:1000},
    {n:'Стрижка чёлки', p:'400 ₽', v:400},
    {n:'Мужская стрижка под насадки', p:'700 – 800 ₽', v:700},
    {n:'Мужская стрижка модельная', p:'900 – 1 000 ₽', v:900},
    {n:'Стрижка бороды', p:'300 ₽', v:300},
    {n:'Детская стрижка', p:'800 ₽', v:800}
  ]},
  {id:'color', title:'Окрашивание', items:[
    {g:'Мелирование (от)', p:'от 3 800 ₽', kids:[
      {n:'короткие волосы', p:'от 3 800 ₽', v:3800},
      {n:'средние волосы', p:'от 5 800 ₽', v:5800},
      {n:'длинные волосы', p:'от 7 000 ₽', v:7000}]},
    {n:'Окрашивание корней', p:'от 2 000 ₽', v:2000},
    {n:'Полное окрашивание', p:'от 3 000 ₽', v:3000},
    {n:'Сложное окрашивание', p:'от 10 000 ₽', v:10000},
    {n:'Мужской камуфляж', p:'от 1 800 ₽', v:1800},
    {n:'Окрашивание бороды', p:'от 500 ₽', v:500},
    {n:'Биозавивка волос', p:'от 3 000 ₽', v:3000}
  ]},
  {id:'nails', title:'Ногтевой сервис', items:[
    {n:'Комплекс: маникюр + покрытие гель лак', note:'снятие старого покрытия в подарок', p:'2 300 ₽', v:2300},
    {n:'Маникюр без покрытия гель лака и без снятия старого покрытия', p:'1 200 ₽', v:1200},
    {n:'Наращивание ногтей + покрытие гель лак', p:'3 500 ₽', v:3500},
    {n:'Ремонт ногтя', p:'200 ₽', v:200},
    {n:'Снятие покрытия + маникюр без дальнейшего покрытия', p:'1 500 ₽', v:1500},
    {n:'Снятие без дальнейшего покрытия', p:'300 ₽', v:300},
    {n:'Снятие наращенных ногтей без дальнейшего покрытия', p:'500 ₽', v:500},
    {n:'Парафин', p:'500 ₽', v:500},
    {n:'Мужской маникюр', p:'1 500 ₽', v:1500},
    {n:'Коррекция наращенных ногтей', p:'2 800 ₽', v:2800},
    {n:'Прокол ушей', p:'2 000 ₽', v:2000}
  ]},
  {id:'lash', title:'Ресницы и брови', items:[
    {n:'Ламинирование ресниц', note:'покраска входит в стоимость', p:'2 000 ₽', v:2000},
    {n:'Ламинирование верхних и нижних ресниц', note:'покраска входит в стоимость', p:'2 200 ₽', v:2200},
    {n:'Покраска бровей с коррекцией', p:'1 200 ₽', v:1200},
    {n:'Ламинирование бровей с коррекцией', p:'1 700 ₽', v:1700},
    {n:'Коррекция бровей', p:'600 ₽', v:600}
  ], combo:{title:'Комплексы', items:[
    {n:'Комплекс 1: ламинирование ресниц + ламинирование бровей с коррекцией', p:'3 300 ₽', v:3300},
    {n:'Комплекс 2: ламинирование ресниц и бровей с покраской с коррекцией', p:'3 800 ₽', v:3800}]}}
];

var fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
var picked = {};        // key -> {name, text, v}
var uid = 0;

function rowEl(it, sub){
  var key = 'k' + (uid++);
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'row' + (sub ? ' sub' : '');
  b.setAttribute('aria-pressed', 'false');
  b.dataset.key = key;
  var nm = document.createElement('span');
  nm.className = 'nm';
  nm.textContent = it.n;
  if (it.note){
    var s = document.createElement('small');
    s.textContent = it.note;
    nm.appendChild(s);
  }
  var dots = document.createElement('span'); dots.className = 'dots'; dots.setAttribute('aria-hidden','true');
  var pr = document.createElement('span'); pr.className = 'pr'; pr.textContent = it.p;
  var pl = document.createElement('span'); pl.className = 'pl'; pl.setAttribute('aria-hidden','true');
  b.append(nm, dots, pr, pl);
  b.addEventListener('click', function(){
    var on = !b.classList.contains('on');
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) picked[key] = {name: it.n, text: it.p, v: it.v};
    else delete picked[key];
    renderVisit();
  });
  return b;
}

function groupEl(g){
  var h = document.createElement('div');
  h.className = 'pgroup';
  var a = document.createElement('span'); a.textContent = g.g;
  var p = document.createElement('span'); p.className = 'p'; p.textContent = g.p;
  h.append(a, p);
  return h;
}

function buildPrice(){
  var tabs = document.getElementById('tabs');
  var lists = document.getElementById('lists');
  if (!tabs || !lists) return;
  DATA.forEach(function(cat, i){
    var t = document.createElement('button');
    t.type = 'button'; t.className = 'tab'; t.id = 'tab-' + cat.id;
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', 'panel-' + cat.id);
    t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    t.tabIndex = i === 0 ? 0 : -1;
    t.textContent = cat.title;
    tabs.appendChild(t);

    var pnl = document.createElement('div');
    pnl.className = 'panel' + (i === 0 ? ' on' : '');
    pnl.id = 'panel-' + cat.id;
    pnl.setAttribute('role', 'tabpanel');
    pnl.setAttribute('aria-labelledby', t.id);
    cat.items.forEach(function(it){
      if (it.g){
        pnl.appendChild(groupEl(it));
        it.kids.forEach(function(k){ pnl.appendChild(rowEl(k, true)); });
      } else {
        pnl.appendChild(rowEl(it, false));
      }
    });
    if (cat.combo){
      var c = document.createElement('div');
      c.className = 'combo';
      var h = document.createElement('div'); h.className = 'pgroup'; h.textContent = cat.combo.title;
      c.appendChild(h);
      cat.combo.items.forEach(function(it){ c.appendChild(rowEl(it, false)); });
      pnl.appendChild(c);
    }
    lists.appendChild(pnl);
  });

  var tabEls = Array.prototype.slice.call(tabs.children);
  function select(t){
    tabEls.forEach(function(x){
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on', on);
    });
  }
  tabEls.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){
      var n = null;
      if (e.key === 'ArrowRight') n = tabEls[(i + 1) % tabEls.length];
      if (e.key === 'ArrowLeft') n = tabEls[(i - 1 + tabEls.length) % tabEls.length];
      if (n){ e.preventDefault(); n.focus(); select(n); }
    });
  });

  document.getElementById('reset').addEventListener('click', function(){
    picked = {};
    document.querySelectorAll('.row.on').forEach(function(r){ r.classList.remove('on'); r.setAttribute('aria-pressed','false'); });
    renderVisit();
  });
  renderVisit();
}

function renderVisit(){
  var ul = document.getElementById('picked');
  var keys = Object.keys(picked);
  ul.textContent = '';
  var total = 0;
  keys.forEach(function(k){
    var p = picked[k];
    total += p.v;
    var li = document.createElement('li');
    var a = document.createElement('span'); a.textContent = p.name;
    var b = document.createElement('span'); b.textContent = p.text;
    li.append(a, b);
    ul.appendChild(li);
  });
  var label = 'от ' + fmt(total) + ' ₽';
  document.getElementById('sum').textContent = label;
  document.getElementById('mtotal').textContent = keys.length ? label : 'Прайс выше, позвоните';
  document.getElementById('empty').hidden = keys.length > 0;
  document.getElementById('reset').hidden = keys.length === 0;
  document.getElementById('mbar').hidden = keys.length === 0;
}

/* ---- reveal on scroll ---- */
function initReveal(){
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || reduce.matches){
    els.forEach(function(e){ e.classList.add('in', 'done'); });
    return;
  }
  var io = new IntersectionObserver(function(list){
    list.forEach(function(en){
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(function(){ el.classList.add('done'); }, 1600);
    });
  }, {threshold: .12, rootMargin: '0px 0px -6% 0px'});
  els.forEach(function(e){ io.observe(e); });
}

/* ---- petals: few, slow, whisper level ---- */
function initPetals(){
  var box = document.getElementById('petals');
  if (!box || reduce.matches) return;
  var small = matchMedia('(max-width: 720px)').matches;
  var n = small ? 7 : 13;
  var rnd = (function(seed){ return function(){ seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; })(20261029);
  for (var i = 0; i < n; i++){
    var p = document.createElement('i');
    p.className = 'petal';
    var size = 12 + rnd() * 16;
    p.style.setProperty('--x', (rnd() * 96).toFixed(1) + '%');
    p.style.setProperty('--s', size.toFixed(1) + 'px');
    p.style.setProperty('--t', (16 + rnd() * 14).toFixed(1) + 's');
    p.style.setProperty('--dl', '-' + (rnd() * 26).toFixed(1) + 's');
    p.style.setProperty('--dx', ((rnd() - .5) * 160).toFixed(0) + 'px');
    box.appendChild(p);
  }
  var hero = document.getElementById('hero');
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(l){
      box.style.visibility = l[0].isIntersecting ? 'visible' : 'hidden';
    }).observe(hero);
  }
}

reduce.addEventListener('change', function(e){
  if (e.matches){
    document.querySelectorAll('.rv').forEach(function(x){ x.classList.add('in', 'done'); });
    var pb = document.getElementById('petals'); if (pb) pb.textContent = '';
  }
});
document.addEventListener('visibilitychange', function(){
  document.body.classList.toggle('paused', document.hidden);
});


/* ---- contact form: no server, so it opens the phone's SMS app with the text filled in ---- */
(function(){
  var form = document.getElementById('gs-form');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    var msg = form.elements.msg.value.trim();
    var body = 'Здравствуйте! Хочу записаться в «Сакуру».' +
      (msg ? ' ' + msg + '.' : '') +
      (name ? ' Меня зовут ' + name + '.' : '') +
      (phone ? ' Мой телефон: ' + phone + '.' : '');
    window.location.href = 'sms:+79526920505?&body=' + encodeURIComponent(body);
  });
})();

buildPrice();
initReveal();
initPetals();
})();
