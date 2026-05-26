import{getAuth as ae,onAuthStateChanged as xe,signInWithEmailAndPassword as we,signOut as $e,createUserWithEmailAndPassword as Ee}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{initializeApp as ie}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getFirestore as Ie,collection as z,getDocs as V,query as H,where as Se,orderBy as ne,limit as ee,updateDoc as Ae,doc as A,serverTimestamp as x,getDoc as Ne,addDoc as Ce,deleteDoc as ke,setDoc as Pe,runTransaction as Ue}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();const j={recruitModule:{key:"recruitModule",label:"Recruit",description:"Jobs, pipelines, candidates, interviews, and RMS operations."},careerPortal:{key:"careerPortal",label:"Career Portal",description:"Public job pages and applicant intake."},shareProfile:{key:"shareProfile",label:"Share Profile",description:"Secure candidate profile sharing with clients."},dialer:{key:"dialer",label:"Dialer",description:"Calling workflow and call disposition tracking."},qrBridgeLogin:{key:"qrBridgeLogin",label:"QR Bridge Login",description:"QR-based bridge login for connected RMS sessions."},advancedAnalytics:{key:"advancedAnalytics",label:"Advanced Analytics",description:"Executive metrics, funnel analytics, and exportable insights."}},w={starter:{id:"starter",name:"Starter",priceMonthly:1499,maxUsers:1,features:Object.keys(j),customDomain:!1},professional:{id:"professional",name:"Professional",priceMonthly:2999,maxUsers:3,features:Object.keys(j),customDomain:!1},enterprise:{id:"enterprise",name:"Enterprise",priceMonthly:8999,maxUsers:8,features:Object.keys(j),customDomain:!0},custom:{id:"custom",name:"Custom",priceMonthly:null,maxUsers:null,features:Object.keys(j),configurable:!0,customDomain:!0}},G={trialing:"trialing",active:"active",grace:"grace"};function Re(e="starter"){return w[e]||w.starter}function N(e={},t={}){const s=Re(e.plan||t.plan),a=e.customLimits||t.customLimits||{},i=e.customFeatures||t.features;return{plan:s.id,maxUsers:Number(a.maxUsers||e.maxUsers||t.maxUsers||s.maxUsers||1),features:Array.isArray(i)&&i.length?i:s.features,priceMonthly:a.priceMonthly??e.priceMonthly??s.priceMonthly}}const p={fullAccess:"full_access",manageUsers:"manage_users",manageRoles:"manage_roles",manageBilling:"manage_billing",manageJobs:"manage_jobs",manageCandidates:"manage_candidates",useDialer:"use_dialer",shareProfiles:"share_profiles",readOnly:"read_only",viewAnalytics:"view_analytics",useQrBridgeLogin:"use_qr_bridge_login"},B={admin:{id:"admin",label:"Admin",permissions:[p.manageUsers,p.readOnly,p.viewAnalytics,p.shareProfiles,p.useDialer]},recruiter:{id:"recruiter",label:"Recruiter",permissions:Object.values(p)}},De={recruitModule:[p.manageJobs,p.manageCandidates,p.readOnly],careerPortal:[p.manageJobs,p.readOnly],shareProfile:[p.shareProfiles],dialer:[p.useDialer],qrBridgeLogin:[p.useQrBridgeLogin],advancedAnalytics:[p.viewAnalytics]};function Be(e="admin"){return B[e]||B.admin}const Le=new Set([G.trialing,G.active,G.grace]);function re(e,t){if(!e||e.status!=="active")return!1;const s=Be(e.role);return s.permissions.includes("full_access")||s.permissions.includes(t)}function oe(e,t,s){return!e||e.status!=="active"||!le(t)?!1:N(t,e).features.includes(s)}function qe(e,t,s,a){return oe(t,s,a)?(De[a]||[]).some(r=>re(e,r)):!1}function X(e,t,s){if(!e||e.status!=="active")return{allowed:!1,reason:"Company is not active."};if(!le(t))return{allowed:!1,reason:"Subscription is not active."};const{maxUsers:a}=N(t,e);return s>=a?{allowed:!1,reason:`User limit reached: ${s}/${a}.`}:{allowed:!0,reason:"User can be added."}}function le(e){if(!e||!Le.has(e.status))return!1;const t=e.currentPeriodEnd||e.trialEndsAt||e.expiresAt;if(!t)return!0;const s=t.seconds?new Date(t.seconds*1e3):new Date(t);if(Number.isNaN(s.getTime()))return!0;const a=Number(e.gracePeriodDays||0),i=new Date(s);return i.setDate(i.getDate()+a),i>=new Date}const ce={apiKey:"AIzaSyDKuFUJyHUl5AIFSFHCg-4S_wadsha6Et4",authDomain:"recruitment-suite-hr.firebaseapp.com",projectId:"recruitment-suite-hr",storageBucket:"recruitment-suite-hr.firebasestorage.app",messagingSenderId:"1049067446272",appId:"1:1049067446272:web:a0eb4e5a9fac1589a8f8e5",measurementId:"G-87FVXXYEP7"},de=ie(ce),K=ae(de),v=Ie(de),Oe=ie(ce,"SecondaryApp"),je=ae(Oe);function T(e){return{id:e.id,...e.data()}}async function Me(e,t="createdAt",s="desc",a=100){const i=z(v,e);try{return(await V(H(i,ne(t,s),ee(a)))).docs.map(T)}catch(r){if(r.code==="failed-precondition"||r.message.includes("requires an index"))return(await V(H(i,ee(a)))).docs.map(T);throw r}}async function _e(e,t,s="createdAt"){const a=z(v,e);return(await V(H(a,Se("companyId","==",t),ne(s,"desc")))).docs.map(T)}async function Z(e,t){if(!t)return null;const s=await Ne(A(v,e,t));return s.exists()?T(s):null}async function ue(e,t){const s={...t,createdAt:x(),updatedAt:x()};return(await Ce(z(v,e),s)).id}async function pe(e,t,s){return await Pe(A(v,e,t),{...s,createdAt:x(),updatedAt:x()},{merge:!0}),t}async function k(e,t,s){await Ae(A(v,e,t),{...s,updatedAt:x()})}async function Te(e,t){await ke(A(v,e,t))}async function Fe({company:e,owner:t,subscriptionId:s}){return Ue(v,async a=>{const i=e.companyId||A(z(v,"companies")).id,r=A(v,"companies",i),l=A(v,"users",t.userId),o=A(v,"subscriptions",s);if((await a.get(r)).exists())throw new Error(`Client ID "${i}" is already in use.`);return a.set(r,{...e,companyId:i,createdAt:x(),updatedAt:x()}),a.set(l,{...t,companyId:i,createdAt:x(),updatedAt:x()}),a.update(o,{companyId:i,updatedAt:x()}),i})}const me=["nextgenudaan@gmail.com","it.nextgenudaan@gmail.com"],ze=me.join(" or ");function Je(e){return xe(K,e)}async function We(e,t){return(await we(K,e,t)).user}async function fe(){await $e(K)}async function be(e){if(!e)return{firebaseUser:null,user:null,company:null,subscription:null,blocked:!1};const t=(e.email||"").toLowerCase(),s=await Ge("platformAdmins",e.uid);if((s==null?void 0:s.status)==="active")return{firebaseUser:e,platformAdmin:s,user:{id:e.uid,userId:e.uid,name:s.name||e.email||"Platform Admin",email:e.email,role:s.role||"owner",status:"active"},company:null,subscription:null,blocked:!1,adminMode:!0};if(me.includes(t))try{return await pe("platformAdmins",e.uid,{name:t==="it.nextgenudaan@gmail.com"?"NextGen Udaan IT Admin":"NextGen Udaan Owner",email:t,role:"owner",status:"active",bootstrappedBy:"owner_email"}),be(e)}catch{return{firebaseUser:e,user:null,company:null,subscription:null,blocked:!0,ownerOnly:!0,ownerBootstrapMissing:!0,blockedReason:`Owner profile is not initialized. Create /platformAdmins/${e.uid} with email "${t}", role "owner", and status "active".`}}return{firebaseUser:e,user:null,company:null,subscription:null,blocked:!0,ownerOnly:!0,blockedReason:`This private control panel is restricted to ${ze}.`}}async function Ge(e,t){try{return await Z(e,t)}catch(s){if(s.code==="permission-denied"||s.message.includes("permissions"))return null;throw s}}async function ve(e,t){const s=N(e),a=t.ownerId||crypto.randomUUID();return Fe({subscriptionId:e.id,company:{companyId:t.companyId,clientId:t.companyId,subdomain:t.companyId,companyName:t.companyName,ownerId:a,subscriptionId:e.id,plan:e.plan||w.starter.id,maxUsers:s.maxUsers,status:"active",features:s.features,customLimits:e.customLimits||{}},owner:{userId:a,name:t.ownerName,email:t.ownerEmail.toLowerCase(),role:"owner",status:"active",inviteStatus:"accepted"}})}async function Ve({company:e,subscription:t,activeUserCount:s,userId:a,name:i,email:r,role:l}){const o=X(e,t,s);if(!o.allowed)throw new Error(o.reason);return pe("users",a,{userId:a,companyId:e.id,name:i,email:r.toLowerCase(),role:l,status:"active",inviteStatus:"credentials_sent",credentialsProvidedBy:"platform_admin",activatedAt:new Date().toISOString()})}async function He(e,t){if(!B[t])throw new Error("Unknown role.");await k("users",e,{role:t})}async function Qe(e){return _e("users",e)}async function Ye(e){var i;const t=w[e.plan]||w.starter,s=e.plan==="custom"?{maxUsers:Number(e.maxUsers||1),priceMonthly:Number(e.priceMonthly||0)}:{},a=N({plan:t.id,customLimits:s,customFeatures:e.features});return ue("subscriptions",{subscriptionId:e.subscriptionId||`sub_${crypto.randomUUID()}`,purchaseRequestId:e.purchaseRequestId||"",firebaseUid:e.firebaseUid||"",razorpayCustomerId:e.razorpayCustomerId||"",razorpaySubscriptionId:e.razorpaySubscriptionId||"",razorpayPlanId:e.razorpayPlanId||"",customerName:e.customerName,customerEmail:e.customerEmail.toLowerCase(),billingEmail:((i=e.billingEmail)==null?void 0:i.toLowerCase())||e.customerEmail.toLowerCase(),companyName:e.companyName||"",plan:t.id,priceMonthly:a.priceMonthly,maxUsers:a.maxUsers,customLimits:s,customFeatures:a.features,status:e.status||"trialing",trialEndsAt:e.trialEndsAt||null,currentPeriodStart:e.currentPeriodStart||new Date().toISOString(),currentPeriodEnd:e.currentPeriodEnd||null,gracePeriodDays:Number(e.gracePeriodDays||7),cancelAtPeriodEnd:!1,lastPaymentStatus:e.lastPaymentStatus||"not_started",manuallyConfirmedBy:e.manuallyConfirmedBy||"",manuallyConfirmedAt:e.manuallyConfirmedAt||null})}async function Xe(e,t){const s=w[t];if(!s)throw new Error("Unknown upgrade plan.");await k("subscriptions",e,{plan:s.id,maxUsers:s.maxUsers,priceMonthly:s.priceMonthly,customLimits:{},customFeatures:s.features,status:"active",pendingPlanChange:null})}async function Ke(e,t){const s=w[t];if(!s)throw new Error("Unknown downgrade plan.");await k("subscriptions",e,{pendingPlanChange:{plan:s.id,effectiveAt:"period_end",requestedAt:new Date().toISOString()}})}async function Ze(e){await k("subscriptions",e,{cancelAtPeriodEnd:!0,status:"cancelled"})}const et=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});function tt(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}function st(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function c(e=""){return e.toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function Q(e=0,t=1){return t?Math.min(100,Math.round(e/t*100)):0}function u(e,t=!1){var a;(a=document.querySelector(".toast"))==null||a.remove();const s=document.createElement("div");s.className=`toast${t?" error":""}`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>s.remove(),3400)}const L=document.getElementById("app"),te={overview:{icon:"fa-gauge-high",label:"Overview",title:"Owner Control Center",subtitle:"Review paid purchase requests, confirm payment, and manually provision customer access."},requests:{icon:"fa-inbox",label:"Purchase Requests",title:"Payment Requests",subtitle:"Confirm paid Razorpay subscriptions, then create the subscription, company, owner user, and access pass."},companies:{icon:"fa-building-shield",label:"Companies",title:"Company Workspaces",subtitle:"Every subscription provisions one isolated company workspace."},users:{icon:"fa-users-gear",label:"Users",title:"User Management",subtitle:"Invite users, enforce plan limits, and assign RBAC roles."},roles:{icon:"fa-user-lock",label:"Roles",title:"Roles & Permissions",subtitle:"System roles map directly to reusable permission helpers."},subscriptions:{icon:"fa-credit-card",label:"Subscriptions",title:"Manual Subscription Control",subtitle:"You control plan status, upgrades, downgrades, cancellations, trial, grace, and suspension."}};let n={view:"overview",session:null,subscriptions:[],purchaseRequests:[],accessPasses:[],companies:[],users:[],roles:[],permissions:[]};document.addEventListener("DOMContentLoaded",()=>{g(),Je(async e=>{var t;try{n.session=await be(e),(t=n.session)!=null&&t.blocked||await $(),g()}catch(s){console.error(s),ge(s.message)}})});async function $(){const[e,t,s,a,i,r]=await Promise.all([R("subscriptions"),R("accessPasses"),R("companies"),R("users"),R("roles"),R("permissions")]),l=e.filter(o=>!o.companyId).map(o=>{let f="starter";return o.plan_id==="plan_SoAKfnYYCTZHDo"&&(f="professional"),o.plan_id==="plan_SouJvWzj8xFSgg"&&(f="enterprise"),o.plan&&(f=o.plan),{id:o.id,buyerName:o.name||"Unknown Buyer",buyerEmail:o.email||"no-email@test.com",companyName:o.company||`${o.name||"Customer"} Workspace`,mobile:o.mobile||"",plan:f,planName:o.plan_name||q(f),status:o.status||"active",provisioningStatus:o.companyId?"completed":"pending",createdAt:o.created_at||new Date().toISOString(),updatedAt:o.created_at||new Date().toISOString(),razorpaySubscriptionId:o.subscription_id||o.id,razorpayPlanId:o.plan_id||""}});n={...n,subscriptions:e,purchaseRequests:l,accessPasses:t,companies:s,users:a,roles:i,permissions:r}}async function R(e){try{return await Me(e)}catch(t){if(t.code==="permission-denied"||t.message.includes("permissions"))return console.warn(`${e} is blocked by Firestore rules for this account.`),[];throw t}}function g(){var t,s,a;if(!((t=n.session)!=null&&t.firebaseUser)){ge();return}if(n.session.blocked){at();return}const e=te[n.view];L.className="",L.innerHTML=`
        <div class="app-shell">
            <aside class="sidebar">
                <div class="brand">
                    <div class="logo-mark"><i class="fas fa-shield-halved"></i></div>
                    <div>
                        <span class="brand-title">NextGen Udaan</span>
                        <span class="brand-subtitle">Control Center</span>
                    </div>
                </div>
                <nav class="nav">
                    ${Object.entries(te).map(([i,r])=>`
                        <button class="nav-button ${i===n.view?"active":""}" data-view="${i}">
                            <i class="fas ${r.icon}"></i>
                            <span>${r.label}</span>
                        </button>
                    `).join("")}
                </nav>
                <div class="tenant-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <strong class="truncate">${c(((s=n.session.company)==null?void 0:s.companyName)||"Platform Admin")}</strong>
                            <span class="truncate">${n.session.adminMode?"Super Admin":c(((a=n.session.user)==null?void 0:a.role)||"Admin")}</span>
                        </div>
                    </div>
                    <button class="btn w-full !bg-red-500/10 !text-red-400 !border-red-500/20 hover:!bg-red-500/20 transition-all" id="logoutButton" type="button">
                        <i class="fas fa-power-off"></i> Sign Out
                    </button>
                </div>
            </aside>
            <main class="content">
                <header class="topbar glass-card">
                    <div class="flex flex-col">
                        <h1 class="text-2xl font-bold tracking-tight">${e.title}</h1>
                        <p class="text-xs text-slate-500 font-medium">${e.subtitle}</p>
                    </div>
                    <div class="actions">
                        <button class="btn hover-lift" id="refreshButton" type="button">
                            <i class="fas fa-rotate"></i> Sync
                        </button>
                        <button class="btn btn-primary shimmer" id="primaryAction" type="button">
                            <i class="fas fa-plus"></i> ${Pt()}
                        </button>
                    </div>
                </header>
                <section id="viewRoot" class="fade-in">${it()}</section>
            </main>
        </div>
    `,ut(),pt()}function ge(e=""){L.className="shell-loading",L.innerHTML=`
        <form class="boot-card form" id="loginForm">
            <div class="brand-mark"><i class="fas fa-shield-halved"></i></div>
            <div>
                <h1>NextGen Udaan Access</h1>
                <p class="muted">Private owner login. Customers should not use this panel.</p>
            </div>
            ${e?`<p class="badge badge-danger">${c(e)}</p>`:""}
            <div class="field">
                <label for="loginEmail">Email</label>
                <input id="loginEmail" type="email" autocomplete="email" required>
            </div>
            <div class="field">
                <label for="loginPassword">Password</label>
                <input id="loginPassword" type="password" autocomplete="current-password" required>
            </div>
            <button class="btn btn-primary" type="submit"><i class="fas fa-lock"></i> Sign In</button>
        </form>
    `,document.getElementById("loginForm").addEventListener("submit",async t=>{t.preventDefault();try{await We(document.getElementById("loginEmail").value.trim(),document.getElementById("loginPassword").value)}catch(s){u(s.message,!0)}})}function at(){L.className="expired",L.innerHTML=`
        <div class="panel">
            <p class="eyebrow">${n.session.ownerOnly?"Owner access required":"Subscription required"}</p>
            <h1>${n.session.ownerOnly?"This account is not an admin":"Access is paused"}</h1>
            <p class="muted">${c(n.session.blockedReason||"Subscription inactive. Contact NextGen Udaan to restore access.")}</p>
            ${n.session.ownerOnly?'<p class="muted">Create that Firestore document once, then refresh and sign in again.</p>':""}
            <div class="actions">
                <button class="btn btn-primary" id="billingRetry"><i class="fas fa-copy"></i> Copy UID</button>
                <button class="btn" id="logoutButton"><i class="fas fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    `,document.getElementById("logoutButton").addEventListener("click",fe),document.getElementById("billingRetry").addEventListener("click",()=>{var e,t;(t=navigator.clipboard)==null||t.writeText(((e=n.session.firebaseUser)==null?void 0:e.uid)||""),u("UID copied.")})}function it(){switch(n.view){case"requests":return rt();case"companies":return ot();case"users":return lt();case"roles":return ct();case"subscriptions":return dt();default:return nt()}}function nt(){const e=n.purchaseRequests.filter(i=>i.status==="payment_received").length,t=n.purchaseRequests.filter(i=>i.provisioningStatus!=="completed").length,s=n.subscriptions.filter(i=>["active","trialing","grace"].includes(i.status)).length,a=n.companies.filter(i=>i.status==="active").length;return`
        <div class="space-y-8 animate-fade-in">
            <!-- Hero Stats -->
            <section class="grid metrics !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 gap-6">
                ${_("Paid Requests",e,"fa-receipt","blue")}
                ${_("Pending Setup",t,"fa-hourglass-half","amber")}
                ${_("Active Subs",s,"fa-credit-card","indigo")}
                ${_("Companies",a,"fa-building","emerald")}
            </section>

            <div class="grid two gap-8">
                <div class="space-y-8">
                    <!-- Provisioning Queue -->
                    <div class="panel glass-card overflow-hidden">
                        <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 class="text-lg font-bold">Provisioning Queue</h3>
                                <p class="text-xs text-slate-500">Awaiting owner activation</p>
                            </div>
                            ${h(t+" Pending","warning")}
                        </div>
                        <div class="p-0">
                            ${Y(n.purchaseRequests.slice(0,6),!0)}
                        </div>
                    </div>

                    <!-- Usage Stats -->
                    <div class="panel glass-card">
                        <div class="p-6 border-b border-white/5">
                            <h3 class="text-lg font-bold">Plan Usage</h3>
                            <p class="text-xs text-slate-500">Tenant resource consumption</p>
                        </div>
                        <div class="p-6">
                            ${St()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}function rt(){const e=n.purchaseRequests.filter(s=>s.provisioningStatus!=="completed"),t=n.purchaseRequests.filter(s=>s.provisioningStatus==="completed");return`
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Manual confirmation workflow</p>
                    <h2>Confirm payment, then provision access.</h2>
                    <p class="muted">Use this queue after a buyer completes Razorpay checkout. The button creates the subscription, company, owner user profile, and access pass in Firestore.</p>
                </div>
                <div class="domain-strip">
                    ${C("1. Buyer login","Firebase Auth account from public checkout")}
                    ${C("2. Razorpay","Subscription created and linked to a purchase request")}
                    ${C("3. Owner review","You confirm payment in this portal")}
                    ${C("4. Access pass","SaaS login details are created after provisioning")}
                </div>
            </section>
            <section class="grid two">
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Needs Owner Action</h3>
                            <p class="muted">${e.length} request${e.length===1?"":"s"} waiting for review.</p>
                        </div>
                    </div>
                    ${Y(e)}
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Provisioned</h3>
                            <p class="muted">${t.length} completed customer setup${t.length===1?"":"s"}.</p>
                        </div>
                    </div>
                    ${Y(t,!0)}
                </div>
            </section>
        </div>
    `}function ot(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Create Company Workspace</h3>
                <p class="muted">Creates the customer workspace and first login profile after you create the Firebase Auth user.</p>
                <form id="companyForm" class="form">
                    <div class="field">
                        <label for="companySubscription">Subscription</label>
                        <select id="companySubscription" required>
                            <option value="">Select subscription</option>
                            ${n.subscriptions.filter(t=>!t.companyId&&["active","trialing","grace"].includes(t.status)).map(t=>`<option value="${t.id}">${c(t.customerName)} - ${q(t.plan)}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="companyName">Company Name</label>
                        <input id="companyName" required placeholder="e.g. Udaan Talent Partners">
                    </div>
                    <div class="field">
                        <label for="companySubdomain">Client ID / Subdomain</label>
                        <input id="companySubdomain" required placeholder="e.g. udaan-talent">
                    </div>
                    <div class="field">
                        <label for="ownerId">Firebase Auth UID</label>
                        <input id="ownerId" required placeholder="UID for the customer login you created">
                    </div>
                    <div class="field">
                        <label for="ownerName">Owner Name</label>
                        <input id="ownerName" required>
                    </div>
                    <div class="field">
                        <label for="ownerEmail">Owner Email</label>
                        <input id="ownerEmail" type="email" required>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-building-circle-check"></i> Provision</button>
                </form>
            </div>
            <div class="panel">
                <div class="table-head">
                    <div>
                        <h3>Managed Companies</h3>
                        <p class="muted">${n.companies.length} company records</p>
                    </div>
                </div>
                ${$t(n.companies)}
            </div>
        </div>
    `}function lt(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Invite User</h3>
                <p class="muted">Create the Firebase Auth account first, then add the user profile here and send the customer their app link plus credentials.</p>
                <form id="userForm" class="form">
                    <div class="field">
                        <label for="userCompany">Company</label>
                        <select id="userCompany" required>
                            <option value="">Select company</option>
                            ${n.companies.map(e=>`<option value="${e.id}">${c(e.companyName)} - ${W(e.id)}/${e.maxUsers}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="inviteName">User Name</label>
                        <input id="inviteName" required>
                    </div>
                    <div class="field">
                        <label for="inviteUid">Firebase Auth UID</label>
                        <input id="inviteUid" required placeholder="UID for the login you created">
                    </div>
                    <div class="field">
                        <label for="inviteEmail">Email</label>
                        <input id="inviteEmail" type="email" required>
                    </div>
                    <div class="field">
                        <label for="inviteRole">Role</label>
                        <select id="inviteRole" required>
                            ${Object.values(B).map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-user-plus"></i> Create Login Profile</button>
                </form>
            </div>
            <div class="panel">
                <div class="table-head">
                    <div>
                        <h3>Users</h3>
                        <p class="muted">${n.users.length} users across all tenants</p>
                    </div>
                </div>
                ${Et(n.users)}
            </div>
        </div>
    `}function ct(){const e=Object.values(B),t=Object.values(p);return`
        <div class="space-y-8 animate-fade-in">
            <!-- RBAC Matrix -->
            <div class="panel glass-card overflow-hidden">
                <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 class="text-lg font-bold">Permission Matrix</h3>
                        <p class="text-xs text-slate-500">Cross-role capability mapping for the Nextgen Ecosystem</p>
                    </div>
                    <div class="flex gap-2">
                        ${e.map(s=>h(s.label,"soft")).join("")}
                    </div>
                </div>
                <div class="table-wrap overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <th class="px-6 py-4">Permission Scope</th>
                                ${e.map(s=>`<th class="px-6 py-4 text-center">${s.label}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            ${t.map(s=>`
                                <tr class="hover:bg-white/5 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-slate-200">${s.replace(/_/g," ")}</div>
                                        <div class="text-[10px] text-slate-500 font-medium uppercase">Capability</div>
                                    </td>
                                    ${e.map(a=>{const i=a.permissions.includes(s)||a.permissions.includes("full_access");return`
                                            <td class="px-6 py-4 text-center">
                                                <div class="flex justify-center">
                                                    <div class="w-6 h-6 rounded-md flex items-center justify-center ${i?"bg-emerald-500/20 text-emerald-400":"bg-white/5 text-slate-600"}">
                                                        <i class="fas ${i?"fa-check":"fa-minus text-[10px]"}"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        `}).join("")}
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid two gap-8">
                <!-- Role Assignment -->
                <div class="panel glass-card">
                    <div class="p-6 border-b border-white/5">
                        <h3 class="text-lg font-bold">Assign Member Role</h3>
                        <p class="text-xs text-slate-500">Update permissions for a specific user profile</p>
                    </div>
                    <div class="p-6">
                        <form id="roleForm" class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Select User</label>
                                <select id="roleUser" class="theme-input" required>
                                    <option value="">Select a member...</option>
                                    ${n.users.map(s=>`<option value="${s.id}">${c(s.name)} (${c(s.email)})</option>`).join("")}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</label>
                                <div class="grid grid-cols-2 gap-3">
                                    ${e.map(s=>`
                                        <label class="relative flex flex-col p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="radio" name="roleValue" value="${s.id}" class="sr-only" required>
                                            <span class="text-sm font-bold text-slate-200">${s.label}</span>
                                            <span class="text-[10px] text-slate-500 font-medium">${s.permissions.length} perms</span>
                                        </label>
                                    `).join("")}
                                </div>
                            </div>
                            <button class="btn btn-primary w-full shimmer" type="submit">
                                <i class="fas fa-user-shield mr-2"></i> Update Permissions
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Role Summary -->
                <div class="panel glass-card p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <div class="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl">
                        <i class="fas fa-fingerprint"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">Unified Identity</h3>
                        <p class="text-sm text-slate-500 max-w-[280px]">Nextgen RBAC ensures that a user's role in the Access Portal is instantly recognized across all ecosystem applications.</p>
                    </div>
                    <div class="domain-strip w-full">
                        ${C("Isolation","Tenant-level")}
                        ${C("Sync","Real-time")}
                        ${C("Engine","Firestore-Native")}
                    </div>
                </div>
            </div>
        </div>
    `}function dt(){return`
        <div class="grid">
            <section class="grid three">
                ${Object.values(w).map(At).join("")}
            </section>
            <section class="grid two">
                <div class="panel">
                    <h3>Create Subscription</h3>
                    <p class="muted">Owner-operated provisioning. Customers do not see billing controls here.</p>
                    <form id="subscriptionForm" class="form">
                        <div class="field"><label for="customerName">Customer Name</label><input id="customerName" required></div>
                        <div class="field"><label for="customerEmail">Customer Email</label><input id="customerEmail" type="email" required></div>
                        <div class="field">
                            <label for="plan">Plan</label>
                            <select id="plan" required>
                                ${Object.values(w).map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
                            </select>
                        </div>
                        <div class="field"><label for="customMaxUsers">Custom Max Users</label><input id="customMaxUsers" type="number" min="1" placeholder="Only for Custom"></div>
                        <div class="field"><label for="customPrice">Custom Price Monthly</label><input id="customPrice" type="number" min="0" placeholder="Only for Custom"></div>
                        <div class="field">
                            <label for="status">Status</label>
                            <select id="status">
                                <option value="trialing">Trialing</option>
                                <option value="active">Active</option>
                                <option value="grace">Grace</option>
                                <option value="past_due">Past due</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" type="submit"><i class="fas fa-circle-plus"></i> Create Subscription</button>
                    </form>
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Subscriptions</h3>
                            <p class="muted">${n.subscriptions.length} billing records</p>
                        </div>
                    </div>
                    ${It(n.subscriptions)}
                </div>
            </section>
        </div>
    `}function ut(){var e,t,s;document.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{n.view=a.dataset.view,g()})}),(e=document.getElementById("logoutButton"))==null||e.addEventListener("click",fe),(t=document.getElementById("refreshButton"))==null||t.addEventListener("click",async()=>{await $(),g(),u("Data refreshed.")}),(s=document.getElementById("primaryAction"))==null||s.addEventListener("click",()=>{var a,i;(a=document.querySelector("form input, form select"))==null||a.focus(),(i=document.querySelector("form"))==null||i.scrollIntoView({behavior:"smooth",block:"center"})})}function pt(){var s,a,i,r;(s=document.getElementById("subscriptionForm"))==null||s.addEventListener("submit",bt),(a=document.getElementById("companyForm"))==null||a.addEventListener("submit",vt),(i=document.getElementById("userForm"))==null||i.addEventListener("submit",gt),(r=document.getElementById("roleForm"))==null||r.addEventListener("submit",yt);const e=document.getElementById("companyName"),t=document.getElementById("companySubdomain");e&&t&&!t.value&&e.addEventListener("input",()=>{t.value=F(e.value)}),document.querySelectorAll("[data-provision-request]").forEach(l=>{l.addEventListener("click",()=>ft(l.dataset.provisionRequest))}),document.querySelectorAll("[data-sub-action]").forEach(l=>{l.addEventListener("click",()=>ht(l))}),document.querySelectorAll("[data-record-action]").forEach(l=>{l.addEventListener("click",()=>xt(l))})}function mt(e){return e.toString().toLowerCase().trim().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")}function F(e){return mt(e||"")}async function ft(e){var E,P;const t=n.purchaseRequests.find(m=>m.id===e);if(!t){u("Purchase request not found.",!0);return}const s=F(t.companyName),a=F(prompt(`Confirm Client ID / Subdomain for this Company:
(e.g., entering 'brawn' will create brawn.nextgenudaan.in/app)`,s));if(!a){u("Provisioning cancelled.",!0);return}const i="NextGen@2026!";let r;try{u("Creating secure login credentials...",!1),r=(await Ee(je,t.buyerEmail,i)).user}catch(m){if(m.code==="auth/email-already-in-use"){const I=prompt(`An authentication account with this email already exists.
If you want to link to their existing account, enter their Firebase UID from the console below (or click Cancel):`);if(!I){u("Provisioning cancelled.",!0);return}r={uid:I,email:t.buyerEmail}}else{console.error("Auth Creation Error:",m),u("Failed to create Auth user: "+m.message,!0);return}}await k("subscriptions",t.id,{customerName:t.buyerName,customerEmail:t.buyerEmail,plan:t.plan,status:"active",provisioningStatus:"completed",updatedAt:new Date().toISOString()});const l=await Z("subscriptions",t.id);u("Provisioning workspace...",!1);const o=await ve(l,{companyId:a,companyName:t.companyName,ownerId:r.uid,ownerName:t.buyerName,ownerEmail:t.buyerEmail});await ue("accessPasses",{purchaseRequestId:t.id,subscriptionId:t.id,companyId:o,ownerId:r.uid,ownerEmail:t.buyerEmail,ownerName:t.buyerName,companyName:t.companyName,plan:t.plan,planName:q(t.plan),maxUsers:N(l).maxUsers,features:N(l).features,appUrl:`https://${a}.nextgenudaan.in/app`,status:"active",activatedAt:new Date().toISOString(),activatedBy:((E=n.session.user)==null?void 0:E.email)||"owner"}),await $(),g();const f=`Workspace Subdomain: ${a}.nextgenudaan.in/app
Admin Email: ${t.buyerEmail}
Default Password: ${i}`;(P=navigator.clipboard)==null||P.writeText(f),alert(`🎉 Workspace Provisioned Successfully!

Credentials have been COPIED to your clipboard:

${f}

You can now paste this directly into an email to your client.`)}async function bt(e){e.preventDefault();const t={customerName:document.getElementById("customerName").value.trim(),customerEmail:document.getElementById("customerEmail").value.trim(),plan:document.getElementById("plan").value,maxUsers:document.getElementById("customMaxUsers").value,priceMonthly:document.getElementById("customPrice").value,status:document.getElementById("status").value};await Ye(t),await $(),g(),u("Subscription created.")}async function vt(e){e.preventDefault();const t=await Z("subscriptions",document.getElementById("companySubscription").value),s=F(document.getElementById("companySubdomain").value);if(!s){u("Enter a valid client ID / subdomain.",!0);return}await ve(t,{companyId:s,companyName:document.getElementById("companyName").value.trim(),ownerId:document.getElementById("ownerId").value.trim(),ownerName:document.getElementById("ownerName").value.trim(),ownerEmail:document.getElementById("ownerEmail").value.trim()}),await $(),g(),u("Company workspace provisioned.")}async function gt(e){e.preventDefault();const t=n.companies.find(r=>r.id===document.getElementById("userCompany").value),s=Ct(t),a=W(t.id),i=X(t,s,a);if(!i.allowed){u(i.reason,!0);return}await Ve({company:t,subscription:s,activeUserCount:a,userId:document.getElementById("inviteUid").value.trim(),name:document.getElementById("inviteName").value.trim(),email:document.getElementById("inviteEmail").value.trim(),role:document.getElementById("inviteRole").value}),await $(),g(),u("Customer login profile created.")}async function yt(e){e.preventDefault();const t=document.getElementById("roleUser").value,s=document.getElementById("roleValue").value;await He(t,s),await $(),g(),u("Role assigned.")}async function ht(e){const t=e.dataset.subId,s=e.dataset.subAction,a=e.dataset.plan;s==="upgrade"&&await Xe(t,a),s==="downgrade"&&await Ke(t,a),s==="cancel"&&await Ze(t),s==="suspend"&&await k("subscriptions",t,{status:"suspended"}),await $(),g(),u(`Subscription ${s} saved.`)}function se(e,t,s,a){const i=document.getElementById("custom-modal");i&&i.remove();let r={};try{r=JSON.parse(t)}catch{r={content:t}}const l=(E,P="")=>{let m="";for(const[I,d]of Object.entries(E)){const S=`field-${P}${I}`,b=I.replace(/([A-Z])/g," $1").trim();d===null?m+=`
                    <div class="mb-3">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${c(b)}</label>
                        <input type="text" id="${S}" value="null" ${s?"disabled":""} class="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-slate-300 text-xs focus:border-blue-500 outline-none transition-colors" />
                    </div>
                `:typeof d=="boolean"?m+=`
                    <div class="mb-3">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${c(b)}</label>
                        <select id="${S}" ${s?"disabled":""} class="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-slate-300 text-xs focus:border-blue-500 outline-none transition-colors">
                            <option value="true" ${d===!0?"selected":""}>True</option>
                            <option value="false" ${d===!1?"selected":""}>False</option>
                        </select>
                    </div>
                `:typeof d=="number"?m+=`
                    <div class="mb-3">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${c(b)}</label>
                        <input type="number" id="${S}" value="${d}" ${s?"disabled":""} class="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-slate-300 text-xs focus:border-blue-500 outline-none transition-colors" />
                    </div>
                `:Array.isArray(d)?m+=`
                    <div class="mb-3">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${c(b)}</label>
                        <textarea id="${S}" ${s?"disabled":""} class="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-slate-300 text-xs font-mono focus:border-blue-500 outline-none transition-colors resize-none h-16">${JSON.stringify(d,null,2)}</textarea>
                    </div>
                `:typeof d=="object"&&d!==null?m+=`
                    <div class="mb-3 p-2 bg-white/5 border border-white/10 rounded-lg">
                        <label class="block text-xs font-bold text-slate-300 mb-2">${c(b)}</label>
                        <div class="ml-1">
                            ${l(d,`${P}${I}-`)}
                        </div>
                    </div>
                `:m+=`
                    <div class="mb-3">
                        <label class="block text-xs font-bold text-slate-400 mb-1">${c(b)}</label>
                        <input type="text" id="${S}" value="${c(String(d))}" ${s?"disabled":""} class="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-slate-300 text-xs focus:border-blue-500 outline-none transition-colors" />
                    </div>
                `}return m},o=document.createElement("div");o.id="custom-modal",o.className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in",o.innerHTML=`
        <div class="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[70vh]">
            <div class="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 flex-shrink-0">
                <h3 class="text-base font-bold text-white truncate">${c(e)}</h3>
                <button id="modal-close" class="text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-4"><i class="fas fa-times"></i></button>
            </div>
            <div class="px-5 py-4 overflow-y-auto flex-1 min-h-0">
                <form id="modal-form" class="space-y-3">
                    ${l(r)}
                </form>
            </div>
            <div class="px-6 py-4 border-t border-white/5 bg-black/20 flex justify-end gap-2 flex-shrink-0">
                <button id="modal-cancel" class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all">Close</button>
                ${s?"":'<button id="modal-save" type="button" class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all">Save</button>'}
            </div>
        </div>
    `,document.body.appendChild(o);const f=()=>o.remove();document.getElementById("modal-close").addEventListener("click",f),document.getElementById("modal-cancel").addEventListener("click",f),s||document.getElementById("modal-save").addEventListener("click",()=>{const E={};document.getElementById("modal-form").querySelectorAll("input, select, textarea").forEach(d=>{const S=d.id;if(!S)return;const b=S.replace("field-","").split("-");let O=E;for(let U=0;U<b.length-1;U++)O[b[U]]||(O[b[U]]={}),O=O[b[U]];const he=b[b.length-1];let y=d.value;if(d.tagName==="SELECT")y=y==="true"?!0:y==="false"?!1:y;else if(d.type==="number")y=isNaN(Number(y))?y:Number(y);else if(d.tagName==="TEXTAREA"&&d.value.trim().startsWith("["))try{y=JSON.parse(d.value)}catch{y=d.value}O[he]=y});const I=Object.keys(E).length===0?t:JSON.stringify(E,null,2);a(I),f()})}async function xt(e){const t=e.dataset.recordAction,s=e.dataset.collection,a=e.dataset.recordId,i=wt(s,a);if(!i){u("Record not found.",!0);return}if(t==="view"){se(`View ${s}/${a}`,JSON.stringify(i,null,2),!0);return}if(t==="edit"){const r={...i};delete r.id,delete r.createdAt,delete r.updatedAt,se(`Edit ${s}/${a}`,JSON.stringify(r,null,2),!1,async l=>{if(l)try{const o=JSON.parse(l);await k(s,a,o),await $(),g(),u("Record updated.")}catch(o){u(`Edit failed: ${o.message}`,!0)}});return}if(t==="delete"){if(!confirm(`Delete ${s}/${a}? This cannot be undone.`))return;try{await Te(s,a),await $(),g(),u("Record deleted.")}catch(l){u(`Delete failed: ${l.message}`,!0)}}}function wt(e,t){var a;return(a={subscriptions:n.subscriptions,companies:n.companies,users:n.users,roles:n.roles,permissions:n.permissions,accessPasses:n.accessPasses,purchaseRequests:n.purchaseRequests}[e])==null?void 0:a.find(i=>i.id===t)}function Y(e,t=!1){return e.length?`
        <div class="table-wrap overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Buyer</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Provisioning</th>
                        ${t?"":'<th class="px-6 py-4">Action</th>'}
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(s=>{const a=s.provisioningStatus==="completed";return`
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-200">${c(s.companyName||s.buyerName||"Unknown buyer")}</div>
                                    <div class="text-[10px] text-slate-500 font-medium">${c(s.buyerEmail||"")}</div>
                                </td>
                                <td class="px-6 py-4">
                                    ${h(q(s.plan),"info")}
                                    <div class="text-[10px] text-slate-500 mt-1">${s.maxUsers||N(s).maxUsers} users</div>
                                </td>
                                <td class="px-6 py-4">
                                    ${h(s.status||"pending",J(s.status))}
                                    <div class="text-[10px] text-slate-500 mt-1">${st(s.updatedAt||s.createdAt)}</div>
                                </td>
                                <td class="px-6 py-4">${h(s.provisioningStatus||"idle",a?"success":"warning")}</td>
                                ${t?"":`
                                    <td class="px-6 py-4">
                                        <button class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100" data-provision-request="${s.id}" ${a?"disabled":""}>
                                            Activate
                                        </button>
                                    </td>
                                `}
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        </div>
    `:M("No purchase requests in this queue.")}function $t(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Company</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Users</th>
                        <th class="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>{const s=W(t.id);return`
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-200">${c(t.companyName)}</div>
                                    <div class="text-[10px] text-slate-500 font-medium">${c(t.id)}</div>
                                </td>
                                <td class="px-6 py-4">${h(q(t.plan),"info")}</td>
                                <td class="px-6 py-4">${h(t.status||"active",J(t.status))}</td>
                                <td class="px-6 py-4">
                                    <div class="flex justify-between text-[10px] font-bold mb-1">
                                        <span>${s} / ${t.maxUsers}</span>
                                        <span>${Q(s,t.maxUsers)}%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style="width: ${Q(s,t.maxUsers)}%"></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">${ye("companies",t.id)}</td>
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        </div>
    `:M("No companies provisioned yet.")}function Et(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">User</th>
                        <th class="px-6 py-4">Company</th>
                        <th class="px-6 py-4">Role</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>{var s;return`
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-200">${c(t.name)}</div>
                                <div class="text-[10px] text-slate-500 font-medium">${c(t.email)}</div>
                            </td>
                            <td class="px-6 py-4 text-xs font-medium text-slate-400">${c(Nt(t.companyId))}</td>
                            <td class="px-6 py-4">${h(((s=B[t.role])==null?void 0:s.label)||t.role,"info")}</td>
                            <td class="px-6 py-4">${h(t.status||"active",J(t.status))}</td>
                            <td class="px-6 py-4">${ye("users",t.id)}</td>
                        </tr>
                    `}).join("")}
                </tbody>
            </table>
        </div>
    `:M("No users created yet.")}function It(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Customer</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>`
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-200">${c(t.customerName)}</div>
                                <div class="text-[10px] text-slate-500 font-medium">${c(t.customerEmail)}</div>
                            </td>
                            <td class="px-6 py-4">
                                ${h(q(t.plan),"info")}
                                <div class="text-[10px] text-slate-500 mt-1">${t.maxUsers||N(t).maxUsers} users</div>
                            </td>
                            <td class="px-6 py-4">
                                ${h(t.status||"active",J(t.status))}
                                <div class="text-[10px] text-slate-500 mt-1">Ends ${tt(t.currentPeriodEnd)}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    ${D("view","subscriptions",t.id,"fa-eye","View")}
                                    ${D("edit","subscriptions",t.id,"fa-pen","Edit")}
                                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all" data-sub-action="upgrade" data-plan="enterprise" data-sub-id="${t.id}" title="Upgrade"><i class="fas fa-arrow-up text-xs"></i></button>
                                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-amber-500/20 hover:text-amber-400 transition-all" data-sub-action="suspend" data-sub-id="${t.id}" title="Suspend"><i class="fas fa-ban text-xs"></i></button>
                                    ${D("delete","subscriptions",t.id,"fa-trash","Delete",!0)}
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `:M("No subscriptions created yet.")}function ye(e,t){return`
        <div class="flex gap-2">
            ${D("view",e,t,"fa-eye","View")}
            ${D("edit",e,t,"fa-pen","Edit")}
            ${D("delete",e,t,"fa-trash","Delete",!0)}
        </div>
    `}function D(e,t,s,a,i,r=!1){return`
        <button class="w-8 h-8 rounded-lg ${r?"bg-red-500/10 text-red-500 hover:bg-red-500/20":"bg-white/5 hover:bg-blue-500/20 hover:text-blue-400"} flex items-center justify-center transition-all"
            data-record-action="${e}"
            data-collection="${t}"
            data-record-id="${c(s)}"
            title="${i}">
            <i class="fas ${a} text-xs"></i>
        </button>
    `}function St(){return n.companies.length?`<div class="domain-strip">${n.companies.map(e=>{const t=W(e.id);return`
            <div>
                <div class="domain-item">
                    <strong>${c(e.companyName)}</strong>
                    <span>${t}/${e.maxUsers} users</span>
                </div>
                <div class="progress"><span style="--value:${Q(t,e.maxUsers)}%"></span></div>
            </div>
        `}).join("")}</div>`:M("No usage data yet.")}function At(e){const t=e.priceMonthly?`${et.format(e.priceMonthly)}/month`:"Dynamic pricing";return`
        <div class="panel plan-card">
            <div>
                <h3>${e.name}</h3>
                <div class="plan-price">${t}</div>
                <p class="muted">${e.maxUsers?`${e.maxUsers} max users`:"Custom user limits"}</p>
            </div>
            <div class="plan-features">
                ${e.features.map(s=>`<span><i class="fas fa-check"></i> ${kt(s)}</span>`).join("")}
            </div>
        </div>
    `}function _(e,t,s,a="blue"){const i={blue:"from-blue-600 to-indigo-600 shadow-blue-500/20 text-blue-500",emerald:"from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-500",amber:"from-amber-400 to-orange-500 shadow-amber-500/20 text-amber-500",indigo:"from-indigo-600 to-violet-600 shadow-indigo-500/20 text-indigo-500",rose:"from-rose-500 to-pink-500 shadow-rose-500/20 text-rose-500"},r=i[a]||i.blue;return`
        <div class="panel glass-card p-6 flex items-center gap-6 group hover-lift transition-all">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${r.split(" ").slice(0,2).join(" ")} flex items-center justify-center text-white text-xl shadow-lg ${r.split(" ")[2]} group-hover:scale-110 transition-transform">
                <i class="fas ${s}"></i>
            </div>
            <div>
                <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">${e}</div>
                <div class="text-3xl font-black text-white">${t}</div>
            </div>
        </div>
    `}function C(e,t){return`
        <div class="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
            <strong class="text-sm font-bold">${c(e)}</strong>
            <span class="text-xs text-slate-500 font-medium">${c(t)}</span>
        </div>
    `}function h(e,t="soft"){const s={success:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",warning:"bg-amber-500/10 text-amber-400 border-amber-500/20",danger:"bg-rose-500/10 text-rose-400 border-rose-500/20",info:"bg-blue-500/10 text-blue-400 border-blue-500/20",soft:"bg-slate-500/10 text-slate-400 border-slate-500/20"};return`<span class="px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${s[t]||s.soft}">${c(e)}</span>`}function M(e){return`<div class="empty">${c(e)}</div>`}function J(e=""){return["active","accepted","payment_received","owner_confirmed","completed"].includes(e)?"success":["trialing","grace","invited","pending","pending_payment","not_started"].includes(e)?"warning":["suspended","cancelled","expired","past_due","disabled","halted","payment_failed"].includes(e)?"danger":"soft"}function W(e){return n.users.filter(t=>t.companyId===e&&t.status!=="disabled").length}function Nt(e){var t;return((t=n.companies.find(s=>s.id===e))==null?void 0:t.companyName)||"Unknown company"}function Ct(e){var t;return((t=n.session)==null?void 0:t.subscription)||n.subscriptions.find(s=>s.id===(e==null?void 0:e.subscriptionId))||n.subscriptions[0]||null}function q(e){var t;return((t=w[e])==null?void 0:t.name)||"Custom"}function kt(e){var t;return((t=j[e])==null?void 0:t.label)||e}function Pt(){return n.view==="requests"?"Review Request":n.view==="companies"?"Create Company":n.view==="users"?"Invite User":n.view==="roles"?"Assign Role":n.view==="subscriptions"?"Create Plan":"New Record"}window.NextGenAccess={hasPermission:re,hasFeature:oe,canAddUser:X,canAccessModule:qe,getCompanyUsers:Qe};
