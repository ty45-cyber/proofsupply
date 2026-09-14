// Injected by Vercel env or local .env loader
const CONTRACT_ADDRESS = (typeof window !== 'undefined' && window.__ENV__?.CONTRACT_ADDRESS) || '';
if (CONTRACT_ADDRESS) console.info('[ProofSupply] contract:', CONTRACT_ADDRESS);

const jurisdictionNames={ke:'Kenya',tz:'Tanzania',ug:'Uganda',za:'South Africa'};
const id=()=>`PS-${crypto.getRandomValues(new Uint32Array(2))[0].toString(16).slice(0,6).toUpperCase()}`;

class MidnightAdapter {
  constructor(){this.mode='local-demo';}
  async verify(policy, privateProfile){
    // Production boundary: replace this local evaluator with the generated
    // Midnight.js contract client after compiling proofsupply.compact.
    const eligible = privateProfile.annualRevenue >= policy.minimumRevenue
      && (!policy.certificationRequired || privateProfile.certificationValid)
      && privateProfile.jurisdiction === policy.allowedJurisdiction;
    return {eligible, mode:this.mode, verificationId:id()};
  }
}

const adapter=new MidnightAdapter();
const $=s=>document.querySelector(s);

function readPolicy(){return {
  minimumRevenue:Number($('#minimumRevenue').value||0),
  allowedJurisdiction:$('#jurisdiction').value,
  certificationRequired:$('#certRequired').checked
};}
function readPrivateProfile(){return {
  annualRevenue:Number($('#supplierRevenue').value||0),
  jurisdiction:$('#supplierJurisdiction').value,
  certificationValid:$('#certValid').checked
};}
function setBusy(b){const btn=$('#generateProof');btn.disabled=b;btn.textContent=b?'Generating proof…':'Generate proof ↗';}

async function generate(){
  setBusy(true);
  $('#decisionTitle').textContent='Proving privately…';
  $('#decisionBody').textContent='The demo evaluator is applying the policy without disclosing supplier values.';
  await new Promise(r=>setTimeout(r,850));
  const result=await adapter.verify(readPolicy(),readPrivateProfile());
  $('#decisionIcon').textContent=result.eligible?'✓':'×';
  $('#decisionTitle').textContent=result.eligible?'Supplier qualified':'Supplier does not qualify';
  $('#decisionBody').textContent=result.eligible
    ? `Verified against a ${readPolicy().minimumRevenue.toLocaleString()} ${'USD'} revenue threshold, certification policy and ${jurisdictionNames[readPolicy().allowedJurisdiction]} eligibility.`
    : 'The private supplier evidence did not satisfy every buyer requirement. No underlying value is displayed to the buyer.';
  $('#verificationId').textContent=result.verificationId;
  $('#resultPanel').scrollIntoView({behavior:'smooth',block:'center'});
  setBusy(false);
}

$('#generateProof').addEventListener('click',generate);
$('#runDemo').addEventListener('click',()=>generate());
$('#showArchitecture').addEventListener('click',()=>{
  $('#architecture').classList.toggle('hidden');
  $('#architecture').scrollIntoView({behavior:'smooth',block:'start'});
});

$('#supplierJurisdiction').addEventListener('change',()=>{
  const match=$('#supplierJurisdiction').value===$('#jurisdiction').value;
  $('#supplierJurisdiction').style.borderColor=match?'#4f5e25':'#662f2f';
});
