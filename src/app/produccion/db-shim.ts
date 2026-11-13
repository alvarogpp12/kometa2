// Browser-side code injected into the shooting plan page.
//
// 1. A replacement for the Claude artifact database (window.claude.use('db'))
//    backed by /produccion/api. Edits are queued locally, shown at once,
//    saved with the Guardar button or automatically after a short pause,
//    and never overwritten by the background refresh while pending.
// 2. Sticky notes: a post-it button that pins a note wherever you tap,
//    which you can then move, pin in place or delete.
//
// Written without template literals so it can live inside this string.
export const DB_SHIM = `
(function () {
	var API = '/produccion/api';
	var AUTOSAVE_MS = 2000;
	var server = null;
	var view = null;
	var last = '';
	var pending = [];
	var listeners = [];
	var started = false;
	var saving = false;
	var failed = false;
	var autosaveTimer = null;
	var retryTimer = null;

	function clone(o) { return JSON.parse(JSON.stringify(o)); }
	function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
	function merge(t, p) {
		var o = {}, k;
		for (k in t) o[k] = t[k];
		for (k in p) o[k] = isObj(p[k]) && isObj(o[k]) ? merge(o[k], p[k]) : p[k];
		return o;
	}
	function applyOp(st, op) {
		var p = op.path.split('/');
		st[p[0]] = st[p[0]] || {};
		if (op.op === 'delete') delete st[p[0]][p[1]];
		else if (op.op === 'set') st[p[0]][p[1]] = op.data;
		else st[p[0]][p[1]] = merge(st[p[0]][p[1]] || {}, op.data);
	}

	function recompute() {
		if (!server) return;
		var st = clone(server);
		pending.forEach(function (op) { applyOp(st, op); });
		var text = JSON.stringify(st);
		if (text !== last) {
			last = text;
			view = st;
			listeners.forEach(function (l) { try { l.fire(); } catch (e) { console.error(e); } });
		}
		showStatus();
	}

	function load() {
		if (saving) return Promise.resolve();
		return fetch(API, { cache: 'no-store' }).then(function (r) {
			if (!r.ok) throw new Error('load ' + r.status);
			return r.json();
		}).then(function (json) {
			server = json;
			recompute();
		});
	}

	function scheduleAutosave() {
		clearTimeout(autosaveTimer);
		autosaveTimer = setTimeout(flush, AUTOSAVE_MS);
	}

	function flush() {
		clearTimeout(autosaveTimer);
		clearTimeout(retryTimer);
		if (saving || pending.length === 0) return Promise.resolve();
		saving = true;
		showStatus();
		var batch = pending.slice();
		return fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ops: batch })
		}).then(function (r) {
			if (!r.ok) throw new Error('save ' + r.status);
			return r.json();
		}).then(function (json) {
			server = json;
			pending = pending.slice(batch.length);
			failed = false;
		}).catch(function (e) {
			console.error(e);
			failed = true;
			retryTimer = setTimeout(flush, 10000);
		}).then(function () {
			saving = false;
			recompute();
			if (pending.length && !failed) scheduleAutosave();
		});
	}

	function queue(op) {
		pending.push(op);
		recompute();
		scheduleAutosave();
		return Promise.resolve();
	}

	function listen(fire, onErr) {
		listeners.push({ fire: fire, onErr: onErr });
		if (view) fire();
		if (!started) {
			started = true;
			load().catch(function (e) {
				console.error(e);
				listeners.forEach(function (l) { if (l.onErr) l.onErr(e); });
			});
			setInterval(function () {
				if (!document.hidden) load().catch(function (e) { console.error(e); });
			}, 5000);
		}
	}

	function colSnap(name) {
		var col = (view && view[name]) || {};
		return {
			docs: Object.keys(col).map(function (id) {
				return { id: id, data: function () { return col[id]; } };
			}),
			metadata: { fromCache: false }
		};
	}
	function docSnap(path) {
		var p = path.split('/');
		var d = view && view[p[0]] ? view[p[0]][p[1]] : undefined;
		return { exists: !!d, data: function () { return d; }, metadata: { fromCache: false } };
	}

	var db = {
		collection: function (name) {
			return { onSnapshot: function (cb, onErr) { listen(function () { cb(colSnap(name)); }, onErr); } };
		},
		doc: function (path) {
			return {
				onSnapshot: function (cb, onErr) { listen(function () { cb(docSnap(path)); }, onErr); },
				set: function (data) { return queue({ op: 'set', path: path, data: data }); },
				update: function (data) { return queue({ op: 'update', path: path, data: data }); },
				delete: function () { return queue({ op: 'delete', path: path }); }
			};
		}
	};
	window.claude = { use: function (cap) { return Promise.resolve(cap === 'db' ? db : null); } };

	/* ---------- styles ---------- */
	var css = [
		'.kz-save{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:65;font-family:var(--cond,"Arial Narrow",sans-serif);font-weight:700;font-size:15px;letter-spacing:.05em;padding:10px 16px;border:2px solid var(--ink,#16130F);background:var(--paper,#fff);color:var(--ink,#16130F);cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18)}',
		'.kz-save.dirty{background:var(--ink,#16130F);color:var(--bg,#EFE9DD)}',
		'.kz-save.error{background:var(--no,#B71C1C);border-color:var(--no,#B71C1C);color:#fff}',
		'.kz-save.ok{color:var(--muted,#6B6457)}',
		'.kz-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:65;width:58px;height:58px;border:2px solid var(--ink,#16130F);background:#FFE16B;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.22);padding:0}',
		'.kz-fab svg{width:30px;height:30px}',
		'.kz-fab.on{outline:3px solid var(--sev,#D9480F);outline-offset:2px}',
		'body.kz-placing,body.kz-placing *{cursor:crosshair!important}',
		'.kz-hint{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:66;background:var(--ink,#16130F);color:var(--bg,#EFE9DD);font-family:var(--cond,"Arial Narrow",sans-serif);font-weight:600;font-size:15px;padding:8px 14px}',
		'.kz-layer{position:absolute;left:0;top:0;width:0;height:0;z-index:60}',
		'.kz-note{position:absolute;width:190px;background:#FFE16B;color:#2B2410;box-shadow:0 8px 20px rgba(0,0,0,.25);transform:rotate(-1.5deg);display:flex;flex-direction:column}',
		'.kz-note.pinned{transform:none}',
		'.kz-note.dragging{transform:rotate(-3deg) scale(1.03);box-shadow:0 14px 30px rgba(0,0,0,.3);opacity:.95}',
		'.kz-bar{display:flex;align-items:center;gap:2px;padding:3px 4px;background:rgba(0,0,0,.07)}',
		'.kz-bar button{border:0;background:transparent;font-family:var(--cond,"Arial Narrow",sans-serif);font-weight:700;font-size:12px;letter-spacing:.04em;color:#2B2410;padding:5px 6px;cursor:pointer;line-height:1}',
		'.kz-bar button:hover{background:rgba(0,0,0,.08)}',
		'.kz-move{cursor:grab!important;touch-action:none;margin-right:auto}',
		'.kz-note.pinned .kz-move{cursor:default!important;opacity:.45}',
		'.kz-note textarea{border:0;background:transparent;resize:vertical;min-height:84px;padding:8px 10px;font:500 15px/1.3 var(--body,system-ui,sans-serif);color:#2B2410;outline:none}',
		'.kz-note textarea::placeholder{color:rgba(43,36,16,.5)}',
		'.kz-confirm{padding:10px;font-family:var(--cond,"Arial Narrow",sans-serif);font-weight:600;font-size:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
		'.kz-confirm button{border:1.5px solid #2B2410;background:transparent;font:inherit;padding:4px 10px;cursor:pointer}',
		'.kz-confirm button.yes{background:#B71C1C;border-color:#B71C1C;color:#fff}',
		'.kz-note :focus-visible,.kz-save:focus-visible,.kz-fab:focus-visible{outline:3px solid var(--sev,#D9480F);outline-offset:2px}'
	].join('\\n');
	var style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);

	/* ---------- save button ---------- */
	var saveBtn = document.createElement('button');
	saveBtn.type = 'button';
	saveBtn.className = 'kz-save ok';
	saveBtn.textContent = 'Cargando…';
	saveBtn.addEventListener('click', function () {
		if (pending.length) flush();
		else load().catch(function () {});
	});

	function showStatus() {
		var n = pending.length;
		var label, cls, sync, syncCls;
		if (saving) { label = 'GUARDANDO…'; cls = 'dirty'; sync = 'Guardando cambios…'; syncCls = ''; }
		else if (failed) { label = 'NO SE HA GUARDADO · REINTENTAR'; cls = 'error'; sync = 'No se han podido guardar los cambios'; syncCls = 'off'; }
		else if (n) { label = 'GUARDAR · ' + n + (n === 1 ? ' CAMBIO' : ' CAMBIOS'); cls = 'dirty'; sync = 'Cambios sin guardar'; syncCls = ''; }
		else { label = '✓ TODO GUARDADO'; cls = 'ok'; sync = 'Guardado y compartido con el equipo'; syncCls = 'on'; }
		saveBtn.textContent = label;
		saveBtn.className = 'kz-save ' + cls;
		var s = document.getElementById('sync');
		if (s && server) {
			s.className = 'sync ' + syncCls;
			var span = s.querySelector('span');
			if (span) span.textContent = sync;
		}
	}

	window.addEventListener('beforeunload', function (e) {
		if (pending.length || saving) { e.preventDefault(); e.returnValue = ''; }
	});

	/* ---------- sticky notes ---------- */
	var notes = {};
	var layer = document.createElement('div');
	layer.className = 'kz-layer';
	var placing = false;
	var swallowClick = false;
	var focusNew = null;
	var hint = null;

	var fab = document.createElement('button');
	fab.type = 'button';
	fab.className = 'kz-fab';
	fab.title = 'Pegar una nota';
	fab.setAttribute('aria-label', 'Pegar una nota');
	fab.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 5h22v15l-7 7H5z" fill="#FFF3B0" stroke="#2B2410" stroke-width="2" stroke-linejoin="round"/><path d="M27 20h-7v7" fill="#F2C94C" stroke="#2B2410" stroke-width="2" stroke-linejoin="round"/><path d="M10 11h12M10 15h8" stroke="#2B2410" stroke-width="2" stroke-linecap="round"/></svg>';

	function setPlacing(on) {
		placing = on;
		fab.classList.toggle('on', on);
		document.body.classList.toggle('kz-placing', on);
		if (on && !hint) {
			hint = document.createElement('div');
			hint.className = 'kz-hint';
			hint.textContent = 'Toca donde quieras pegar la nota · Esc para cancelar';
			document.body.appendChild(hint);
		}
		if (!on && hint) { hint.remove(); hint = null; }
	}
	fab.addEventListener('click', function (e) { e.stopPropagation(); setPlacing(!placing); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && placing) setPlacing(false); });

	function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

	// Anchor a note to what is under the point (a card, a day, a heading),
	// so it follows the plan across screen sizes and when cards move.
	function anchorAt(x, y) {
		var el = document.elementFromPoint(x, y);
		var a = null, target = null;
		if (el) {
			target = el.closest('[data-card]');
			if (target) a = { t: 'card', k: target.getAttribute('data-card') };
			if (!a) { target = el.closest('.zone[data-day]'); if (target && target.getAttribute('data-day')) a = { t: 'day', k: target.getAttribute('data-day') }; }
			if (!a) { target = el.closest('[data-dayhead]'); if (target) a = { t: 'head', k: target.getAttribute('data-dayhead') }; }
			if (!a) { target = el.closest('section[id],div[id]'); if (target && target.id && target.id.indexOf('kz') !== 0) a = { t: 'id', k: target.id }; }
		}
		var res = { ax: x + window.scrollX, ay: y + window.scrollY };
		if (a && target) {
			var r = target.getBoundingClientRect();
			a.rx = r.width ? (x - r.left) / r.width : 0;
			a.ry = r.height ? (y - r.top) / r.height : 0;
			res.a = a;
		}
		return res;
	}
	function findAnchor(a) {
		if (!a) return null;
		var q = null;
		if (a.t === 'card') q = '[data-card="' + a.k + '"]';
		else if (a.t === 'day') q = '.zone[data-day="' + a.k + '"]';
		else if (a.t === 'head') q = '[data-dayhead="' + a.k + '"]';
		else if (a.t === 'id') return document.getElementById(a.k);
		return q ? document.querySelector(q) : null;
	}
	function positionOf(n) {
		var el = findAnchor(n.a);
		if (el && el.offsetParent !== null) {
			var r = el.getBoundingClientRect();
			return { x: r.left + window.scrollX + n.a.rx * r.width, y: r.top + window.scrollY + n.a.ry * r.height };
		}
		return { x: n.ax || 40, y: n.ay || 40 };
	}

	function save(id, patch) { db.doc('postits/' + id).update(patch); }

	function buildNote(id) {
		var el = document.createElement('div');
		el.className = 'kz-note';
		el.setAttribute('data-note', id);
		el.innerHTML = '<div class="kz-bar"><button type="button" class="kz-move" title="Arrastra para mover">✥ MOVER</button><button type="button" class="kz-pin"></button><button type="button" class="kz-del" title="Borrar nota">BORRAR</button></div><textarea placeholder="Escribe la nota…" aria-label="Texto de la nota"></textarea>';
		var ta = el.querySelector('textarea');
		var t = null;
		ta.addEventListener('input', function () {
			clearTimeout(t);
			t = setTimeout(function () { save(id, { text: ta.value }); }, 600);
		});
		ta.addEventListener('blur', function () {
			clearTimeout(t);
			if (notes[id] && (notes[id].text || '') !== ta.value) save(id, { text: ta.value });
		});
		el.querySelector('.kz-pin').addEventListener('click', function () {
			save(id, { pinned: !(notes[id] && notes[id].pinned) });
		});
		el.querySelector('.kz-del').addEventListener('click', function () { askDelete(el, id); });
		el.querySelector('.kz-move').addEventListener('pointerdown', function (e) { startDrag(e, el, id); });
		return el;
	}

	function askDelete(el, id) {
		if (el.querySelector('.kz-confirm')) return;
		var box = document.createElement('div');
		box.className = 'kz-confirm';
		box.innerHTML = '¿Borrar esta nota? <button type="button" class="yes">Sí, borrar</button><button type="button" class="no">No</button>';
		box.querySelector('.yes').addEventListener('click', function () { db.doc('postits/' + id).delete(); });
		box.querySelector('.no').addEventListener('click', function () { box.remove(); });
		el.appendChild(box);
	}

	var drag = null;
	function startDrag(e, el, id) {
		if (notes[id] && notes[id].pinned) return;
		e.preventDefault();
		var r = el.getBoundingClientRect();
		drag = { el: el, id: id, dx: e.clientX - r.left, dy: e.clientY - r.top, pid: e.pointerId };
		el.classList.add('dragging');
		try { el.setPointerCapture(e.pointerId); } catch (_) {}
	}
	document.addEventListener('pointermove', function (e) {
		if (!drag) return;
		drag.el.style.left = (e.clientX - drag.dx + window.scrollX) + 'px';
		drag.el.style.top = (e.clientY - drag.dy + window.scrollY) + 'px';
	}, true);
	document.addEventListener('pointerup', function (e) {
		if (!drag) return;
		var d = drag; drag = null;
		d.el.classList.remove('dragging');
		var x = e.clientX - d.dx, y = e.clientY - d.dy;
		d.el.style.visibility = 'hidden';
		var pos = anchorAt(x, y);
		d.el.style.visibility = '';
		save(d.id, { a: pos.a || null, ax: pos.ax, ay: pos.ay });
	}, true);

	function renderNotes() {
		if (!document.body.contains(layer)) document.body.appendChild(layer);
		var seen = {};
		Object.keys(notes).forEach(function (id) {
			var n = notes[id];
			seen[id] = true;
			var el = layer.querySelector('[data-note="' + id + '"]');
			if (!el) { el = buildNote(id); layer.appendChild(el); }
			el.classList.toggle('pinned', !!n.pinned);
			var pin = el.querySelector('.kz-pin');
			pin.textContent = n.pinned ? '📌 SOLTAR' : '📌 FIJAR';
			pin.title = n.pinned ? 'Permitir mover la nota' : 'Fijar la nota en su sitio';
			var ta = el.querySelector('textarea');
			if (document.activeElement !== ta && ta.value !== (n.text || '')) ta.value = n.text || '';
			if (!(drag && drag.id === id)) {
				var p = positionOf(n);
				el.style.left = p.x + 'px';
				el.style.top = p.y + 'px';
			}
			if (focusNew === id) { focusNew = null; setTimeout(function () { ta.focus(); }, 30); }
		});
		Array.prototype.slice.call(layer.children).forEach(function (el) {
			if (!seen[el.getAttribute('data-note')]) el.remove();
		});
	}

	var raf = null;
	function soonNotes() {
		if (raf) return;
		raf = requestAnimationFrame(function () { raf = null; renderNotes(); });
	}

	function stopPage(e) {
		if (e.target.closest && (e.target.closest('.kz-fab') || e.target.closest('.kz-note'))) return false;
		e.preventDefault();
		e.stopPropagation();
		if (e.stopImmediatePropagation) e.stopImmediatePropagation();
		return true;
	}
	document.addEventListener('pointerdown', function (e) { if (placing) stopPage(e); }, true);
	document.addEventListener('pointerup', function (e) {
		if (!placing || !stopPage(e)) return;
		swallowClick = true;
		setPlacing(false);
		var pos = anchorAt(e.clientX, e.clientY);
		var id = newId();
		focusNew = id;
		db.doc('postits/' + id).set({ text: '', pinned: false, a: pos.a || null, ax: pos.ax, ay: pos.ay, created: Date.now() });
	}, true);
	document.addEventListener('click', function (e) {
		if (swallowClick) { swallowClick = false; stopPage(e); }
	}, true);

	function boot() {
		document.body.appendChild(saveBtn);
		document.body.appendChild(fab);
		document.body.appendChild(layer);
		db.collection('postits').onSnapshot(function (s) {
			notes = {};
			s.docs.forEach(function (d) { notes[d.id] = d.data(); });
			soonNotes();
		});
		var root = document.querySelector('.wrap') || document.body;
		new MutationObserver(soonNotes).observe(root, { childList: true, subtree: true });
		window.addEventListener('resize', soonNotes);
		window.addEventListener('load', soonNotes);
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
	else boot();
})();
`
