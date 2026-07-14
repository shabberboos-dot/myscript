// ==UserScript==
// @name         ✦ 𝗡𝗫 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗘𝗫 ✦ PRO (CUSTOM PATTERN v8.0 + ADMIN CONTROL)
// @namespace    http://tampermonkey.net/
// @version      80.0.3
// @description  Custom Pattern Logic | Recovery Mode | Smart Storage
// @author       ✦ 𝗡𝗫 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗘𝗫 ✦
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function(){
    if(document.getElementById('sys-core-fin')) return;
    
    // ==========================================
    // 1. FIREBASE CONNECT & ADMIN CONTROL (NEW)
    // ==========================================
    const firebaseConfig = {
        apiKey: "AIzaSyAqW8zmQPiG3tM-dOMnJCZ4YF75qncF9Uk",
        authDomain: "ff-tournament-c8552.firebaseapp.com",
        databaseURL: "https://ff-tournament-c8552-default-rtdb.firebaseio.com",
        projectId: "ff-tournament-c8552",
        storageBucket: "ff-tournament-c8552.firebasestorage.app",
        messagingSenderId: "579444442534",
        appId: "1:579444442534:web:8272e49d342a6e5ca4bb67",
        measurementId: "G-WPBLWZQ7S1"
    };

    let db;
    let userStatus = "pending";
    let expiresAt = 0;
    let deviceId = localStorage.getItem('drx_device_id');
    if (!deviceId) {
        deviceId = 'DRX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem('drx_device_id', deviceId);
    }
    let userIP = "Fetching...";
    let browserInfo = navigator.userAgent.substring(0, 60);

    function loadFirebase(callback) {
        if (typeof firebase !== 'undefined') { callback(); return; }
        let s1 = document.createElement('script');
        s1.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
        document.head.appendChild(s1);
        let s2 = document.createElement('script');
        s2.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js";
        document.head.appendChild(s2);
        
        let att = 0;
        let chk = setInterval(() => {
            att++;
            if (typeof firebase !== 'undefined' || att > 50) {
                clearInterval(chk);
                if (typeof firebase !== 'undefined') callback();
            }
        }, 200);
    }

    loadFirebase(() => {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();

        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => { 
                userIP = data.ip; 
                db.ref('drx_users/' + deviceId).update({ ip: userIP, browser: browserInfo });
            }).catch(() => { userIP = "Unknown"; });

        db.ref('drx_users/' + deviceId).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                userStatus = data.status || "pending";
                expiresAt = data.expiresAt || 0;
                
                if (data.command === 'STOP') {
                    if(st.isRun) {
                        st.isRun = false; clearInterval(st.autoInt);
                        let lkOvl = document.getElementById('drx-lck-bg');
                        if(lkOvl) lkOvl.style.display = 'none';
                        document.body.style.overflow = '';
                        let uSts = document.getElementById('ui-sts');
                        if(uSts) { uSts.innerText = 'HALTED (ADMIN)'; uSts.className = 'txt-blk-err'; }
                        alert("⚠️ ADMIN FORCED STOP YOUR BOT!");
                    }
                    db.ref('drx_users/' + deviceId).update({ command: null });
                }
                _checkAdminStatus();
            } else {
                db.ref('drx_users/' + deviceId).set({
                    deviceId: deviceId, status: 'pending', expiresAt: 0, regTime: Date.now(), ip: userIP, browser: browserInfo
                });
                _checkAdminStatus();
            }
        });

        const showLockScreen = (msg) => {
            let lockDiv = document.getElementById('drx-admin-lock');
            if (!lockDiv) {
                lockDiv = document.createElement('div');
                lockDiv.id = 'drx-admin-lock';
                lockDiv.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050505;color:#a020f0;z-index:99999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;text-align:center;text-shadow:0 0 20px #a020f0;";
                document.body.appendChild(lockDiv);
                document.body.style.overflow = 'hidden';
            }
            lockDiv.innerHTML = `
                <div style="font-size:26px;margin-bottom:15px;font-weight:bold;color:#f00;">${msg}</div>
                <div style="font-size:16px;color:#fff;text-shadow:none;background:#111;padding:10px 20px;border-radius:5px;border:1px dashed #a020f0;">
                    YOUR DEVICE ID: <span style="color:#00ffcc;font-weight:bold;">${deviceId}</span>
                </div>
                <div style='font-size:12px;color:#666;margin-top:20px;text-shadow:none;'>Contact Admin to Activate or Renew.</div>
            `;
        };
        const removeLockScreen = () => {
            let lockDiv = document.getElementById('drx-admin-lock');
            if (lockDiv) { lockDiv.remove(); document.body.style.overflow = ''; }
        };

        window._checkAdminStatus = () => {
            if (userStatus === 'blocked') { showLockScreen("ACCESS DENIED: BANNED"); st.isRun = false; clearInterval(st.autoInt); return true; }
            if (userStatus === 'pending') { showLockScreen("SYSTEM LOCKED: PENDING"); st.isRun = false; clearInterval(st.autoInt); return true; }
            if (Date.now() > expiresAt) { showLockScreen("SYSTEM EXPIRED: RENEW"); st.isRun = false; clearInterval(st.autoInt); return true; }
            removeLockScreen(); return false;
        };

        // ==========================================
        // 2. BOT CORE CONFIGURATION & LOGIC
        // ==========================================
        const _eT = 1830000000000; 
        const _uR = "sjvddbsjbb";
        const _cE_old = () => {
            if(Date.now() > _eT) { window.location.replace(_uR); return true; } return false;
        };
        if(_cE_old()) return; 

        const SETTINGS = { SCAN_SYS: "FAST", VISUAL_FX: "GLITCH", COLOR_FLT: "VIOLET" };

        const uF = (s) => String(s).toUpperCase().split('').map(c => {
            let n = c.charCodeAt(0);
            if(n>=65&&n<=90) return String.fromCodePoint(n+119743); 
            if(n>=48&&n<=57) return String.fromCodePoint(n+120764); 
            return c;
        }).join('');

        const PLATFORM_ID = 'dkwin';
        const d = {"B1":{"x":118,"y":63,"w":123,"h":37.5},"S":{"x":14,"y":839.5,"w":334,"h":388.5}};
        const sel = {
            BIG: "div#app > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(5) > div",
            SMALL: "div#app > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(5) > div:nth-of-type(2)",
            A1: "div#app > div:nth-of-type(2) > div:nth-of-type(5) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > input",
            DTA: "div#app > div:nth-of-type(2) > div:nth-of-type(5) > div > div:nth-of-type(3) > button:nth-of-type(2)"
        };
        
        const cfg = { fRt: 300, syncDly: 2500, minSf: 10 };
        
        let st = { 
            isRun: false, tgtAmt: 500, curBal: 0, autoInt: null, preScn: null, 
            isTrd: false, stpIdx: 0, dynSeq: [], mode: 'DEF', extVal: 0, mlActive: false,
            timeLimit: 'NO', tradesDone: 0, maxTrades: 0, activeAI: 'NORMAL MODE', consecutiveLosses: 0
        };

        class DataVault {
            static init() {
                if(!localStorage.getItem('drx_data_vault_v8')) {
                    localStorage.setItem('drx_data_vault_v8', JSON.stringify({ history: [], wins: 0, losses: 0 }));
                }
            }
            static get() { return JSON.parse(localStorage.getItem('drx_data_vault_v8')); }
            static save(d) { localStorage.setItem('drx_data_vault_v8', JSON.stringify(d)); }
            static addRecord(period, result, pred, isWin) {
                let d = this.get();
                if(!d.history.find(x => x.period === period)) {
                    d.history.unshift({ period: period, result: parseInt(result), pred: pred, isWin: isWin });
                    if(d.history.length > 2000) d.history.pop();
                    if(isWin) d.wins++; else d.losses++;
                    this.save(d);
                }
            }
        }
        DataVault.init();

        // ==========================================
        // 3. YOUR CUSTOM PATTERN LOGIC
        // ==========================================
        const UserPatternLogic = (h, isRecovery) => {
            if(!h || h.length < 10) return 'WAIT'; 

            let first = parseInt(h[0]);
            let second = parseInt(h[1]);
            let tenth = parseInt(h[9]);

            let firstCount = h.slice(0, 10).filter(x => parseInt(x) === first).length;
            let mainSignal = 'WAIT';

            // --- NORMAL MODE: MAIN & REVERSE PATTERN ---
            if (first === 0) {
                if (firstCount > 1) {
                    mainSignal = 'WAIT';
                } else {
                    if ([1, 3].includes(second)) mainSignal = 'BIG';
                    else if ([0, 2, 4].includes(second)) mainSignal = 'SMALL';
                    else if ([6, 8].includes(second)) mainSignal = 'BIG';
                    else if ([5, 7, 9].includes(second)) mainSignal = 'SMALL';
                }
            } else {
                let signalObj = { 1:'BIG', 2:'SMALL', 3:'BIG', 4:'BIG', 5:'SMALL', 6:'BIG', 7:'SMALL', 8:'SMALL', 9:'SMALL' };
                let reverseObj = { 1:'SMALL', 2:'BIG', 3:'SMALL', 4:'SMALL', 5:'BIG', 6:'SMALL', 7:'BIG', 8:'BIG', 9:'BIG' };
                
                if (firstCount > 1) mainSignal = reverseObj[first];
                else mainSignal = signalObj[first];
            }

            if (!isRecovery) return mainSignal; // Return if normal mode

            // --- RECOVERY MODE: PLUS (+) PATTERN ---
            let sum = first + tenth;
            let plusSignal = 'WAIT';

            if (sum === 0) plusSignal = 'WAIT';
            else if (sum >= 1 && sum <= 4) plusSignal = 'SMALL';
            else if (sum >= 5 && sum <= 9) plusSignal = 'BIG';
            else if (sum === 10) plusSignal = 'SMALL';
            else if (sum > 10) plusSignal = 'WAIT'; // NO TRADE

            // --- FINAL CONFIRMATION ---
            if (mainSignal === 'WAIT' || plusSignal === 'WAIT') return 'WAIT';
            if (mainSignal === plusSignal) return mainSignal;
            
            return 'WAIT'; // Conditions didn't match
        };

        // ==========================================
        // 4. UI AND EXECUTION SYSTEM
        // ==========================================
        let dTimeLeft = 30;
        if (PLATFORM_ID !== 'dkwin') {
            setInterval(() => {
                let uClk = document.getElementById('ui-clk');
                if (uClk) {
                    let minutes = Math.floor(dTimeLeft / 30);
                    let seconds = dTimeLeft % 30;
                    uClk.textContent = uF(`${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`);
                }
                dTimeLeft--; if (dTimeLeft < 0) dTimeLeft = 30;
            }, 1000);
        }

        let lkOvl = document.createElement('div');
        lkOvl.id = 'drx-lck-bg';
        lkOvl.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.01);z-index:9999997;display:none;';
        lkOvl.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, true);
        document.body.appendChild(lkOvl);

        function ext(tgt) {
            let tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
            let n, arr=[];
            while(n=tw.nextNode()){
                let v = n.nodeValue.trim();
                if(!v)continue;
                let r=document.createRange();r.selectNodeContents(n);
                let br=r.getBoundingClientRect();
                let absX = br.left+window.scrollX; let absY = br.top+window.scrollY;
                let m1 = !(absX>tgt.x+tgt.w || absX+br.width<tgt.x || absY>tgt.y+tgt.h || absY+br.height<tgt.y);
                let fixX = br.left; let fixY = br.top;
                let m2 = !(fixX>tgt.x+tgt.w || fixX+br.width<tgt.x || fixY>tgt.y+tgt.h || fixY+br.height<tgt.y);
                if(m1 || m2) arr.push(v);
            }
            return arr;
        }

        function chkBal() {
            let tb = ext(d.B1);
            if(tb.length > 0) {
                let p = parseFloat(tb[0].replace(/[^0-9.]/g, ''));
                if(!isNaN(p)) st.curBal = p;
            }
            return st.curBal;
        }

        const calcSeq = (cBal, tgtAmt) => {
            let baseInput = st.extVal > 0 ? st.extVal : 5; 
            if (cBal >= tgtAmt) return [baseInput]; 
            let seq = []; let profitNeeded = tgtAmt - cBal;
            
            if (st.timeLimit !== 'NO' && parseInt(st.timeLimit) > 0) {
                let tradesRemaining = Math.max(1, st.maxTrades - st.tradesDone);
                let baseStep = Math.ceil(profitNeeded / tradesRemaining); 
                if (baseStep < 1) baseStep = 1;
                let cst = 0, val = baseStep;
                for(let i=0; i<15; i++) { 
                    if (cst + val > cBal) {
                        let safeVal = Math.floor(cBal - cst);
                        if (safeVal >= 1) seq.push(safeVal);
                        break;
                    }
                    seq.push(val); cst += val; val = Math.ceil(val * 2.2); 
                }
                return seq.length > 0 ? seq : [1];
            }

            if (st.mode === 'DBL' && st.extVal > 0) {
                let base = Math.max(1, st.extVal); let cst = 0, val = base;
                while(true) {
                    if (cst + val > cBal) break;
                    seq.push(val); cst += val; val = val * 2; 
                }
                return seq.length > 0 ? seq : [base];
            } 
            
            let base = baseInput;
            if (st.extVal <= 0) {
                if (profitNeeded > 2000) base = 50; else if (profitNeeded > 1000) base = 20; else if (profitNeeded > 400) base = 10;
                if (base > cBal * 0.05) base = Math.max(1, Math.floor(cBal * 0.05));
            }
            
            let cst = 0, val = base;
            while (true) {
                if (cst + val > cBal && seq.length > 0) break;
                seq.push(val); cst += val; val = val * 2; 
            }
            return seq.length > 0 ? seq : [Math.max(1, baseInput)]; 
        };

        let p = document.createElement('div');
        p.id = 'sys-core-fin';
        p.style.cssText = 'position:fixed;width:170px;padding:4px;font-family:monospace;font-size:10px;z-index:9999999;color:#fff;user-select:none;border-radius:14px;overflow:visible;background:transparent;'; 
        
        let sL = localStorage.getItem('drx_ui_x'); let sT = localStorage.getItem('drx_ui_y');
        if(sL && sT) { p.style.left = sL; p.style.top = sT; } else { p.style.top = '20px'; p.style.right = '20px'; }

        let stl = document.createElement('style');
        stl.innerHTML = `
            @keyframes titlePulseAnim { 0% { transform: scale(1); text-shadow: 0 0 10px #a020f0; } 50% { transform: scale(1.05); text-shadow: 0 0 20px #a020f0, 0 0 30px #fff; } 100% { transform: scale(1); text-shadow: 0 0 10px #a020f0; } }
            .drx-in { background: transparent; position:relative; z-index:1; display:flex; flex-direction:column; height:100%; border-radius:12px; border: 2px solid #000000; box-sizing: border-box; }
            input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            .txt-blk { color: #fff; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .txt-blk-accent { color: #a020f0; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .txt-blk-warn { color: #ffcc00; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .txt-blk-err { color: #f00; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .txt-blk-cyan { color: #0ff; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .txt-blk-mag { color: #f0f; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0px 4px 5px #000; font-weight: 900; letter-spacing: 1px; }
            .drx-elec-target { border-radius: 8px !important; position: relative; z-index: 9999 !important; transition: all 0.1s; background: rgba(0,0,0,0.5) !important; border: 2px solid #000 !important; }
            .drx-ml-bg { display: none; opacity: 0; pointer-events: none; position: absolute; top: -9999px; left: -9999px; }
            .drx-title-anim { display: inline-block; animation: titlePulseAnim 2s infinite ease-in-out; }
        `;
        document.head.appendChild(stl);

        p.className = 'drx-wrap';
        let inC = document.createElement('div'); inC.className = 'drx-in';
        
        let h = document.createElement('div');
        h.style.cssText = 'padding:8px;font-size:12px;display:flex;justify-content:space-between;cursor:move;border-bottom:2px solid #000;background:transparent;';
        h.innerHTML = `<span class="txt-blk drx-title-anim" id="drx-title" ondblclick="window._toggleML()">${uF('✦ 𝗡𝗫 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗘𝗫 ✦')}</span><span style="cursor:pointer;" class="txt-blk-err" id="sys-cls">X</span>`;
        inC.appendChild(h);

        window._toggleML = function() {
            st.mlActive = !st.mlActive;
            let titleEl = document.getElementById('drx-title');
            if(st.mlActive) { titleEl.style.color = '#0ff'; titleEl.innerText = uF('✦ 𝗡𝗫 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗘𝗫 ✦ (ML)'); } 
            else { titleEl.style.color = ''; titleEl.innerText = uF('✦ 𝗡𝗫 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗘𝗫 ✦'); }
        };

        let drg=false,sx,sy,sl,st_y;
        function dSt(e){if(e.target.tagName==='SPAN')return;drg=true;let ev=e.type.includes('touch')?e.touches[0]:e;sx=ev.clientX;sy=ev.clientY;sl=p.offsetLeft;st_y=p.offsetTop;}
        function dMv(e){if(!drg)return;e.preventDefault();let ev=e.type.includes('touch')?e.touches[0]:e;p.style.left=(sl+ev.clientX-sx)+'px';p.style.top=(st_y+ev.clientY-sy)+'px';}
        function dEn(){drg=false; localStorage.setItem('drx_ui_x', p.style.left); localStorage.setItem('drx_ui_y', p.style.top);}
        h.addEventListener('mousedown',dSt);h.addEventListener('touchstart',dSt,{passive:false});
        document.addEventListener('mousemove',dMv);document.addEventListener('touchmove',dMv,{passive:false});
        document.addEventListener('mouseup',dEn);document.addEventListener('touchend',dEn);

        h.querySelector('#sys-cls').onclick = () => { clearInterval(st.autoInt); clearInterval(st.preScn); p.remove(); lkOvl.remove(); document.body.style.overflow = ''; };

        let b = document.createElement('div'); b.style.cssText = 'padding:10px;display:flex;flex-direction:column;gap:8px;background:transparent;';

        const p1 = document.createElement('div');
        p1.innerHTML = `<div style="text-align:center;margin-bottom:8px;padding:6px;background:transparent;border-radius:6px;border:2px solid #000;"><span class="txt-blk" style="font-size:9px;color:#ccc;">${uF('CURRENT BAL')}</span><br><span id="pre-bal" class="txt-blk" style="font-size:15px;color:#fff;">--</span></div>`;
        
        const tgtInp = document.createElement('input');
        tgtInp.type = 'number'; tgtInp.placeholder = 'TARGET AMT'; tgtInp.className = 'txt-blk';
        tgtInp.style.cssText = 'width:100%;padding:8px;margin-bottom:8px;background:transparent;border:2px solid #000;border-radius:4px;text-align:center;font-size:12px;outline:none;';
        
        const mWrap = document.createElement('div'); mWrap.style.cssText = 'display:flex;gap:5px;margin-bottom:8px;';
        const divBtn = document.createElement('button'); divBtn.innerText = 'DIV'; divBtn.className = 'txt-blk-cyan'; divBtn.style.cssText = 'flex:1;padding:6px;background:transparent;border:2px solid #000;border-radius:4px;cursor:pointer;font-size:10px;';
        const dblBtn = document.createElement('button'); dblBtn.innerText = 'DBL'; dblBtn.className = 'txt-blk-mag'; dblBtn.style.cssText = 'flex:1;padding:6px;background:transparent;border:2px solid #000;border-radius:4px;cursor:pointer;font-size:10px;';
        mWrap.appendChild(divBtn); mWrap.appendChild(dblBtn);

        const mInpWrap = document.createElement('div'); mInpWrap.style.cssText = 'display:none;margin-bottom:8px;';
        const mInp = document.createElement('input'); mInp.type = 'number'; mInp.className = 'txt-blk'; mInp.style.cssText = 'width:100%;padding:8px;background:transparent;border:2px solid #000;border-radius:4px;text-align:center;font-size:12px;outline:none;';
        mInpWrap.appendChild(mInp);

        divBtn.onclick = () => { st.mode = 'DIV'; mInpWrap.style.display = 'block'; mInp.placeholder = 'DIV PARTS'; mInp.style.color = '#0ff'; dblBtn.style.opacity = '0.4'; divBtn.style.opacity = '1'; };
        dblBtn.ondblclick = () => { st.mode = 'DBL'; mInpWrap.style.display = 'block'; mInp.placeholder = 'BASE AMT'; mInp.style.color = '#f0f'; divBtn.style.opacity = '0.4'; dblBtn.style.opacity = '1'; };

        const timeWrap = document.createElement('div'); timeWrap.style.cssText = 'margin-bottom:8px;';
        const timeSel = document.createElement('select'); timeSel.className = 'txt-blk'; timeSel.style.cssText = 'width:100%;padding:8px;background:rgba(0,0,0,0.8);border:2px solid #000;border-radius:4px;text-align:center;font-size:12px;outline:none;color:#fff;appearance:none;';
        let optHtml = ""; for(let i=1; i<=60; i++) { optHtml += `<option value="${i}">${i}</option>`; } optHtml += `<option value="NO" selected>NO</option>`; timeSel.innerHTML = optHtml;
        timeSel.onchange = () => { st.timeLimit = timeSel.value; }; timeWrap.appendChild(timeSel);

        const goBtn = document.createElement('button'); goBtn.innerText = uF('START ENGINE'); goBtn.className = 'txt-blk'; goBtn.style.cssText = 'width:100%;padding:8px;background:transparent;border:2px solid #000;border-radius:4px;cursor:pointer;font-size:11px;transition:0.2s;';
        p1.appendChild(tgtInp); p1.appendChild(mWrap); p1.appendChild(mInpWrap); p1.appendChild(timeWrap); p1.appendChild(goBtn);
        st.preScn = setInterval(() => { if(!st.isRun) { let bal = chkBal(); document.getElementById('pre-bal').innerText = uF(bal > 0 ? bal.toFixed(2) : '--'); } }, 1000);

        const p2 = document.createElement('div'); p2.style.display = 'none';
        const balBx = document.createElement('div'); balBx.style.cssText = 'padding:6px;text-align:center;background:transparent;border-radius:6px;border:2px solid #000;margin-bottom:6px;';
        balBx.innerHTML = `<div class="txt-blk" style="font-size:9px;color:#ccc;">${uF('LIVE BAL / PROFIT')}</div><div id="ui-bal" class="txt-blk" style="font-size:16px;color:#fff;">--</div>`;
        
        let timerPlaceholder = PLATFORM_ID === 'deshclub' ? '--' : '00:30';
        let aiRow = `<div style="display:flex;justify-content:space-between;border-bottom:2px dashed #000;"><span class="txt-blk" style="color:#ccc;">${uF('AI:')}</span><span id="ui-ai" class="txt-blk-cyan">NORMAL MODE</span></div>`;
        const infBx = document.createElement('div'); infBx.style.cssText = 'padding:6px;font-size:10px;line-height:2;background:transparent;border-radius:6px;border:2px solid #000;';
        infBx.innerHTML = aiRow +
                            `<div style="display:flex;justify-content:space-between;border-bottom:2px dashed #000;"><span class="txt-blk" style="color:#ccc;">${uF('TGT:')}</span><span id="ui-tgt" class="txt-blk" style="color:#fff;">0</span></div>` +
                            `<div style="display:flex;justify-content:space-between;border-bottom:2px dashed #000;"><span class="txt-blk" style="color:#ccc;">${uF('STP:')}</span><span id="ui-bet" class="txt-blk-warn" style="color:#ffcc00;">5</span></div>` +
                            `<div style="display:flex;justify-content:space-between;border-bottom:2px dashed #000;"><span class="txt-blk" style="color:#ccc;">${uF('CLK:')}</span><span id="ui-clk" class="txt-blk" style="color:#fff;">${timerPlaceholder}</span></div>` +
                            `<div style="display:flex;justify-content:space-between;"><span class="txt-blk" style="color:#ccc;">${uF('STS:')}</span><span id="ui-sts" class="txt-blk" style="color:#fff;">${uF('WAIT')}</span></div>`;
        
        const stpBtn = document.createElement('button'); stpBtn.innerText = uF('STOP'); stpBtn.className = 'txt-blk-err'; stpBtn.style.cssText = 'width:100%;padding:8px;background:transparent;border:2px solid #000;border-radius:4px;cursor:pointer;font-size:11px;margin-top:6px;transition:0.2s;';
        p2.appendChild(balBx); p2.appendChild(infBx); p2.appendChild(stpBtn); b.appendChild(p1); b.appendChild(p2); inC.appendChild(b); p.appendChild(inC); document.body.appendChild(p);

        let mlBgDiv = document.createElement('div'); mlBgDiv.className = 'drx-ml-bg'; mlBgDiv.id = 'ml-bg-engine'; document.body.appendChild(mlBgDiv);

        const exeTrd = (pred, amt, cb) => {
            let pEl = document.querySelector(sel[pred]);
            if(!pEl) { if(cb) cb(false); return; }
            pEl.classList.add('drx-elec-target'); pEl.click(); 
            setTimeout(() => {
                if (PLATFORM_ID === 'deshclub') {
                    let exactMatch = [5,10, 20, 50, 100,200,400].includes(amt);
                    if (exactMatch && document.querySelector(sel[amt])) { let b = document.querySelector(sel[amt]); if(b) b.click(); } 
                    else { let inpEl = document.querySelector("input#van-field-1-input, .van-field__control");
                        if(inpEl) { inpEl.focus(); let setV = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                            if(setV) setV.call(inpEl, amt); else inpEl.value = amt; inpEl.dispatchEvent(new Event('input', { bubbles: true })); inpEl.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                } else {
                    let inpEl = document.querySelector(sel.A1);
                    if(inpEl) { inpEl.focus(); let setV = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        if(setV) setV.call(inpEl, amt); else inpEl.value = amt; inpEl.dispatchEvent(new Event('input', { bubbles: true })); inpEl.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                setTimeout(() => { let dEl = document.querySelector(sel.DTA); if(dEl) { dEl.click(); setTimeout(() => dEl.click(), 100); }
                    if(pEl) pEl.classList.remove('drx-elec-target'); setTimeout(() => { if(cb) cb(true); }, 3000);
                }, 500);
            }, 500);
        };

        const scnUI = (cb) => {
            let ov = document.createElement('div'); ov.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:transparent;z-index:9999998;pointer-events:none;overflow:hidden;';
            let cBase = '#a020f0'; if(SETTINGS.VISUAL_FX === 'RAINBOW') cBase = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
            let rL = document.createElement('div'); let scanSpeed = "0.15s";
            if(SETTINGS.SCAN_SYS === 'RADAR' || SETTINGS.SCAN_SYS === 'SONAR') { rL.style.cssText = `position:absolute;width:100%;height:4px;background:${cBase};box-shadow:0 0 20px 8px ${cBase};animation:sR ${scanSpeed} ease-in-out infinite alternate;`; } 
            else if (SETTINGS.SCAN_SYS === 'MATRIX' || SETTINGS.SCAN_SYS === 'CYBER') { rL.style.cssText = `position:absolute;width:100%;height:100%;background:repeating-linear-gradient(0deg, transparent, transparent 2px, ${cBase} 3px);opacity:0.2;animation:sM 0.1s infinite;`; } 
            else { rL.style.cssText = `position:absolute;width:100%;height:2px;background:${cBase};box-shadow:0 0 10px 3px ${cBase};animation:sR ${scanSpeed} linear infinite alternate;`; }
            let gL = document.createElement('div'); gL.style.cssText = `position:absolute;height:100%;width:3px;background:${cBase};box-shadow:0 0 15px 5px ${cBase};animation:sG ${scanSpeed} cubic-bezier(0.25,0.1,0.25,1) infinite alternate;`;
            let sS = document.createElement('style'); sS.innerHTML = `@keyframes sR { 0% { top: -10px; } 100% { top: 100vh; } } @keyframes sG { 0% { left: -10px; } 100% { left: 100vw; } } @keyframes sM { 0% { transform: translateY(0); } 100% { transform: translateY(10px); } }`;
            document.head.appendChild(sS); ov.appendChild(rL); if(SETTINGS.SCAN_SYS !== 'MATRIX' && SETTINGS.SCAN_SYS !== 'CYBER') ov.appendChild(gL); document.body.appendChild(ov);
            setTimeout(() => { ov.remove(); sS.remove(); if(cb) cb(); }, 1500);
        };

        const loopTask = () => {
            if (window._checkAdminStatus()) return; 

            const nw = new Date();
            if (PLATFORM_ID === 'deshclub') {
                let uClk = document.getElementById('ui-clk');
                if(uClk) uClk.textContent = uF(`${String(nw.getHours()).padStart(2,'0')}:${String(nw.getMinutes()).padStart(2,'0')}:${String(nw.getSeconds()).padStart(2,'0')}`);
            }

            if(!st.isRun || st.isTrd) return;

            chkBal();
            const uBal = document.getElementById('ui-bal'), uSts = document.getElementById('ui-sts'), uBet = document.getElementById('ui-bet');
            
            if (st.curBal >= st.tgtAmt && st.curBal > 0) uBal.innerText = uF(`${st.curBal.toFixed(2)} (Done)`);
            else uBal.innerText = uF(st.curBal > 0 ? st.curBal.toFixed(2) : '--');
            uBet.innerText = uF(st.dynSeq[st.stpIdx] || '--');

            if(st.curBal >= st.tgtAmt && st.curBal > 0) {
                uSts.innerText = uF('DONE'); uSts.className = 'txt-blk-accent'; stpBtn.style.display = 'none';
                st.isRun = false; clearInterval(st.autoInt); lkOvl.style.display = 'none'; document.body.style.overflow = '';
                let dWrap = document.createElement('div'); dWrap.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);padding:20px;border:2px solid #a020f0;border-radius:10px;z-index:99999999;text-align:center;box-shadow:0 0 30px #a020f0;';
                dWrap.innerHTML = `<h2 style="color:#a020f0;margin-bottom:10px;font-family:monospace;">TARGET REACHED</h2><p style="color:#fff;font-family:monospace;margin-bottom:15px;">Balance: ${st.curBal.toFixed(2)}</p><button id="closeDWrap" style="background:transparent;color:#a020f0;border:1px solid #a020f0;padding:5px 15px;cursor:pointer;">OK</button>`;
                document.body.appendChild(dWrap); document.getElementById('closeDWrap').onclick = () => dWrap.remove(); return;
            }

            let tm = ext(d.S);
            let sDigRaw = (tm.join(" ").match(/\b\d\b/g) || tm.join(" ").match(/\d/g));
            
            if (sDigRaw && sDigRaw.length > 0) {
                let sDig = sDigRaw.map(Number);
                let cSig = sDig.length >= 5 ? sDig.slice(0, 5).join("-") : sDig.join("-");
                let sSig = sessionStorage.getItem('drx_sig');
                
                if (cSig !== sSig) {
                    // Check Win/Loss if previously a trade was executed
                    if(st.lastPred && st.lastPred !== 'WAIT' && st.lastPeriod) {
                        let actualRes = parseInt(sDig[0]);
                        let isWin = (st.lastPred === 'BIG' && actualRes >= 5) || (st.lastPred === 'SMALL' && actualRes < 5);
                        DataVault.addRecord(st.lastPeriod, actualRes, st.lastPred, isWin);
                        
                        if (isWin) {
                            st.stpIdx = 0;
                            st.consecutiveLosses = 0; // Win resets to Normal Mode
                        } else {
                            st.stpIdx = Math.min(st.stpIdx + 1, st.dynSeq.length - 1);
                            st.consecutiveLosses++;
                        }
                    }

                    st.lastPeriod = cSig;
                    st.activeAI = st.consecutiveLosses >= 3 ? 'RECOVERY (+)' : 'NORMAL MODE';
                    let uiAi = document.getElementById('ui-ai');
                    if(uiAi) uiAi.innerText = uF(st.activeAI);

                    if (st.timeLimit !== 'NO' && parseInt(st.timeLimit) > 0) {
                        if (st.tradesDone >= st.maxTrades && st.curBal < st.tgtAmt) {
                            st.isRun = false; clearInterval(st.autoInt); uSts.innerText = uF('FAIL'); uSts.className = 'txt-blk-err'; lkOvl.style.display = 'none'; document.body.style.overflow = '';
                            let dWrapF = document.createElement('div'); dWrapF.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);padding:20px;border:2px solid #f00;border-radius:10px;z-index:99999999;text-align:center;box-shadow:0 0 30px #f00;';
                            dWrapF.innerHTML = `<h2 style="color:#f00;margin-bottom:10px;font-family:monospace;">TASK FAILED</h2><p style="color:#fff;font-family:monospace;margin-bottom:15px;">Please Try Again</p><button id="closeDWrapF" style="background:transparent;color:#f00;border:1px solid #f00;padding:5px 15px;cursor:pointer;">OK</button>`;
                            document.body.appendChild(dWrapF); document.getElementById('closeDWrapF').onclick = () => dWrapF.remove(); return;
                        }
                    }

                    st.lastHist = sDig;
                    let timeLeft = PLATFORM_ID === 'deshclub' ? (60 - nw.getSeconds()) : dTimeLeft;
                    if (timeLeft <= cfg.minSf) { sessionStorage.setItem('drx_sig', cSig); return; }

                    st.isTrd = true; uSts.innerText = uF('CHK...'); uSts.className = 'txt-blk-warn';

                    setTimeout(() => {
                        let nBal = chkBal(); uBal.innerText = uF(nBal.toFixed(2));
                        if(nBal >= st.tgtAmt && nBal > 0) { st.isTrd = false; return; }
                        
                        st.dynSeq = calcSeq(nBal, st.tgtAmt);
                        if(st.stpIdx >= st.dynSeq.length) st.stpIdx = st.dynSeq.length - 1;
                        let tAmt = st.dynSeq[st.stpIdx]; uBet.innerText = uF(tAmt);

                        if(nBal < tAmt) { uSts.innerText = uF('LOW'); uSts.className = 'txt-blk-err'; st.stpIdx = 0; st.isTrd = false; return; }

                        let prediction = UserPatternLogic(sDig, st.consecutiveLosses >= 3);
                        st.lastPred = prediction;

                        if (prediction === 'WAIT') {
                            uSts.innerText = uF('WAIT'); uSts.className = 'txt-blk-warn';
                            if (sDig.length >= 10) sessionStorage.setItem('drx_sig', cSig); 
                            st.isTrd = false; return;
                        }

                        uSts.innerText = uF('EXC...'); uSts.className = 'txt-blk';
                        if (st.mlActive) { tAmt = Math.ceil(tAmt * 1.5); uBet.innerText = uF(tAmt + ' (BOOST)'); }

                        exeTrd(prediction, tAmt, (suc) => {
                            if(suc) {
                                uSts.innerText = uF('OK'); uSts.className = 'txt-blk-accent';
                                sessionStorage.setItem('drx_sig', cSig); sessionStorage.setItem('drx_p_bal', st.curBal);
                                st.tradesDone++; 
                            } else { uSts.innerText = uF('ERR'); uSts.className = 'txt-blk-err'; }
                            setTimeout(() => { st.isTrd = false; }, 1000); 
                        });
                    }, cfg.syncDly);
                } else if(!st.isTrd) { uSts.innerText = uF('SCAN'); uSts.className = 'txt-blk'; }
            }
        };

        goBtn.onclick = () => {
            if (window._checkAdminStatus()) return;
            let a = parseFloat(tgtInp.value); if(!a || a <= 0) return;
            st.extVal = parseFloat(mInp.value) || 0; clearInterval(st.preScn); st.tradesDone = 0; st.consecutiveLosses = 0;
            if (st.timeLimit !== 'NO' && parseInt(st.timeLimit) > 0) st.maxTrades = parseInt(st.timeLimit) * 2; 

            scnUI(() => {
                sessionStorage.removeItem('drx_sig'); sessionStorage.removeItem('drx_p_bal');
                chkBal(); st.tgtAmt = a; st.dynSeq = calcSeq(st.curBal, st.tgtAmt); st.stpIdx = 0; 
                document.getElementById('ui-tgt').innerText = uF(a);
                let tm = ext(d.S); let sDigRaw = (tm.join(" ").match(/\b\d\b/g) || tm.join(" ").match(/\d/g));
                if (sDigRaw && sDigRaw.length >= 5) {
                    let sDig = sDigRaw.map(Number);
                    sessionStorage.setItem('drx_sig', sDig.slice(0, 5).join("-"));
                }
                p1.style.display = 'none'; p2.style.display = 'block'; lkOvl.style.display = 'block'; document.body.style.overflow = 'hidden';
                st.isRun = true; st.isTrd = false; sessionStorage.setItem('drx_p_bal', st.curBal);
                document.getElementById('ui-sts').innerText = uF('RDY'); st.autoInt = setInterval(loopTask, cfg.fRt); 
            });
        };

        stpBtn.onclick = () => {
            st.isRun = false; clearInterval(st.autoInt); sessionStorage.removeItem('drx_sig'); sessionStorage.removeItem('drx_p_bal');
            document.getElementById('ui-sts').innerText = uF('HLT'); document.getElementById('ui-sts').className = 'txt-blk-err';
            lkOvl.style.display = 'none'; document.body.style.overflow = '';
            stpBtn.innerText = uF('RBT');
            stpBtn.onclick = () => {
                p2.style.display = 'none'; p1.style.display = 'block'; stpBtn.innerText = uF('STOP'); st.consecutiveLosses = 0;
                st.preScn = setInterval(() => { let b = chkBal(); document.getElementById('pre-bal').innerText = uF(b > 0 ? b.toFixed(2) : '--'); }, 1000);
            };
        };
    }); 
})();
