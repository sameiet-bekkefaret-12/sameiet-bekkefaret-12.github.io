const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/assets/halloween.js', 'utf8');
function setup(instant, reduce = false, hostname = 'example.com', search = '') {
  let now = new Date(instant), pending;
  const nodes = [], listeners = {};
  const media = { matches: reduce, addEventListener: (_, fn) => { media.change = fn; } };
  function element(tag) {
    const item = {tag, hidden:false, attributes:{}, classList:{toggle(){}},
      setAttribute(k,v){this.attributes[k]=v;}, append(){},
      addEventListener(_,fn){this.click=fn;}, remove(){this.removed=true;}};
    nodes.push(item); return item;
  }
  const document = {hidden:false, createElement:element, body:{append(){}},
    querySelector:()=>({append(){}}), addEventListener:(key,fn)=>listeners[key]=fn};
  class Clock extends Date { constructor(){super(now);} }
  vm.runInNewContext(source, {Intl, Date:Clock, URLSearchParams, matchMedia:()=>media,
    location:{hostname,search}, document, window:{addEventListener(){}},
    sessionStorage:{getItem(){return null;},setItem(){}}, clearTimeout(){},
    setTimeout(fn,delay){pending={fn,delay};}});
  return {nodes, media, document, listeners, get pending(){return pending;}, setTime(value){now=new Date(value);pending.fn();}};
}
test('Oslo date boundaries and annual recurrence, independent of visitor timezone', () => {
  for (const year of [2026,2027,2028,2032]) {
    // In 2027/2032 the clocks go back on Oct 31, so midnight is still UTC+2.
    const startHour = [2027,2032].includes(year) ? '22' : '23';
    const start = Date.parse(`${year}-10-29T${startHour}:00:00Z`);
    assert.equal(setup(start-1).nodes.length,0);
    assert.equal(setup(start).nodes.length,3);
    assert.equal(setup(`${year}-10-31T22:59:59Z`).nodes.length,3);
    assert.equal(setup(`${year}-10-31T23:00:00Z`).nodes.length,3);
    assert.equal(setup(`${year}-11-01T22:59:59.999Z`).nodes.length,3);
    assert.equal(setup(`${year}-11-01T23:00:00Z`).nodes.length,0);
  }
});
test('Open tab activates and removes decorations at midnight',()=>{
  const env=setup('2026-10-29T22:59:59.750Z');
  assert.equal(env.pending.delay,250);
  env.setTime('2026-10-29T23:00:00Z');
  assert.equal(env.nodes.length,3);
  env.setTime('2026-10-31T23:00:00Z');
  assert.equal(env.nodes[0].removed,undefined);
  assert.equal(env.nodes.length,3);
  env.setTime('2026-11-01T22:59:59.750Z');
  assert.equal(env.pending.delay,250);
  env.setTime('2026-11-01T23:00:00Z');
  assert.equal(env.nodes[0].removed,true);
  assert.equal(env.nodes[1].removed,true);
});
test('Reduced motion and manual pause work and react to preference changes',()=>{
  const env=setup('2026-10-31T12:00:00Z',true);
  assert.equal(env.nodes[0].hidden,true);
  assert.equal(env.nodes[2].hidden,true);
  env.media.matches=false; env.media.change();
  assert.equal(env.nodes[0].hidden,false);
  env.nodes[2].click(); assert.equal(env.nodes[0].hidden,true);
  env.nodes[2].click(); assert.equal(env.nodes[0].hidden,false);
  assert.equal(env.nodes[0].attributes['aria-hidden'],'true');
});
test('Preview override is limited to local development',()=>{
  assert.equal(setup('2026-11-02T12:00:00Z',false,'example.com','?halloween=preview').nodes.length,0);
  assert.equal(setup('2026-11-02T12:00:00Z',false,'127.0.0.1','?halloween=preview').nodes.length,3);
});
