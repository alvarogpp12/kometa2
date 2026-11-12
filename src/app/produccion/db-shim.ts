// Browser-side replacement for the Claude artifact database. Implements
// the subset the plan uses: collection(name).onSnapshot,
// doc('col/id').onSnapshot, set, update (deep merge) and delete.
// Changes from other people show up through polling.
export const DB_SHIM = `
(function () {
	var API = '/produccion/api';
	var state = null;
	var last = '';
	var listeners = [];
	var started = false;

	function colSnap(name) {
		var docs = Object.keys((state && state[name]) || {}).map(function (id) {
			var d = state[name][id];
			return { id: id, data: function () { return d; } };
		});
		return { docs: docs, metadata: { fromCache: false } };
	}
	function docSnap(path) {
		var p = path.split('/');
		var d = state && state[p[0]] ? state[p[0]][p[1]] : undefined;
		return { exists: !!d, data: function () { return d; }, metadata: { fromCache: false } };
	}
	function apply(next) {
		var text = JSON.stringify(next);
		if (text === last) return;
		last = text;
		state = next;
		listeners.forEach(function (l) { try { l.fire(); } catch (e) { console.error(e); } });
	}
	function fail(e) {
		console.error(e);
		listeners.forEach(function (l) { if (l.onErr) l.onErr(e); });
	}
	function load() {
		return fetch(API, { cache: 'no-store' }).then(function (r) {
			if (!r.ok) throw new Error('load ' + r.status);
			return r.json();
		}).then(apply);
	}
	function send(op) {
		return fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ops: [op] })
		}).then(function (r) {
			if (!r.ok) throw new Error('save ' + r.status);
			return r.json();
		}).then(apply);
	}
	function start() {
		if (started) return;
		started = true;
		load().catch(fail);
		setInterval(function () { if (!document.hidden) load().catch(fail); }, 5000);
	}
	function listen(fire, onErr) {
		var l = { fire: fire, onErr: onErr };
		listeners.push(l);
		if (state) fire();
		start();
	}

	var db = {
		collection: function (name) {
			return { onSnapshot: function (cb, onErr) { listen(function () { cb(colSnap(name)); }, onErr); } };
		},
		doc: function (path) {
			return {
				onSnapshot: function (cb, onErr) { listen(function () { cb(docSnap(path)); }, onErr); },
				set: function (data) { return send({ op: 'set', path: path, data: data }); },
				update: function (data) { return send({ op: 'update', path: path, data: data }); },
				delete: function () { return send({ op: 'delete', path: path }); }
			};
		}
	};

	window.claude = { use: function (cap) { return Promise.resolve(cap === 'db' ? db : null); } };
})();
`
