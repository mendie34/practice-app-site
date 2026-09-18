
  function openLightbox(src, alt){
    var img = document.getElementById('lightbox-img');
    img.src = src;
    img.alt = alt || '';
    document.getElementById('lightbox').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(e){
    if(e) e.stopPropagation();
    document.getElementById('lightbox').classList.remove('show');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
  });
  function toggleFaq(el){
    var item = el.parentElement;
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!wasOpen){
      item.classList.add('open');
      var a = item.querySelector('.faq-a');
      a.style.maxHeight = a.scrollHeight + 40 + 'px';
    }
  }
  function showToast(msg){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 3200);
  }
  function encodeFormData(data){
    return Object.keys(data).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }
  function submitNetlifyForm(form, data, successMsg){
    fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: encodeFormData(data)
    }).then(function(){
      showToast(successMsg);
      form.reset();
    }).catch(function(){
      showToast("Something went wrong — please email us directly");
    });
  }
  function handleWaitlist(e){
    e.preventDefault();
    var form = e.target;
    var email = form.querySelector('input[name="email"]').value;
    submitNetlifyForm(form, {'form-name':'waitlist','email':email}, "Thanks — we'll email you the moment it's live");
  }
  function handleContact(e){
    e.preventDefault();
    var form = e.target;
    var data = {
      'form-name':'contact',
      'name': form.querySelector('input[name="name"]').value,
      'email': form.querySelector('input[name="email"]').value,
      'message': form.querySelector('textarea[name="message"]').value
    };
    submitNetlifyForm(form, data, "Message sent — we'll get back to you soon");
  }

  // Nav: highlight the tab matching the current page (and current hash on Home,
  // e.g. #features) — also drives the mobile toggle's label.
  function updateActiveTab(){
    var page = document.body.getAttribute('data-page');
    if(!page) return;
    var target = (page === 'home' && window.location.hash === '#features') ? 'features' : page;
    var activeLabel = '';
    document.querySelectorAll('.tab-pill').forEach(function(t){
      var isActive = t.getAttribute('data-tab') === target;
      t.classList.toggle('active', isActive);
      if(isActive) activeLabel = t.textContent;
    });
    var toggleLabel = document.getElementById('tabbarToggleLabel');
    if(toggleLabel && activeLabel) toggleLabel.textContent = activeLabel;
  }
  updateActiveTab();
  window.addEventListener('hashchange', updateActiveTab);

  // Mobile nav: tap-to-expand accordion menu (desktop keeps the horizontal tab bar)
  (function(){
    var toggle = document.getElementById('tabbarToggle');
    var wrap = document.querySelector('.tabbar-wrap');
    if(!toggle || !wrap) return;
    toggle.addEventListener('click', function(){
      var isOpen = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-pill').forEach(function(link){
      link.addEventListener('click', function(){
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function(e){
      if(wrap.classList.contains('open') && !wrap.contains(e.target)){
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();
