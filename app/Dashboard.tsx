/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

type Product = { id:string; name:string; detail:string; price:number; stock:number; weeklyPacks:number; unitsPerPack:number; color:string; emoji:string; image:string };
type Sale = { id:string; createdAt:string; total:number; payment:string; items:string };
type Booking = { id:string; date:string; start:string; end:string; customer:string; phone:string; note:string };
type Movement = { id:string; createdAt:string; product:string; packs:number; unitsPerPack:number; quantity:number; kind:"entrada"|"ajuste"|"venda" };
type ScheduleSlot = { id:string; day:string; time:string; customer:string; checkedIn:boolean; note:string };
type Store = { products:Product[]; sales:Sale[]; bookings:Booking[]; movements:Movement[]; schedule?:ScheduleSlot[] };

const initial: Product[] = [
  {id:"coca2",name:"Coca-Cola",detail:"Garrafa PET 2L",price:12,stock:36,weeklyPacks:6,unitsPerPack:6,color:"#e82924",emoji:"🥤",image:"https://dxtecstore.github.io/products/coca-cola-2l.jpg"},
  {id:"fanta2",name:"Fanta Laranja",detail:"Garrafa PET 2L",price:10,stock:18,weeklyPacks:3,unitsPerPack:6,color:"#f58220",emoji:"🍊",image:"https://dxtecstore.github.io/products/fanta-laranja-2l.png"},
  {id:"cocalata",name:"Coca-Cola",detail:"Lata 350ml",price:5,stock:24,weeklyPacks:4,unitsPerPack:6,color:"#b91c1c",emoji:"🥫",image:"https://dxtecstore.github.io/products/coca-cola-lata.jpg"},
  {id:"skilhos",name:"Skilhos Hiléia",detail:"Salgadinho sabor carne seca",price:5,stock:25,weeklyPacks:5,unitsPerPack:5,color:"#7aaf36",emoji:"🌽",image:"https://dxtecstore.github.io/products/skilhos-carne-seca.png"},
];

const weeklyNames:Record<string,Record<string,string>>={
  "Segunda-feira":{"19:00":"Igreja","20:00":"Alan","21:00":"Misturado","22:00":"João"},
  "Terça-feira":{"19:00":"Cearense","20:00":"Cano","21:00":"Mototáxi","22:00":"Atual"},
  "Quarta-feira":{"18:00":"Felipe","19:00":"Polícia","20:00":"Professores","21:00":"Renan","22:00":"Henrique"},
  "Quinta-feira":{"19:00":"Barcarena","20:00":"Igreja","21:00":"Misturado","22:00":"Felipe"},
  "Sexta-feira":{"15:00":"Ônibus","17:00":"Maciel","18:00":"Crianças","19:00":"João","20:00":"Frank","21:00":"Tio Nany","22:00":"Lucivaldo"},
  "Sábado":{"09:00":"Lambão","10:00":"Mangola","17:00":"Máquinas Versáteis","19:00":"Eduardo","20:00":"Digão","21:00":"Peu","22:00":"Atual"},
  "Domingo":{"09:00":"Fábio","10:00":"Chopp","11:00":"Yago"},
};
const weekHours:Record<string,string[]>={
  "Segunda-feira":["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Terça-feira":["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Quarta-feira":["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Quinta-feira":["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Sexta-feira":["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Sábado":["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
  "Domingo":["07:00","08:00","09:00","10:00","11:00"],
};
const initialSchedule:ScheduleSlot[]=Object.entries(weekHours).flatMap(([day,hours])=>hours.map(time=>({id:`${day}-${time}`,day,time,customer:weeklyNames[day]?.[time]||"",checkedIn:false,note:""})));

const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const stamp=()=>new Date().toISOString();

export default function Dashboard(){
  const [tab,setTab]=useState("caixa");
  const [products,setProducts]=useState<Product[]>(initial);
  const [sales,setSales]=useState<Sale[]>([]);
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [movements,setMovements]=useState<Movement[]>([]);
  const [schedule,setSchedule]=useState<ScheduleSlot[]>(initialSchedule);
  const [cart,setCart]=useState<Record<string,number>>({});
  const [payment,setPayment]=useState("Pix");
  const [received,setReceived]=useState("");
  const [checkout,setCheckout]=useState(false);
  const [toast,setToast]=useState("");
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("arena-caixa-v2")||"null") as Store|null;
      if(saved){setProducts(saved.products?.length?saved.products:initial);setSales(saved.sales||[]);setBookings(saved.bookings||[]);setMovements(saved.movements||[]);setSchedule(saved.schedule?.length?saved.schedule:initialSchedule)}
    }catch{}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)localStorage.setItem("arena-caixa-v2",JSON.stringify({products,sales,bookings,movements,schedule}))},[ready,products,sales,bookings,movements,schedule]);

  const notify=(text:string)=>{setToast(text);setTimeout(()=>setToast(""),2600)};
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=products.reduce((sum,p)=>sum+(cart[p.id]||0)*p.price,0);
  const stockTotal=products.reduce((sum,p)=>sum+p.stock,0);
  const weeklyTotal=products.reduce((sum,p)=>sum+p.weeklyPacks*p.unitsPerPack,0);
  const today=new Date().toLocaleDateString("pt-BR");
  const todaySales=sales.filter(s=>new Date(s.createdAt).toLocaleDateString("pt-BR")===today);
  const dayTotal=todaySales.reduce((sum,s)=>sum+s.total,0);

  function add(p:Product){if((cart[p.id]||0)>=p.stock)return notify("Estoque insuficiente");setCart(c=>({...c,[p.id]:(c[p.id]||0)+1}))}
  function changeQty(id:string,delta:number){const p=products.find(x=>x.id===id)!;setCart(c=>({...c,[id]:Math.max(0,Math.min(p.stock,(c[id]||0)+delta))}))}
  function finishSale(){
    if(payment==="Dinheiro"&&Number(received.replace(",","."))<total)return notify("Valor recebido é menor que o total");
    const selected=products.filter(p=>cart[p.id]);
    setSales(s=>[{id:crypto.randomUUID(),createdAt:stamp(),total,payment,items:selected.map(p=>`${cart[p.id]}x ${p.name} ${p.detail}`).join(", ")},...s]);
    setMovements(m=>[...selected.map(p=>({id:crypto.randomUUID(),createdAt:stamp(),product:`${p.name} ${p.detail}`,packs:0,unitsPerPack:1,quantity:-(cart[p.id]||0),kind:"venda" as const})),...m]);
    setProducts(ps=>ps.map(p=>({...p,stock:p.stock-(cart[p.id]||0)})));setCart({});setReceived("");setCheckout(false);notify("Venda finalizada e estoque atualizado!");
  }
  function receiveWeekly(p:Product){
    const quantity=p.weeklyPacks*p.unitsPerPack;
    if(quantity<=0)return notify("Informe pacotes e unidades por pacote");
    setProducts(ps=>ps.map(x=>x.id===p.id?{...x,stock:x.stock+quantity}:x));
    setMovements(m=>[{id:crypto.randomUUID(),createdAt:stamp(),product:`${p.name} ${p.detail}`,packs:p.weeklyPacks,unitsPerPack:p.unitsPerPack,quantity,kind:"entrada"},...m]);
    notify(`${quantity} unidades adicionadas ao estoque`);
  }
  function reserveSlot(slot:ScheduleSlot){const name=prompt("Nome do cliente ou grupo:");if(!name?.trim())return;setSchedule(s=>s.map(x=>x.id===slot.id?{...x,customer:name.trim(),checkedIn:false}:x));notify(`${slot.day}, ${slot.time} reservado`)}
  function clearSlot(slot:ScheduleSlot){if(confirm(`Liberar ${slot.day} às ${slot.time}?`))setSchedule(s=>s.map(x=>x.id===slot.id?{...x,customer:"",checkedIn:false,note:""}:x))}
  function toggleCheckIn(slot:ScheduleSlot){setSchedule(s=>s.map(x=>x.id===slot.id?{...x,checkedIn:!x.checkedIn}:x));notify(slot.checkedIn?"Check-in desfeito":"Check-in confirmado")}
  function logout(){localStorage.removeItem("arena_session");location.reload()}

  return <main>
    <header className="topbar"><div className="brand"><span>A</span><div><b>ARENA</b><small>Caixa & Agenda</small></div></div><div className="headeractions"><div className="open"><i/> Caixa aberto</div><button className="logout" onClick={logout}>Sair</button></div></header>
    <section className="content">
      {tab==="caixa"&&<><Title over="OPERAÇÃO DO DIA" title="Nova venda" side={today}/><div className="summary"><Metric label="Vendas hoje" value={`${todaySales.length}`}/><Metric label="Total hoje" value={money(dayTotal)}/><Metric label="Itens em estoque" value={`${stockTotal}`}/></div><div className="sectionhead"><h2>Toque para adicionar</h2><span>{count} itens</span></div><div className="productgrid">{products.map(p=><button className="product" key={p.id} onClick={()=>add(p)} disabled={!p.stock}><div className="visual" style={{background:`${p.color}0d`}}>{p.image?<img src={p.image} alt={`${p.name} ${p.detail}`}/>:<span>{p.emoji}</span>}<b style={{background:p.stock<6?"#d4392f":p.color}}>{p.stock}</b>{p.stock<6&&<small>Estoque baixo</small>}</div><div className="productcopy"><strong>{p.name}</strong><small>{p.detail}</small><b>{money(p.price)}</b></div><em>+</em></button>)}</div>{count>0&&<div className="cartbar"><div><small>{count} itens no pedido</small><strong>{money(total)}</strong></div><button onClick={()=>setCheckout(true)}>Ver pedido →</button></div>}</>}

      {tab==="agenda"&&<><Title over="ARENA SOCIETY" title="Agenda semanal" side={`${schedule.filter(s=>s.customer).length} ocupados`}/><div className="summary"><Metric label="Horários disponíveis" value={`${schedule.filter(s=>!s.customer).length}`}/><Metric label="Reservados" value={`${schedule.filter(s=>s.customer).length}`}/><Metric label="Check-ins" value={`${schedule.filter(s=>s.checkedIn).length}`}/></div><div className="schedulelegend"><span><i className="free"/>Disponível</span><span><i className="busy"/>Reservado</span><span><i className="present"/>Check-in feito</span></div><div className="weekgrid">{Object.keys(weekHours).map(day=><section className="daycard" key={day}><header><h2>{day}</h2><span>{schedule.filter(s=>s.day===day&&!s.customer).length} livres</span></header><div>{schedule.filter(s=>s.day===day).map(slot=><article className={`slot ${slot.customer?slot.checkedIn?"checked":"occupied":"available"}`} key={slot.id}><time>{slot.time}</time><div className="slotmain"><strong>{slot.customer||"Disponível"}</strong>{slot.customer&&<input aria-label={`Observação ${slot.day} ${slot.time}`} placeholder="Adicionar observação..." value={slot.note} onChange={e=>setSchedule(s=>s.map(x=>x.id===slot.id?{...x,note:e.target.value}:x))}/>}</div>{slot.customer?<div className="slotactions"><button className={slot.checkedIn?"done":""} onClick={()=>toggleCheckIn(slot)}>{slot.checkedIn?"✓ Presente":"Check-in"}</button><button className="clear" aria-label={`Liberar ${slot.day} ${slot.time}`} onClick={()=>clearSlot(slot)}>×</button></div>:<button className="reserve" onClick={()=>reserveSlot(slot)}>+ Reservar</button>}</article>)}</div></section>)}</div></>}

      {tab==="vendas"&&<><Title over="CONTROLE" title="Histórico de vendas" side={`${sales.length} vendas`}/><div className="list">{sales.length?sales.map(s=><article className="sale" key={s.id}><div><strong>{s.items}</strong><small>{new Date(s.createdAt).toLocaleString("pt-BR")} • {s.payment}</small></div><b>{money(s.total)}</b></article>):<Empty icon="🧾" title="Nenhuma venda registrada" text="As vendas finalizadas aparecerão aqui."/>}</div></>}

      {tab==="estoque"&&<><Title over="ESTOQUE SEMANAL" title="Entradas e produtos" side={`${stockTotal} unidades`}/><div className="summary"><Metric label="Demanda semanal" value={`${weeklyTotal} un.`}/><Metric label="Estoque atual" value={`${stockTotal} un.`}/><Metric label="Movimentações" value={`${movements.length}`}/></div><div className="adminbar"><div><strong>Recebimento por pacote</strong><small>Configure a demanda e toque em “Dar entrada” quando a mercadoria chegar.</small></div><button onClick={()=>setProducts(ps=>[...ps,{id:crypto.randomUUID(),name:"Novo produto",detail:"Unidade",price:0,stock:0,weeklyPacks:1,unitsPerPack:1,color:"#146b45",emoji:"📦",image:""}])}>+ Novo produto</button></div><div className="stockcards">{products.map(p=><article className="stockcard" key={p.id}><div className="stockphoto">{p.image?<img src={p.image} alt={p.name}/>:<span>{p.emoji}</span>}</div><div className="stockfields"><label>Produto<input value={p.name} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}/></label><label>Descrição<input value={p.detail} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,detail:e.target.value}:x))}/></label><label className="imagefield">Endereço da foto<input placeholder="https://..." value={p.image} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,image:e.target.value}:x))}/></label></div><div className="stocknumbers"><label>Preço de venda<div className="moneyinput"><span>R$</span><input type="number" step=".01" min="0" value={p.price} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,price:+e.target.value}:x))}/></div></label><label>Estoque atual<input type="number" min="0" value={p.stock} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,stock:+e.target.value}:x))}/></label><label>Pacotes/semana<input type="number" min="0" value={p.weeklyPacks} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,weeklyPacks:+e.target.value}:x))}/></label><label>Unid. por pacote<input type="number" min="1" value={p.unitsPerPack} onChange={e=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,unitsPerPack:+e.target.value}:x))}/></label></div><div className="stockactions"><button className="primary" onClick={()=>receiveWeekly(p)}>Dar entrada +{p.weeklyPacks*p.unitsPerPack}</button><button onClick={()=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,stock:x.stock+1}:x))}>Ajuste +1</button><button className="danger" onClick={()=>confirm(`Excluir ${p.name}?`)&&setProducts(ps=>ps.filter(x=>x.id!==p.id))}>Excluir</button></div></article>)}</div><div className="sectionhead"><h2>Histórico de movimentações</h2></div><div className="list">{movements.length?movements.map(m=><article className="sale" key={m.id}><div><strong>{m.product}</strong><small>{new Date(m.createdAt).toLocaleString("pt-BR")} • {m.kind}{m.packs?` • ${m.packs} pacotes × ${m.unitsPerPack}`:""}</small></div><b style={{color:m.quantity>0?"#146b45":"#c83a32"}}>{m.quantity>0?"+":""}{m.quantity} un.</b></article>):<Empty icon="📦" title="Nenhuma movimentação" text="As entradas e vendas aparecerão aqui."/>}</div></>}
    </section>
    <nav className="bottomnav">{[["caixa","▣","Caixa"],["agenda","▦","Horários"],["vendas","≡","Vendas"],["estoque","◈","Estoque"]].map(x=><button key={x[0]} className={tab===x[0]?"active":""} onClick={()=>setTab(x[0])}><span>{x[1]}</span>{x[2]}</button>)}</nav>
    {checkout&&<div className="overlay"><section className="checkout"><button className="close" onClick={()=>setCheckout(false)}>×</button><small>FINALIZAR VENDA</small><h2>Resumo do pedido</h2><div className="cartitems">{products.filter(p=>cart[p.id]).map(p=><div key={p.id}><span><b>{p.name}</b><small>{money(p.price)} cada</small></span><div><button onClick={()=>changeQty(p.id,-1)}>−</button><b>{cart[p.id]}</b><button onClick={()=>changeQty(p.id,1)}>+</button></div></div>)}</div><div className="ordertotal"><span>Total</span><b>{money(total)}</b></div><label className="paylabel">Forma de pagamento</label><div className="payments">{["Pix","Dinheiro","Cartão"].map(x=><button key={x} className={payment===x?"active":""} onClick={()=>setPayment(x)}>{x}</button>)}</div>{payment==="Dinheiro"&&<label className="received">Valor recebido<input inputMode="decimal" placeholder="0,00" value={received} onChange={e=>setReceived(e.target.value)}/>{Number(received.replace(",","."))>=total&&<small>Troco: {money(Number(received.replace(",","."))-total)}</small>}</label>}<button className="finish" onClick={finishSale}>Confirmar venda • {money(total)}</button></section></div>}
    {toast&&<div className="toast">✓ {toast}</div>}
  </main>;
}

function Title({over,title,side}:{over:string;title:string;side:string}){return <div className="title"><div><small>{over}</small><h1>{title}</h1></div><span>{side}</span></div>}
function Metric({label,value}:{label:string;value:string}){return <article><small>{label}</small><strong>{value}</strong></article>}
function Empty({icon,title,text}:{icon:string;title:string;text:string}){return <div className="empty"><span>{icon}</span><strong>{title}</strong><small>{text}</small></div>}
