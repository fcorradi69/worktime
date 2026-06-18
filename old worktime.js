function toggleSettings() {
        const p = document.getElementById('settings');
        p.style.display = p.style.display === 'block' ? 'none' : 'block';
    }

    function toggleTheme() {
        const b = document.body;
        const isLight = b.getAttribute('data-theme') === 'light';
        b.setAttribute('data-theme', isLight ? 'dark' : 'light');
        document.getElementById('themeBtn').innerText = isLight ? '☀️' : '🌙';
    }

    function calcola() {
        const toMin = (t) => {
            if (!t) return 0;
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const eM = toMin(document.getElementById('eM').value);
        const uM = toMin(document.getElementById('uM').value);
        const eP = toMin(document.getElementById('eP').value);
        const targetMin = toMin(document.getElementById('targetTime').value);
        const pausaMinTarget = toMin(document.getElementById('pausaMinTime').value);
        
        const warn = document.getElementById('warn');
        const res = document.getElementById('res');

        if ((eP - uM) < pausaMinTarget) {
            warn.innerText = `⚠️ Pausa minima non rispettata`;
            warn.style.display = 'block';
        } else {
            warn.style.display = 'none';
        }

        const lavoratoMattina = uM - eM;
        const daLavorare = targetMin - lavoratoMattina;
        
        if (daLavorare <= 0) {
            res.innerText = "OK!";
            return;
        }

        const uscitaMin = eP + daLavorare;
        const hU = Math.floor(uscitaMin / 60) % 24;
        const mU = Math.round(uscitaMin % 60);
        
        res.innerText = `${hU.toString().padStart(2, '0')}:${mU.toString().padStart(2, '0')}`;
    }
    calcola();
