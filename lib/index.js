import e from "greenlet";

Promise.pending = Promise.race.bind(Promise, []);
const i = e(function e([i, n, t, s = 3, o]) {
    if (i) e.data = {keys: t, fuzzy: s, originalList: o}; else {
        const {data: i} = e;
        t = i.keys, s = i.fuzzy, o = i.originalList
    }
    return new Promise(e => {
        let i = s > 1 ? e => (e + "").toLowerCase().split("_").join("").split("-").join("").split(" ").join("") : e => e,
            r = s > 2 ? (e, n) => new RegExp(".*" + i(e).split("").join(".*") + ".*").test(i(n)) : s > 0 ? (e, n) => -1 !== i(n).search(i(e)) : (e, i) => e === i;
        e([o.filter(e => t ? t.some(i => e[i] && r(n, e[i])) : r(n, e)), n])
    })
}), n = (e, n = {}) => {
    let t, s = [...e], o = !0, r = !1, l = {}, {keys: m, fuzzy: a} = n;
    return e => new Promise(n => {
        r && (t && t(), r = !1), 0 === e.length ? n(s) : l[e] ? n(l[e]) : (e => (r = !0, new Promise(n => {
            t = () => n(Promise.pending()), i(o ? [!0, e, m, a, s] : [!1, e]).then(n), o = !1
        })))(e).then(([i, t]) => {
            l[t] = i, e === t && 0 !== e.length ? n(i) : 0 === e.length && n(s)
        })
    })
};
export {n as SearchWorker};
//# sourceMappingURL=index.js.map