
const MOODS = {
  happy:  {emoji:'😊',title:'Celebrate Joy 🎉',msg:"You're in a great space — channel that energy!",acts:['Dance or move','Share the joy','Create something'],color:'#f59e0b'},
  calm:   {emoji:'😌',title:'Peaceful Presence 🌊',msg:'Calm is a superpower. Inhabit this moment.',acts:['Meditate 10 min','Read or learn','Nature walk'],color:'#06b6d4'},
  sad:    {emoji:'😢',title:'Brighter Days Ahead ☀️',msg:'Sadness is valid and temporary. Small steps matter.',acts:['Gratitude list','Call someone','Move your body'],color:'#60a5fa'},
  anxious:{emoji:'😰',title:'Finding Your Centre 🌸',msg:"Anxiety is energy. Let's redirect it.",acts:['4-7-8 breathing','Grounding exercise','Write it out'],color:'#f97316'},
  lonely: {emoji:'😔',title:"You're Not Alone 💙",msg:'Reaching out takes courage. Small connections help.',acts:['Text a friend','Join a community','Do something kind'],color:'#a78bfa'},
  stressed:{emoji:'😤',title:'Release the Pressure 🌿',msg:'One thing at a time. Progress beats perfection.',acts:['Brain dump list','2-min tidy','Short walk'],color:'#f43f5e'},
};
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ══════════════ MUSIC DATA ══════════════
const MUSIC_PLAYLISTS = {
  happy: {
    label:'Happy',emoji:'😊',color:'#f59e0b',
    tracks:[
      {title:'Sunny Afternoons',artist:'Lofi Waves',duration:'3:42',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',art:'☀️'},
      {title:'Good Vibes Only',artist:'Chill Studio',duration:'4:15',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',art:'🌈'},
      {title:'Dancing Leaves',artist:'Nature Beats',duration:'3:28',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',art:'🍃'},
    ]
  },
  calm: {
    label:'Calm',emoji:'😌',color:'#06b6d4',
    tracks:[
      {title:'Ocean Breeze',artist:'Ambient Space',duration:'5:10',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',art:'🌊'},
      {title:'Midnight Rain',artist:'Sleep Tones',duration:'6:02',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',art:'🌙'},
      {title:'Forest Dawn',artist:'Nature Lab',duration:'4:45',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',art:'🌲'},
    ]
  },
  sad: {
    label:'Sad',emoji:'😢',color:'#60a5fa',
    tracks:[
      {title:'Gentle Healing',artist:'Soft Piano',duration:'4:30',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',art:'💙'},
      {title:'Quiet Hope',artist:'Acoustic Mood',duration:'3:55',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',art:'🕯️'},
      {title:'Brighter Tomorrow',artist:'Comfort Beats',duration:'4:12',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',art:'🌤️'},
    ]
  },
  anxious: {
    label:'Anxious',emoji:'😰',color:'#f97316',
    tracks:[
      {title:'Slow Breath',artist:'Meditation Hz',duration:'7:00',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',art:'🧘'},
      {title:'432 Hz Healing',artist:'Frequency Lab',duration:'8:00',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',art:'✨'},
      {title:'Ground & Centre',artist:'Mindful Audio',duration:'5:30',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',art:'🌿'},
    ]
  },
  lonely: {
    label:'Lonely',emoji:'😔',color:'#a78bfa',
    tracks:[
      {title:'You Are Here',artist:'Connection Beats',duration:'4:20',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',art:'🫂'},
      {title:'Warm Light',artist:'Comfort Sounds',duration:'3:48',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',art:'💛'},
      {title:'Together Apart',artist:'Ambient Duo',duration:'5:05',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',art:'🌟'},
    ]
  },
  stressed: {
    label:'Stressed',emoji:'😤',color:'#f43f5e',
    tracks:[
      {title:'Let It Go',artist:'Release Tones',duration:'5:15',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',art:'🎈'},
      {title:'Tension Breaker',artist:'Stress Relief',duration:'4:40',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',art:'🌀'},
      {title:'Clear Mind',artist:'Focus Lab',duration:'4:00',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',art:'🧠'},
    ]
  }
};

// ══════════════ GAMES DATA ══════════════
const GAMES = [
  {id:'breathing',name:'Breathing Exercise',emoji:'🫁',desc:'4-7-8 technique for calm',moods:['anxious','stressed','sad'],color:'#06b6d4'},
  {id:'memory',name:'Memory Match',emoji:'🃏',desc:'Flip cards, find pairs',moods:['happy','calm','neutral'],color:'#a78bfa'},
  {id:'clicker',name:'Joy Clicker',emoji:'⭐',desc:'Click to collect joy points',moods:['sad','lonely','stressed'],color:'#f59e0b'},
  {id:'scramble',name:'Word Scramble',emoji:'🔤',desc:'Unscramble positive words',moods:['anxious','lonely','stressed'],color:'#f97316'},
];

// ══════════════ STATE ══════════════
let currentMood = null, chartInstance = null;
let audioEl = null, currentPlaylist = [], currentTrackIdx = 0, isPlaying = false, progressTimer = null;
let breathingInterval = null, memoryState = {}, clickerState = {}, scrambleState = {};

// ══════════════ AUTH ══════════════
function getUsers() { try { return JSON.parse(localStorage.getItem('mm_users')||'{}'); } catch { return {}; } }
function saveUsers(u) { localStorage.setItem('mm_users',JSON.stringify(u)); }

// Enhanced hash function
function hash(s) { 
  let h=0;
  for(let i=0;i<s.length;i++){
    const c=s.charCodeAt(i);
    h=((h<<5)-h)+c;
    h=h&h;
  }
  return Math.abs(h).toString(36)+s.length.toString(36);
}

function showLogin() {
  document.getElementById('loginForm').style.display='block';
  document.getElementById('registerForm').style.display='none';
  document.getElementById('loginTitle').textContent='Welcome Back';
  document.getElementById('loginSub').textContent='Sign in to continue your wellness journey.';
  document.getElementById('loginError').textContent='';
}
function showRegister() {
  document.getElementById('loginForm').style.display='none';
  document.getElementById('registerForm').style.display='block';
  document.getElementById('loginTitle').textContent='Create Account';
  document.getElementById('loginSub').textContent='Start your emotional wellness journey today.';
  document.getElementById('regError').textContent='';
}
function togglePass(id,btn) {
  const el = document.getElementById(id);
  el.type = el.type==='password'?'text':'password';
  btn.textContent = el.type==='password'?'👁':'🙈';
}
function doLogin() {
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err  = document.getElementById('loginError');
  
  if (!name || !pass) { err.textContent='Please fill in all fields.'; return; }
  
  const users = getUsers();
  
  if (!users[name.toLowerCase()]) { 
    err.textContent='No account found. Please register first.'; 
    return; 
  }
  
  if (users[name.toLowerCase()].hash !== hash(pass)) { 
    err.textContent='Incorrect password. Try again.'; 
    return; 
  }
  
  err.textContent='';
  localStorage.setItem('mm_user', users[name.toLowerCase()].displayName);
  bootApp();
}
function doRegister() {
  const name  = document.getElementById('regName').value.trim();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  const err   = document.getElementById('regError');
  
  if (!name || !pass || !pass2) { 
    err.textContent='Please fill in all fields.'; 
    return; 
  }
  
  if (name.length < 2) {
    err.textContent='Name must be at least 2 characters.';
    return;
  }
  
  if (pass.length < 4) { 
    err.textContent='Password must be at least 4 characters.'; 
    return; 
  }
  
  if (pass !== pass2) { 
    err.textContent='Passwords do not match.'; 
    return; 
  }
  
  const users = getUsers();
  
  if (users[name.toLowerCase()]) { 
    err.textContent='This name is already taken. Try another.'; 
    return; 
  }
  
  users[name.toLowerCase()] = { 
    displayName: name, 
    hash: hash(pass),
    createdAt: new Date().toISOString()
  };
  saveUsers(users);
  err.textContent='';
  localStorage.setItem('mm_user', name);
  bootApp();
}
function logout() {
  if (!confirm('Log out?')) return;
  localStorage.removeItem('mm_user');
  stopMusic();
  document.getElementById('appMain').style.display='none';
  document.getElementById('loginScreen').style.display='flex';
  showLogin();
}

// ══════════════ BOOT ══════════════
function bootApp() {
  const user = localStorage.getItem('mm_user');
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('appMain').style.display='block';
  document.getElementById('userName').textContent = user;
  document.getElementById('userAvatar').textContent = user[0].toUpperCase();
  
  // Check if user already logged in today and show status
  const h = getHistory();
  const today = new Date().toDateString();
  const hasEntryToday = h.some(e => new Date(e.date).toDateString() === today);
  
  if (hasEntryToday) {
    showToast(`Welcome back, ${user}! 👋`);
  } else {
    const hour = new Date().getHours();
    let greeting = 'Good morning! ☀️';
    if (hour >= 12) greeting = 'Good afternoon! 🌤️';
    if (hour >= 18) greeting = 'Good evening! 🌙';
    showToast(`${greeting} How are you feeling today?`);
  }
  
  refreshStats();
  renderWeeklyHeatmap();
  renderRecentHistory();
  buildMusicTabs();
  loadMusicMood(currentMood||'calm');
  buildGamesGrid();
  
  // Validate data integrity
  validateUserData();
}

window.onload = () => {
  const user = localStorage.getItem('mm_user');
  if (user) { bootApp(); }
  else { document.getElementById('loginScreen').style.display='flex'; showRegister(); }
  document.getElementById('journalText').addEventListener('input', updateWordCount);
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); });
  });
  ['loginName','loginPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  });
  ['regName','regPass','regPass2'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') doRegister(); });
  });
};

// Data validation and recovery
function validateUserData() {
  try {
    const h = getHistory();
    if (!Array.isArray(h)) {
      saveHistory([]);
      return;
    }
    
    // Remove invalid entries
    const valid = h.filter(item => 
      item.mood && MOODS[item.mood] && item.date && !isNaN(new Date(item.date))
    );
    
    if (valid.length !== h.length) {
      saveHistory(valid);
      showToast('⚠️ Cleaned up corrupted entries');
    }
  } catch (err) {
    console.error('Data validation error:', err);
  }
}

// ══════════════ MOOD ══════════════
function pickMood(mood) {
  currentMood = mood;
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
  const d = MOODS[mood];
  document.getElementById('moodFeedback').classList.remove('empty');
  document.getElementById('feedbackTitle').textContent = d.title;
  document.getElementById('feedbackMsg').textContent   = d.msg;
  
  // Generate personalized suggestions based on history
  const suggestions = getPersonalizedSuggestions(mood);
  document.getElementById('suggestionsList').innerHTML = suggestions.map(a=>`<li class="suggestion-tag">${a}</li>`).join('');
  
  loadMusicMood(mood);
  buildGamesGrid();
}

function getPersonalizedSuggestions(mood) {
  const h = getHistory();
  const defaultSuggestions = MOODS[mood].acts;
  
  if (h.length < 3) return defaultSuggestions;
  
  // Analyze what has worked in the past
  const moodEntries = h.filter(entry => entry.mood === mood);
  if (moodEntries.length === 0) return defaultSuggestions;
  
  // Check if certain activities appear in notes alongside this mood improving
  let smartSuggestions = [...defaultSuggestions];
  
  // Add time-aware suggestions
  const hour = new Date().getHours();
  if (mood === 'anxious' || mood === 'stressed') {
    if (hour >= 22 || hour <= 6) smartSuggestions.unshift('Wind down slowly');
    else smartSuggestions.unshift('Take a short break');
  } else if (mood === 'sad' || mood === 'lonely') {
    if (hour >= 13 && hour <= 17) smartSuggestions.unshift('Reach out now');
  }
  
  // Check streak to add encouragement
  const streak = calcStreak(h);
  if (streak >= 5) {
    smartSuggestions.push('🔥 Keep your streak going');
  }
  
  return smartSuggestions.slice(0, 3);
}

// ══════════════ JOURNAL ══════════════
function updateWordCount() {
  const words = document.getElementById('journalText').value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('journalWordCount').textContent = `${words} word${words!==1?'s':''}`;
}
function getHistory() { try { const u=localStorage.getItem('mm_user');return JSON.parse(localStorage.getItem('mm_history_'+u)||'[]'); } catch { return []; } }
function saveHistory(h) { const u=localStorage.getItem('mm_user');localStorage.setItem('mm_history_'+u,JSON.stringify(h)); }

function saveEntry() {
  if (!currentMood) { showToast('Pick a mood first! ✦'); return; }
  
  const note = document.getElementById('journalText').value.trim();
  const h = getHistory();
  
  // Check if user already has an entry for today
  const today = new Date().toDateString();
  const hasEntryToday = h.some(e => new Date(e.date).toDateString() === today);
  
  // Add entry with timestamp
  h.push({
    mood: currentMood,
    emoji: MOODS[currentMood].emoji,
    note: note,
    date: new Date().toISOString(),
    wordCount: note.split(/\s+/).filter(Boolean).length
  });
  
  saveHistory(h);
  
  // Reset form
  document.getElementById('journalText').value='';
  updateWordCount();
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('moodFeedback').classList.add('empty');
  document.getElementById('feedbackTitle').textContent='Select a mood above';
  document.getElementById('feedbackMsg').textContent='to get personalised suggestions';
  document.getElementById('suggestionsList').innerHTML='';
  currentMood=null;
  
  // Update stats
  refreshStats();
  renderWeeklyHeatmap();
  renderRecentHistory();
  
  // Show contextual feedback
  if (hasEntryToday) {
    showToast('Updated your entry for today! 📝');
  } else {
    const streak = calcStreak(h);
    if (streak === 1) {
      showToast('Great start! 🔥 You have a 1 day streak!');
    } else if (streak > 1) {
      showToast(`Amazing! 🔥 ${streak} day streak going!`);
    } else {
      showToast('Entry saved! ✦');
    }
  }
}

// ══════════════ STATS ══════════════
function refreshStats() {
  const h = getHistory();
  document.getElementById('statEntries').textContent = h.length;
  const streak = calcStreak(h);
  document.getElementById('statStreak').textContent  = streak;
  document.getElementById('streakBadge').innerHTML   = streak === 0 ? '🔥 0' : `🔥 ${streak}` + (streak >= 7 ? ' 🎯' : '');
  
  if (!h.length) { 
    document.getElementById('statTopMood').textContent='—'; 
    return; 
  }
  
  const counts = {};
  h.forEach(i => counts[i.mood] = (counts[i.mood] || 0) + 1);
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0][0];
  document.getElementById('statTopMood').textContent = MOODS[top]?.emoji || top;
  
  // Add visual streak milestone indicators
  const streakBadge = document.getElementById('streakBadge');
  if (streak >= 30) streakBadge.style.color = '#fbbf24';
  else if (streak >= 7) streakBadge.style.color = '#f97316';
  else streakBadge.style.color = 'var(--accent)';
}

function calcStreak(history) {
  if (!history.length) return 0;
  
  // Get unique dates sorted in descending order
  const uniqueDates = [...new Set(history.map(i => new Date(i.date).toDateString()))];
  const sortedDates = uniqueDates.map(d => new Date(d)).sort((a,b) => b-a);
  
  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);
  
  // Check if today has an entry
  const hasToday = sortedDates.some(d => d.toDateString() === expectedDate.toDateString());
  
  // Start streak calculation from yesterday if no entry today
  if (!hasToday) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }
  
  for (const d of sortedDates) {
    if (d.toDateString() === expectedDate.toDateString()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (d < expectedDate) {
      break;
    }
  }
  
  // Keep streak if today matches, otherwise reset
  if (!hasToday && streak > 0) {
    streak = 0; // Reset if no entry for today
  }
  
  return streak;
}

// ══════════════ HEATMAP ══════════════
function renderWeeklyHeatmap() {
  const h=getHistory(),container=document.getElementById('weeklyHeatmap');
  container.innerHTML='';
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const entry=[...h].reverse().find(e=>new Date(e.date).toDateString()===d.toDateString());
    const el=document.createElement('div');el.className='heatmap-day';
    el.innerHTML=`<div class="heatmap-dot" title="${entry?entry.mood:'No entry'}">${entry?entry.emoji:''}</div><div class="heatmap-day-label">${DAYS[d.getDay()]}</div>`;
    container.appendChild(el);
  }
}

// ══════════════ RECENT HISTORY ══════════════
function renderRecentHistory() {
  const h=getHistory().slice(-5).reverse(),c=document.getElementById('recentHistory');
  if(!h.length){c.innerHTML='<div class="empty-state">No entries yet. Log a mood to begin ✦</div>';return;}
  c.innerHTML=h.map((item,idx)=>`
    <div class="history-item" style="animation-delay:${idx*.07}s">
      <div class="history-emoji">${item.emoji}</div>
      <div><div class="history-mood">${item.mood}</div>${item.note?`<div class="history-note">"${item.note.substring(0,60)}${item.note.length>60?'…':''}"</div>`:''}</div>
      <div class="history-date">${relTime(item.date)}</div>
    </div>`).join('');
}
function relTime(iso){const diff=Date.now()-new Date(iso).getTime(),m=Math.floor(diff/60000);if(m<1)return'just now';if(m<60)return`${m}m ago`;const h=Math.floor(m/60);if(h<24)return`${h}h ago`;return`${Math.floor(h/24)}d ago`;}

// ══════════════ MODALS ══════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
  if(id==='historyModal') renderHistoryModal();
  if(id==='chartModal')   renderChart();
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function renderHistoryModal() {
  const h=getHistory().reverse(),c=document.getElementById('historyModalList');
  if(!h.length){c.innerHTML='<div class="empty-state">No entries yet.</div>';return;}
  c.innerHTML=h.map((item,idx)=>`
    <div class="history-item" style="animation-delay:${idx*.04}s">
      <div class="history-emoji">${item.emoji}</div>
      <div><div class="history-mood">${item.mood}</div>${item.note?`<div class="history-note">"${item.note.substring(0,80)}${item.note.length>80?'…':''}"</div>`:''}</div>
      <div class="history-date">${new Date(item.date).toLocaleDateString()}</div>
      <button class="close-btn" style="width:24px;height:24px;margin-left:auto;" onclick="deleteEntry(event,'${item.date}')" title="Delete">✕</button>
    </div>`).join('');
}

function deleteEntry(event, dateStr) {
  event.stopPropagation();
  if (!confirm('Delete this entry?')) return;
  let h = getHistory();
  h = h.filter(item => item.date !== dateStr);
  saveHistory(h);
  renderHistoryModal();
  refreshStats();
  renderWeeklyHeatmap();
  renderRecentHistory();
  showToast('Entry deleted');
}

function renderChart() {
  const h = getHistory().slice(-30);
  const counts = {};
  h.forEach(i => counts[i.mood] = (counts[i.mood] || 0) + 1);
  const labels = Object.keys(counts).map(k => `${MOODS[k]?.emoji||''} ${k}`);
  const values = Object.values(counts);
  const colors = Object.keys(counts).map(k => MOODS[k]?.color || '#888');
  
  if(chartInstance){chartInstance.destroy();}
  
  // Show both chart and insights
  const chartContainer = document.getElementById('moodChart');
  const parentDiv = chartContainer.parentElement;
  
  // Add trend text before chart
  let insightHTML = '<div style="margin-bottom:16px;padding:12px;background:rgba(255,255,255,.05);border-radius:12px;">';
  
  if (h.length >= 7) {
    const last7moods = h.slice(-7).map(i => i.mood);
    const positive = last7moods.filter(m => ['happy','calm'].includes(m)).length;
    const challenging = last7moods.filter(m => ['sad','anxious','lonely','stressed'].includes(m)).length;
    
    if (positive >= challenging && positive > 2) {
      insightHTML += '<span style="font-size:.85rem">📈 <strong>Positive trend!</strong> You\'ve had more good moments this week. Keep it up!</span>';
    } else if (challenging > positive && challenging >= 4) {
      insightHTML += '<span style="font-size:.85rem">💙 <strong>You\'re navigating challenges.</strong> Remember, tough weeks build resilience.</span>';
    } else {
      insightHTML += '<span style="font-size:.85rem">⚖️ <strong>Mixed feelings.</strong> That\'s totally normal. Balance is key.</span>';
    }
  }
  insightHTML += '</div>';
  
  // Insert insight before chart
  if (!parentDiv.querySelector('[data-insight-added]')) {
    const insightEl = document.createElement('div');
    insightEl.setAttribute('data-insight-added', 'true');
    insightEl.innerHTML = insightHTML;
    parentDiv.insertBefore(insightEl, chartContainer);
  } else {
    parentDiv.querySelector('[data-insight-added]').innerHTML = insightHTML;
  }
  
  chartInstance = new Chart(chartContainer.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#f0eaf8',
            font: { family: 'DM Sans', size: 12 },
            padding: 14
          }
        }
      },
      animation: { animateRotate: true, duration: 700 }
    }
  });
}

// ══════════════ MUSIC ══════════════
function buildMusicTabs() {
  const container=document.getElementById('musicMoodTabs');
  container.innerHTML=Object.entries(MUSIC_PLAYLISTS).map(([key,pl])=>
    `<button class="mood-tab ${key==='calm'?'active':''}" onclick="loadMusicMood('${key}');document.querySelectorAll('.mood-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">${pl.emoji} ${pl.label}</button>`
  ).join('');
}

function loadMusicMood(mood) {
  const pl=MUSIC_PLAYLISTS[mood]||MUSIC_PLAYLISTS.calm;
  currentPlaylist=pl.tracks;
  if(currentTrackIdx>=currentPlaylist.length)currentTrackIdx=0;
  buildPlaylistUI(pl);
  loadTrack(currentTrackIdx);
  // Update active tab
  document.querySelectorAll('.mood-tab').forEach(t=>{
    if(t.textContent.includes(pl.label))t.classList.add('active');
    else t.classList.remove('active');
  });
}

function buildPlaylistUI(pl) {
  document.getElementById('musicPlaylist').innerHTML=pl.tracks.map((t,i)=>`
    <div class="playlist-item ${i===currentTrackIdx?'active':''}" id="pl-item-${i}" onclick="selectTrack(${i})">
      <div class="playlist-item-num">${i+1}</div>
      <div style="font-size:1.2rem">${t.art}</div>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${t.title}</div>
        <div class="playlist-item-dur">${t.artist} · ${t.duration}</div>
      </div>
      ${i===currentTrackIdx?'<div class="playlist-item-playing">♪ NOW</div>':''}
    </div>`).join('');
}

function loadTrack(idx) {
  currentTrackIdx=idx;
  const track=currentPlaylist[idx];
  document.getElementById('musicTitle').textContent=track.title;
  document.getElementById('musicArtist').textContent=track.artist;
  document.getElementById('musicArt').textContent=track.art;
  document.getElementById('progressFill').style.width='0%';
  document.getElementById('timeElapsed').textContent='0:00';
  document.getElementById('timeDuration').textContent=track.duration;
  if(audioEl){audioEl.pause();audioEl=null;}
  clearInterval(progressTimer);
  audioEl=new Audio(track.src);
  const volSlider = document.querySelector('.volume-slider');
  audioEl.volume = volSlider ? volSlider.value : 0.7;
  audioEl.addEventListener('ended',nextTrack);
  audioEl.addEventListener('error',()=>{
    console.warn('Audio playback failed - file unavailable');
    if(isPlaying) {
      showToast('⚠️ Unable to load audio. Check your connection.');
    }
  });
  // Highlight playlist
  document.querySelectorAll('.playlist-item').forEach((el,i)=>{
    el.classList.toggle('active',i===idx);
    el.querySelector('.playlist-item-playing') && el.querySelector('.playlist-item-playing').remove();
    if(i===idx){const s=document.createElement('div');s.className='playlist-item-playing';s.textContent='♪ NOW';el.appendChild(s);}
  });
  if(isPlaying){audioEl.play().catch(()=>{});startProgressTimer();}
}

function togglePlay() {
  if(!audioEl)return;
  if(isPlaying){audioEl.pause();clearInterval(progressTimer);isPlaying=false;document.getElementById('playBtn').textContent='▶';}
  else{audioEl.play().catch(e=>{showToast('⚠️ Click play again if audio doesn\'t start');console.warn(e);});startProgressTimer();isPlaying=true;document.getElementById('playBtn').textContent='⏸';}
}

function startProgressTimer() {
  clearInterval(progressTimer);
  progressTimer=setInterval(()=>{
    if(!audioEl||!isFinite(audioEl.duration))return;
    const pct=(audioEl.currentTime/audioEl.duration)*100;
    document.getElementById('progressFill').style.width=pct+'%';
    document.getElementById('timeElapsed').textContent=fmtTime(audioEl.currentTime);
  },500);
}

function fmtTime(s){const m=Math.floor(s/60);return`${m}:${String(Math.floor(s%60)).padStart(2,'0')}`;}

function seekMusic(e) {
  if(!audioEl||!isFinite(audioEl.duration))return;
  const rect=e.currentTarget.getBoundingClientRect();
  audioEl.currentTime=((e.clientX-rect.left)/rect.width)*audioEl.duration;
}

function prevTrack(){loadTrack((currentTrackIdx-1+currentPlaylist.length)%currentPlaylist.length);}
function nextTrack(){loadTrack((currentTrackIdx+1)%currentPlaylist.length);}
function selectTrack(i){loadTrack(i);if(!isPlaying){isPlaying=true;audioEl.play().catch(()=>{});startProgressTimer();document.getElementById('playBtn').textContent='⏸';}}
function setVolume(v){if(audioEl)audioEl.volume=v;}
function stopMusic(){if(audioEl){audioEl.pause();audioEl=null;}clearInterval(progressTimer);isPlaying=false;}

// ══════════════ GAMES ══════════════
function buildGamesGrid() {
  const container=document.getElementById('gamesGrid');
  const sorted=[...GAMES].sort((a,b)=>{
    const mood=currentMood||'happy';
    return (b.moods.includes(mood)?1:0)-(a.moods.includes(mood)?1:0);
  });
  container.innerHTML=sorted.map(g=>`
    <div class="game-card" onclick="launchGame('${g.id}')">
      <div class="game-emoji">${g.emoji}</div>
      <div class="game-name">${g.name}</div>
      <div class="game-desc">${g.desc}</div>
      <div class="game-mood-badge">${g.moods.includes(currentMood||'happy')?'✦ Recommended':'Good for you'}</div>
    </div>`).join('');
}

function launchGame(id) {
  document.getElementById('gamesHome').style.display='none';
  document.getElementById('gameArea').style.display='block';
  if(id==='breathing')startBreathing();
  else if(id==='memory')startMemory();
  else if(id==='clicker')startClicker();
  else if(id==='scramble')startScramble();
}

function backToGames() {
  clearInterval(breathingInterval);
  document.getElementById('gamesHome').style.display='block';
  document.getElementById('gameArea').style.display='none';
}

// ── BREATHING GAME ──
function startBreathing() {
  clearInterval(breathingInterval);
  let phase='inhale',count=4,total=0;
  const phases={inhale:{dur:4,next:'hold',label:'Inhale…'},hold:{dur:7,next:'exhale',label:'Hold…'},exhale:{dur:8,next:'inhale',label:'Exhale…'}};
  document.getElementById('gameContent').innerHTML=`
    <div style="text-align:center">
      <h3 style="font-family:'DM Serif Display',serif;margin-bottom:4px">4-7-8 Breathing</h3>
      <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:20px">Inhale 4s · Hold 7s · Exhale 8s</p>
      <div class="breathing-circle" id="breathCircle">Inhale…</div>
      <div class="breathing-counter" id="breathCount">4</div>
      <div class="breathing-instruction" id="breathPhase">Get comfortable and begin</div>
      <div style="margin-top:16px;font-size:.8rem;color:var(--text-muted)">Cycles: <span id="breathCycles">0</span></div>
      <button class="game-btn" style="margin-top:20px" onclick="clearInterval(breathingInterval);backToGames()">End Session</button>
    </div>`;

  function tick() {
    const el=document.getElementById('breathCircle');
    const ci=document.getElementById('breathCount');
    const pi=document.getElementById('breathPhase');
    if(!el)return;
    ci.textContent=count;
    pi.textContent=phases[phase].label;
    el.textContent=phases[phase].label;
    if(phase==='inhale')el.classList.add('expand'),el.classList.remove('shrink');
    else if(phase==='exhale')el.classList.add('shrink'),el.classList.remove('expand');
    count--;
    if(count<0){
      if(phase==='exhale')total++,document.getElementById('breathCycles').textContent=total;
      phase=phases[phase].next;count=phases[phase].dur-1;
    }
  }
  tick();
  breathingInterval=setInterval(tick,1000);
}

// ── MEMORY GAME ──
function startMemory() {
  const emojis=['🌸','🌈','⭐','🎵','💙','🌿','☀️','🦋'];
  let cards=[...emojis,...emojis].sort(()=>Math.random()-.5);
  let flipped=[],matched=[],moves=0,canFlip=true;

  memoryState={cards,flipped,matched,moves};
  renderMemory();

  function renderMemory(){
    document.getElementById('gameContent').innerHTML=`
      <div style="text-align:center">
        <h3 style="font-family:'DM Serif Display',serif;margin-bottom:4px">Memory Match</h3>
        <div class="memory-score">Moves: <b id="memMoves">0</b> | Matched: <b id="memMatched">0</b>/8</div>
        <div class="memory-grid" id="memGrid"></div>
        <button class="game-btn" onclick="startMemory()">Restart</button>
      </div>`;
    const grid=document.getElementById('memGrid');
    cards.forEach((emoji,i)=>{
      const card=document.createElement('div');
      card.className='memory-card'+(matched.includes(i)?' matched':(flipped.includes(i)?' flipped':''));
      card.innerHTML=`<span class="memory-card-back">${(matched.includes(i)||flipped.includes(i))?emoji:'❓'}</span>`;
      if(!matched.includes(i))card.onclick=()=>flipCard(i,emoji);
      grid.appendChild(card);
    });
    document.getElementById('memMoves').textContent=moves;
    document.getElementById('memMatched').textContent=matched.length/2;
  }

  function flipCard(i,emoji){
    if(!canFlip||flipped.includes(i)||matched.includes(i))return;
    flipped.push(i);
    const cardEl=document.querySelectorAll('.memory-card')[i];
    cardEl.classList.add('flipped');
    cardEl.querySelector('.memory-card-back').textContent=emoji;
    if(flipped.length===2){
      canFlip=false;moves++;
      const [a,b]=flipped;
      if(cards[a]===cards[b]){
        matched.push(a,b);flipped=[];canFlip=true;
        renderMemory();
        if(matched.length===cards.length)setTimeout(()=>{showToast('🎉 You matched them all!');},300);
      } else {
        setTimeout(()=>{flipped=[];canFlip=true;renderMemory();},900);
      }
    }
    document.getElementById('memMoves').textContent=moves;
  }
}

// ── JOY CLICKER ──
function startClicker() {
  let score=0,combo=0,comboTimer=null;
  const emojis={sad:'💙',lonely:'🫂',stressed:'🌸',anxious:'🌿',happy:'⭐',calm:'✨'};
  const emo=emojis[currentMood]||'⭐';
  document.getElementById('gameContent').innerHTML=`
    <div class="clicker-area">
      <h3 style="font-family:'DM Serif Display',serif;margin-bottom:4px">Joy Clicker</h3>
      <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:16px">Click to collect joy! Faster = higher combo!</p>
      <div class="clicker-score" id="clickScore">0</div>
      <div class="clicker-label">Joy Points</div>
      <div class="clicker-combo" id="clickCombo"></div>
      <div class="clicker-emoji" id="clickEmoji" onclick="doClick()">${emo}</div>
      <div style="margin-top:16px">
        <button class="game-btn" onclick="startClicker()">Reset</button>
      </div>
    </div>`;

  window.doClick=function(){
    score++;combo++;
    clearTimeout(comboTimer);
    comboTimer=setTimeout(()=>{combo=0;const c=document.getElementById('clickCombo');if(c)c.textContent='';},1200);
    const sc=document.getElementById('clickScore');
    const cc=document.getElementById('clickCombo');
    const ce=document.getElementById('clickEmoji');
    if(sc)sc.textContent=score;
    if(cc)cc.textContent=combo>4?`🔥 x${combo} COMBO!`:combo>1?`x${combo}`:'';
    if(ce){ce.style.transform='scale(1.25)';setTimeout(()=>{if(ce)ce.style.transform='scale(1)';},100);}
    // Spawn floating +1
    const el=document.createElement('div');
    el.textContent=combo>4?`+${combo}!`:'+1';
    el.style.cssText=`position:absolute;color:var(--accent2);font-weight:700;font-size:${combo>4?'1.2rem':'0.9rem'};pointer-events:none;animation:floatUp .8s ease forwards;left:${40+Math.random()*20}%;top:60%`;
    document.querySelector('.clicker-area').style.position='relative';
    document.querySelector('.clicker-area').appendChild(el);
    setTimeout(()=>el.remove(),800);
  };

  // Add float-up animation
  if(!document.getElementById('clickerStyle')){
    const s=document.createElement('style');s.id='clickerStyle';
    s.textContent='@keyframes floatUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-40px)}}';
    document.head.appendChild(s);
  }
}

// ── WORD SCRAMBLE ──
function startScramble() {
  const words=['HAPPY','PEACE','BRAVE','SMILE','CALM','SHINE','HOPE','LOVE','GLOW','KIND','FREE','JOY'];
  let score=0,skips=3;

  function newWord(){
    const w=words[Math.floor(Math.random()*words.length)];
    const scrambled=w.split('').sort(()=>Math.random()-.5).join('');
    scrambleState={word:w,scrambled};
    document.getElementById('scrambleDisplay').textContent=scrambled;
    document.getElementById('scrambleInput').value='';
    document.getElementById('scrambleFeedback').textContent='';
    document.getElementById('scrambleInput').focus();
  }

  document.getElementById('gameContent').innerHTML=`
    <div style="text-align:center">
      <h3 style="font-family:'DM Serif Display',serif;margin-bottom:4px">Word Scramble</h3>
      <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:12px">Unscramble these positive words!</p>
      <div class="game-stats-row">
        <div class="game-stat"><div class="game-stat-num" id="scrScore">0</div><div class="game-stat-label">Score</div></div>
        <div class="game-stat"><div class="game-stat-num" id="scrSkips">3</div><div class="game-stat-label">Skips Left</div></div>
      </div>
      <div class="scramble-word" id="scrambleDisplay">LOADING</div>
      <input class="scramble-input" id="scrambleInput" placeholder="Type your answer…" maxlength="10"
        oninput="checkScramble()" style="text-transform:uppercase">
      <div class="scramble-feedback" id="scrambleFeedback"></div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:12px">
        <button class="game-btn" onclick="skipScramble()">Skip (${skips} left)</button>
        <button class="action-btn" style="flex:none" onclick="startScramble()">Restart</button>
      </div>
    </div>`;

  window.checkScramble=function(){
    const val=document.getElementById('scrambleInput').value.toUpperCase().trim();
    const fb=document.getElementById('scrambleFeedback');
    if(val===scrambleState.word){
      score++;
      document.getElementById('scrScore').textContent=score;
      fb.style.color='#4ade80';fb.textContent='✓ Correct! 🎉';
      setTimeout(newWord,800);
    }
  };
  window.skipScramble=function(){
    if(skips<=0){showToast('No skips left!');return;}
    skips--;
    document.getElementById('scrSkips').textContent=skips;
    document.getElementById('scrambleFeedback').style.color='var(--accent)';
    document.getElementById('scrambleFeedback').textContent=`Answer was: ${scrambleState.word}`;
    document.querySelector('.game-btn').textContent=`Skip (${skips} left)`;
    setTimeout(newWord,1000);
  };

  newWord();
}

// ══════════════ THEME ══════════════
function toggleTheme(){
  document.body.classList.toggle('light');
  document.querySelector('.icon-btn[title="Toggle theme"]').textContent=document.body.classList.contains('light')?'🌙':'☀️';
}

// ══════════════ HELPERS ══════════════
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
