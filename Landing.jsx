import { useState, useRef, useEffect } from "react";

const SERVICES = [
  {
    id: "factoraje", icon: "📄", tag: "Alta demanda", tagColor: "#4ade80",
    title: "Factoraje Financiero",
    subtitle: "Cuentas por cobrar y pago a proveedores",
    desc: "¿Tienes facturas pendientes de cobro o por pagar? Las convertimos en liquidez inmediata. Accede hasta el 90% de su valor sin esperar a que tus clientes te paguen — porque tu flujo de caja no puede estar a merced de sus plazos.",
    features: ["Hasta el 90% del valor de tus facturas en liquidez inmediata","Plazos de 15 a 150 días para pagar","Tasas desde 1.5% mensual","Líneas de financiamiento de hasta $100 MDP","Cobranza delegada o directa — tú decides"],
  },
  {
    id: "revolvente", icon: "🔄", tag: "Muy flexible", tagColor: "#c4a15c",
    title: "Línea Revolvente",
    subtitle: "Crédito que se recarga cada vez que pagas",
    desc: "Para empresas que necesitan apalancarse varias veces al año sin volver a tramitar desde cero. Pagas y la línea se regenera. El favorito de los negocios con ciclos de venta cortos y alta rotación de capital.",
    features: ["Montos de hasta $50 MDP","Plazos de hasta 60 meses","Comisiones por apertura menores al 3.5%","Con o sin garantía hipotecaria"],
  },
  {
    id: "simple", icon: "💼", tag: "Más solicitado", tagColor: "#a78bfa",
    title: "Crédito Simple",
    subtitle: "La línea tradicional, sin sorpresas",
    desc: "Sabes exactamente cuánto vas a pagar desde el día uno. Ideal si prefieres certeza financiera total o si estás construyendo tu primer historial. Podemos trabajar con varias financieras al mismo tiempo para maximizar el monto.",
    features: ["Montos de hasta $300 MDP","Tasas menores al 35% anual","Plazos de 6 a 72 meses","Garantía hipotecaria en montos superiores a $10 MDP","Combinación de múltiples financieras para ampliar el monto"],
  },
  {
    id: "arrendamiento", icon: "🏭", tag: "Beneficio fiscal", tagColor: "#4ade80",
    title: "Arrendamiento",
    subtitle: "Puro o financiero para activos productivos",
    desc: "Adquiere maquinaria, equipo o vehículos mientras optimizas tu carga fiscal. Deduce las mensualidades al 100% y renueva activos al final del contrato.",
    features: ["Enganche desde el 10%","Plazos de hasta 60 meses","Mensualidades 100% deducibles de impuestos","Renovación de activos al vencer el contrato"],
  },
  {
    id: "leaseback", icon: "🔃", tag: "Muy inteligente", tagColor: "#f97316",
    title: "Sale & Leaseback",
    subtitle: "Capitalízate sin perder tus activos",
    desc: "Tus activos trabajan para ti mientras te generan liquidez. Los 'vendemos' a la financiera, que te otorga crédito y te los renta. Al final del plazo los recuperas pagando el valor residual.",
    features: ["Entre el 30% y 100% del valor factura","Activos con antigüedad menor a 6 años","Mensualidades 100% deducibles de impuestos","Montos de hasta $35 MDP"],
  },
  {
    id: "tpv", icon: "💳", tag: "Sin SAT requerido", tagColor: "#4ade80",
    title: "Anticipo por TPV",
    subtitle: "Tu terminal de punto de venta como fuente de crédito",
    desc: "Si generas más de $150K/mes por terminal, tienes acceso a financiamiento inmediato sin facturar ante el SAT. El repago se descuenta automáticamente de tus ventas diarias.",
    features: ["Adelanto de hasta 2 meses de ventas","No requiere facturación SAT","Ingresos mínimos desde $150K/mes vía TPV","Repago del 10% al 25% de ventas diarias"],
  },
  {
    id: "puente", icon: "🏗️", tag: "Sector inmobiliario", tagColor: "#c4a15c",
    title: "Crédito Puente",
    subtitle: "El aliado de desarrolladores y constructoras",
    desc: "Las disposiciones se liberan conforme avanza tu obra — al inicio, al 20%, 50% y 80% de avance. Financia proyectos inmobiliarios sin comprometer tu flujo mientras construyes.",
    features: ["Montos de hasta $100 MDP","Disposiciones escalonadas según avance de obra","Ideal para desarrolladores y constructoras"],
  },
];

const gold = "#c4a15c";
const dark = "#090e1c";

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Section({ children, id, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <section id={id} ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease", ...style }}>
      {children}
    </section>
  );
}

function TagChip({ tag, color }) {
  const rgbMap = { "#4ade80":"74,222,128", "#c4a15c":"196,161,92", "#a78bfa":"167,139,250", "#f97316":"249,115,22" };
  const rgb = rgbMap[color] || "196,161,92";
  return <span style={{ display:"inline-block", padding:"2px 9px", background:`rgba(${rgb},0.12)`, color, border:`1px solid rgba(${rgb},0.3)`, borderRadius:"4px", fontFamily:"'Montserrat',sans-serif", fontSize:"9px", fontWeight:"600", letterSpacing:"0.05em" }}>{tag}</span>;
}

const lbl = { fontFamily:"'Montserrat',sans-serif", fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase", color:gold, display:"block", marginBottom:"6px" };
const inp = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(196,161,92,0.2)", borderRadius:"8px", color:"#e8dfc8", padding:"11px 14px", fontSize:"14px", width:"100%", fontFamily:"'Montserrat',sans-serif", transition:"border-color 0.2s" };

export default function FSMLanding() {
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState({ nombre:"", empresa:"", telefono:"", email:"", tipo:"", mensaje:"" });
  const [enviado, setEnviado] = useState(false);
  const [showFinBroker, setShowFinBroker] = useState(false);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };
  const setF = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background:dark, color:"#e8dfc8", fontFamily:"'Cormorant Garamond',Georgia,serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(196,161,92,0.4);border-radius:3px}
        select option{background:#0d1425;color:#e8dfc8}
        input::placeholder,textarea::placeholder{color:rgba(232,223,200,0.25)}
        input:focus,select:focus,textarea:focus{border-color:rgba(196,161,92,0.6)!important;outline:none;box-shadow:0 0 0 3px rgba(196,161,92,0.07)}
        .btn-g{background:linear-gradient(135deg,#c4a15c,#a8843e);color:#080d1a;border:none;padding:13px 28px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;border-radius:8px;cursor:pointer;transition:all 0.2s}
        .btn-g:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(196,161,92,0.3);opacity:.92}
        .btn-g:disabled{opacity:.35;cursor:not-allowed;transform:none}
        .btn-o{background:transparent;color:#c4a15c;border:1px solid rgba(196,161,92,0.45);padding:12px 26px;font-family:'Montserrat',sans-serif;font-weight:500;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;border-radius:8px;cursor:pointer;transition:all 0.2s}
        .btn-o:hover{background:rgba(196,161,92,0.08);transform:translateY(-1px)}
        .badge{display:inline-block;padding:5px 14px;background:rgba(196,161,92,0.1);border:1px solid rgba(196,161,92,0.25);border-radius:20px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#c4a15c;margin-bottom:20px}
        .sc{background:rgba(255,255,255,0.025);border:1px solid rgba(196,161,92,0.12);border-radius:16px;padding:26px;transition:all 0.25s;cursor:pointer}
        .sc:hover{transform:translateY(-3px);border-color:rgba(196,161,92,0.35);background:rgba(196,161,92,0.04)}
        .sc.on{border-color:rgba(196,161,92,0.5)!important;background:rgba(196,161,92,0.05)!important}
        .nl{font-family:'Montserrat',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,223,200,0.6);cursor:pointer;transition:color 0.2s}
        .nl:hover{color:#c4a15c}
        .lb{background:transparent;border:1px solid rgba(196,161,92,0.3);border-radius:6px;padding:5px 12px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;color:#c4a15c;cursor:pointer;transition:all 0.2s}
        .lb.on,.lb:hover{background:rgba(196,161,92,0.12)}
        .dv{height:1px;background:linear-gradient(to right,transparent,rgba(196,161,92,0.2),transparent)}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fi{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pg{0%,100%{box-shadow:0 0 0 0 rgba(196,161,92,0.3)}50%{box-shadow:0 0 0 12px rgba(196,161,92,0)}}
        .a1{animation:fi 0.9s ease forwards}
        .a2{animation:fi 0.9s ease 0.2s both}
        .a3{animation:fi 0.9s ease 0.4s both}
        .a4{animation:fi 0.9s ease 0.6s both}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
      `}</style>

      {/* FINBROKER MODAL */}
      {showFinBroker && (
        <div className="modal-overlay" onClick={() => setShowFinBroker(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#0d1425",border:"1px solid rgba(196,161,92,0.3)",borderRadius:"20px",padding:"40px",maxWidth:"520px",width:"100%",position:"relative" }}>
            <button onClick={() => setShowFinBroker(false)} style={{ position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"rgba(232,223,200,0.5)",cursor:"pointer",fontSize:"20px" }}>✕</button>
            <div style={{ textAlign:"center",marginBottom:"28px" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"28px",fontWeight:"400",color:gold,marginBottom:"4px" }}>FinBroker MX</div>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(232,223,200,0.4)" }}>Reporte de Diagnóstico PyME</div>
            </div>
            <div style={{ background:"rgba(196,161,92,0.08)",border:"1px solid rgba(196,161,92,0.2)",borderRadius:"12px",padding:"20px",marginBottom:"24px" }}>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.7)",lineHeight:1.7 }}>
                Completa el formulario de 6 pasos para recibir tu diagnóstico financiero institucional completo — con Score FSM, análisis de facturación, flujos bancarios, estados financieros y el argumento más sólido para presentarte ante una financiera.
              </div>
            </div>
            <div style={{ display:"grid",gap:"10px",marginBottom:"28px" }}>
              {["🧾 Análisis de 24 meses de facturación SAT","🏦 Revisión de 12 estados de cuenta bancarios","📊 Relaciones analíticas y capacidad de pago real","🎯 Argumento FSM para maximizar tu aprobación"].map((f,i) => (
                <div key={i} style={{ display:"flex",gap:"10px",alignItems:"center" }}>
                  <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.75)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderTop:"1px solid rgba(196,161,92,0.12)" }}>
              <div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"10px",color:"rgba(232,223,200,0.4)",textTransform:"uppercase",letterSpacing:"0.1em" }}>Precio</div>
                <div style={{ fontSize:"32px",fontWeight:"300",color:gold }}>$299 <span style={{ fontSize:"14px" }}>MXN</span></div>
              </div>
              <button className="btn-g" style={{ animation:"pg 3s ease infinite" }} onClick={() => { setShowFinBroker(false); window.sendPrompt && window.sendPrompt("Quiero generar mi reporte PyME en FinBroker MX"); }}>
                Iniciar Diagnóstico →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(9,14,28,0.93)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(196,161,92,0.1)",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:"8px" }} onClick={() => scrollTo("hero")}>
          <div style={{ width:"30px",height:"30px",background:"linear-gradient(135deg,#c4a15c,#a8843e)",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontWeight:"800",fontSize:"13px",color:"#080d1a" }}>F</div>
          <div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"12px",color:"#e8dfc8",lineHeight:1 }}>FSM Global Advisory</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"8px",color:gold,letterSpacing:"0.15em",textTransform:"uppercase" }}>Financial Structuring & Capital Solutions</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"28px" }}>
          <div style={{ display:"flex",gap:"22px" }}>
            {[["servicios","Servicios"],["reporte","Reporte PyME"],["brokers","Brokers"],["nosotros","Nosotros"],["contacto","Contacto"]].map(([k,l]) => (
              <span key={k} className="nl" onClick={() => scrollTo(k)}>{l}</span>
            ))}
          </div>
          <div style={{ display:"flex",gap:"6px" }}>
            <button className="lb on">ES</button>
            <button className="lb">EN</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div id="hero" style={{ minHeight:"100vh",paddingTop:"64px",display:"flex",alignItems:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 60% 40%,rgba(196,161,92,0.06) 0%,transparent 70%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:"15%",right:"8%",width:"400px",height:"400px",border:"1px solid rgba(196,161,92,0.06)",borderRadius:"50%",animation:"float 8s ease-in-out infinite",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:"25%",right:"12%",width:"260px",height:"260px",border:"1px solid rgba(196,161,92,0.08)",borderRadius:"50%",animation:"float 6s ease-in-out 1s infinite",pointerEvents:"none" }} />
        <div style={{ maxWidth:"1200px",margin:"0 auto",padding:"80px 32px",width:"100%" }}>
          <div style={{ maxWidth:"680px" }}>
            <div className="badge a1">Master Broker · México</div>
            <h1 className="a2" style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:"300",lineHeight:1.05,marginBottom:"24px" }}>
              Financiamiento empresarial<br /><em style={{ color:gold,fontStyle:"italic" }}>sin límites.</em>
            </h1>
            <p className="a3" style={{ fontSize:"17px",color:"rgba(232,223,200,0.6)",fontFamily:"'Montserrat',sans-serif",fontWeight:"300",lineHeight:1.8,maxWidth:"520px",marginBottom:"40px" }}>
              Conectamos PyMEs con las mejores opciones de crédito del mercado no bancario mexicano — con tecnología, experiencia y resultados comprobados.
            </p>
            <div className="a4" style={{ display:"flex",gap:"14px",flexWrap:"wrap",marginBottom:"72px" }}>
              <button className="btn-g" style={{ animation:"pg 3s ease infinite" }} onClick={() => setShowFinBroker(true)}>Generar Reporte PyME</button>
              <button className="btn-o" onClick={() => scrollTo("servicios")}>Conocer Servicios</button>
            </div>
            <div className="a4" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"rgba(196,161,92,0.1)",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(196,161,92,0.12)" }}>
              {[["+850M","MDP colocados"],["45","Alianzas financieras"],["6+","Años de experiencia"],["7","Productos financieros"]].map(([n,l],i) => (
                <div key={i} style={{ textAlign:"center",padding:"24px 16px",background:dark }}>
                  <div style={{ fontSize:"clamp(22px,3vw,32px)",fontWeight:"500",color:gold,marginBottom:"4px" }}>{n}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"10px",color:"rgba(232,223,200,0.45)",letterSpacing:"0.08em",textTransform:"uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dv" />

      {/* SERVICIOS */}
      <Section id="servicios" style={{ padding:"100px 32px" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"64px" }}>
            <div className="badge">Portafolio Financiero</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:"300",marginBottom:"20px",lineHeight:1.1 }}>Una solución para cada necesidad</h2>
            <p style={{ color:"rgba(232,223,200,0.55)",fontFamily:"'Montserrat',sans-serif",fontSize:"15px",fontWeight:"300",lineHeight:1.8,maxWidth:"640px",margin:"0 auto" }}>
              No existe una solución única para todas las empresas. Por eso contamos con 7 productos financieros distintos — para que siempre encuentres el que se adapta exactamente a tu situación. <strong style={{ color:gold }}>Haz clic en cualquier producto para ver sus características.</strong>
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"16px" }}>
            {SERVICES.slice(0,3).map(s => (
              <div key={s.id} className={`sc ${activeService===s.id?"on":""}`} onClick={() => setActiveService(activeService===s.id?null:s.id)}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px" }}>
                  <span style={{ fontSize:"28px" }}>{s.icon}</span>
                  <TagChip tag={s.tag} color={s.tagColor} />
                </div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"14px",marginBottom:"4px" }}>{s.title}</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:gold,marginBottom:"12px" }}>{s.subtitle}</div>
                <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.6)",lineHeight:1.7 }}>{s.desc}</p>
                {activeService===s.id && (
                  <div style={{ borderTop:"1px solid rgba(196,161,92,0.15)",paddingTop:"14px",marginTop:"14px" }}>
                    <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"10px",letterSpacing:"0.12em",textTransform:"uppercase",color:gold,marginBottom:"10px" }}>Características generales</div>
                    {s.features.map((f,i) => (
                      <div key={i} style={{ display:"flex",gap:"8px",marginBottom:"7px",alignItems:"flex-start" }}>
                        <div style={{ width:"5px",height:"5px",borderRadius:"50%",background:gold,flexShrink:0,marginTop:"6px" }} />
                        <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.8)",lineHeight:1.6 }}>{f}</span>
                      </div>
                    ))}
                    <button className="btn-g" style={{ marginTop:"16px",width:"100%",padding:"11px",fontSize:"11px" }} onClick={e => { e.stopPropagation(); scrollTo("contacto"); }}>Solicitar información</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px" }}>
            {SERVICES.slice(3).map(s => (
              <div key={s.id} className={`sc ${activeService===s.id?"on":""}`} onClick={() => setActiveService(activeService===s.id?null:s.id)}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px" }}>
                  <span style={{ fontSize:"24px" }}>{s.icon}</span>
                  <TagChip tag={s.tag} color={s.tagColor} />
                </div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"13px",marginBottom:"4px" }}>{s.title}</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:gold,marginBottom:"10px" }}>{s.subtitle}</div>
                <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.6)",lineHeight:1.7 }}>{s.desc}</p>
                {activeService===s.id && (
                  <div style={{ borderTop:"1px solid rgba(196,161,92,0.15)",paddingTop:"12px",marginTop:"12px" }}>
                    {s.features.map((f,i) => (
                      <div key={i} style={{ display:"flex",gap:"8px",marginBottom:"6px",alignItems:"flex-start" }}>
                        <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:gold,flexShrink:0,marginTop:"6px" }} />
                        <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.8)",lineHeight:1.6 }}>{f}</span>
                      </div>
                    ))}
                    <button className="btn-g" style={{ marginTop:"14px",width:"100%",padding:"10px",fontSize:"11px" }} onClick={e => { e.stopPropagation(); scrollTo("contacto"); }}>Solicitar información</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="dv" />

      {/* REPORTE */}
      <Section id="reporte" style={{ padding:"100px 32px",background:"rgba(196,161,92,0.02)" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"64px" }}>
            <div className="badge">Producto Estrella · FinBroker MX</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:"300",marginBottom:"20px",lineHeight:1.1 }}>Diagnóstico Financiero Institucional</h2>
            <p style={{ color:"rgba(232,223,200,0.55)",fontFamily:"'Montserrat',sans-serif",fontSize:"15px",fontWeight:"300",lineHeight:1.8,maxWidth:"640px",margin:"0 auto" }}>
              Antes de buscar financiamiento, necesitas saber exactamente cómo te ve una institución financiera. Nuestro reporte te da ese mapa completo — con números reales, análisis profundo y el argumento más sólido para presentarte ante cualquier financiera del portafolio FSM.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"48px" }}>
            {[
              {icon:"🧾",t:"Facturación SAT",d:"24 meses de análisis continuo, tendencias y riesgo de concentración en clientes"},
              {icon:"🏦",t:"Flujos Bancarios",d:"12 estados de cuenta para determinar tu ingreso real depurado vs. el declarado"},
              {icon:"📊",t:"Relaciones Analíticas",d:"Razones de liquidez, endeudamiento y capacidad de pago real con tus números"},
              {icon:"📋",t:"Historial Crediticio",d:"Análisis de Buró de Crédito y comportamiento financiero histórico"},
              {icon:"🔒",t:"Garantías",d:"Evaluación de colateral disponible y cobertura vs. monto solicitado"},
              {icon:"🎯",t:"Argumento FSM",d:"El punto más sólido de tu perfil para maximizar las probabilidades de aprobación"},
            ].map((d,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.025)",border:"1px solid rgba(196,161,92,0.12)",borderRadius:"14px",padding:"24px" }}>
                <div style={{ fontSize:"26px",marginBottom:"10px" }}>{d.icon}</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"13px",marginBottom:"6px" }}>{d.t}</div>
                <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.5)",lineHeight:1.7 }}>{d.d}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(196,161,92,0.2)",borderRadius:"20px",padding:"52px" }}>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.4)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"8px" }}>desde</div>
            <div style={{ fontSize:"clamp(48px,6vw,72px)",fontWeight:"300",color:gold,lineHeight:1,marginBottom:"8px" }}>$299 MXN</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.4)",marginBottom:"36px" }}>por reporte · resultado en minutos</div>
            <button className="btn-g" style={{ fontSize:"13px",padding:"16px 52px",animation:"pg 3s ease infinite" }} onClick={() => setShowFinBroker(true)}>
              Generar mi Reporte ahora →
            </button>
            <div style={{ marginTop:"16px",fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.3)" }}>
              Powered by FinBroker MX · Análisis con Inteligencia Artificial
            </div>
          </div>
        </div>
      </Section>

      <div className="dv" />

      {/* BROKERS */}
      <Section id="brokers" style={{ padding:"100px 32px" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"64px" }}>
            <div className="badge">Programa de Afiliación</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:"300",marginBottom:"20px",lineHeight:1.1 }}>Crece con FSM Global Advisory</h2>
            <p style={{ color:"rgba(232,223,200,0.55)",fontFamily:"'Montserrat',sans-serif",fontSize:"15px",fontWeight:"300",lineHeight:1.8,maxWidth:"580px",margin:"0 auto" }}>
              Únete a nuestra red de brokers y accede a las herramientas, capacitación y comisiones que necesitas para llevar tu cartera al siguiente nivel.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 2fr",gap:"48px",marginBottom:"64px" }}>
            <div style={{ background:"linear-gradient(135deg,rgba(196,161,92,0.08),rgba(196,161,92,0.03))",border:"1px solid rgba(196,161,92,0.25)",borderRadius:"20px",padding:"40px 32px",textAlign:"center",position:"sticky",top:"84px",alignSelf:"start" }}>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.4)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"12px" }}>Membresía</div>
              <div style={{ fontSize:"52px",fontWeight:"300",color:gold,lineHeight:1 }}>$300</div>
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.5)",marginBottom:"24px" }}>MXN / mes</div>
              <div style={{ height:"1px",background:"rgba(196,161,92,0.15)",marginBottom:"24px" }} />
              <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.6)",lineHeight:1.7,marginBottom:"32px" }}>Todo lo que necesitas para operar profesionalmente</div>
              <button className="btn-g" style={{ width:"100%" }} onClick={() => scrollTo("contacto")}>Quiero afiliarme</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px" }}>
              {[
                {icon:"📊",t:"5 Reportes FSM al mes",d:"Diagnostica a tus clientes con análisis institucional real antes de presentarlos"},
                {icon:"💰",t:"Comisiones preferenciales",d:"Porcentajes superiores al estándar del mercado para brokers afiliados"},
                {icon:"📚",t:"Biblioteca de capacitaciones",d:"Videos y materiales actualizados por financiera — productos, requisitos y cambios"},
                {icon:"📋",t:"Checklists y formatos",d:"Toda la documentación necesaria por producto y financiera en un solo lugar"},
                {icon:"📈",t:"Tabulador de comisiones",d:"Consulta en tiempo real las comisiones por producto, plazo y financiera"},
                {icon:"🚀",t:"Plataforma FinBroker MX",d:"Sube clientes, da seguimiento y gestiona tu cartera desde un solo lugar"},
              ].map((b,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.025)",border:"1px solid rgba(196,161,92,0.1)",borderRadius:"14px",padding:"22px" }}>
                  <div style={{ fontSize:"22px",marginBottom:"10px" }}>{b.icon}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"12px",marginBottom:"6px" }}>{b.t}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.5)",lineHeight:1.7 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:gold,marginBottom:"32px",textAlign:"center" }}>¿Cómo funciona?</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",position:"relative" }}>
              <div style={{ position:"absolute",top:"28px",left:"12.5%",right:"12.5%",height:"1px",background:"linear-gradient(to right,transparent,rgba(196,161,92,0.2),rgba(196,161,92,0.2),transparent)",zIndex:0 }} />
              {[["01","Regístrate","Activa tu membresía por $300/mes y accede a toda la plataforma"],["02","Capacítate","Conoce el portafolio completo de FSM y las financieras aliadas"],["03","Sube clientes","Captura y califica a tus prospectos con FinBroker MX"],["04","Cobra comisiones","FSM gestiona la colocación — tú recibes tu comisión al cierre"]].map(([n,t,d],i) => (
                <div key={i} style={{ textAlign:"center",position:"relative",zIndex:1 }}>
                  <div style={{ width:"56px",height:"56px",borderRadius:"50%",background:dark,border:"1px solid rgba(196,161,92,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontFamily:"'Montserrat',sans-serif",fontWeight:"700",fontSize:"14px",color:gold }}>{n}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"13px",marginBottom:"6px" }}>{t}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.5)",lineHeight:1.6 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="dv" />

      {/* NOSOTROS */}
      <Section id="nosotros" style={{ padding:"100px 32px",background:"rgba(196,161,92,0.02)" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center",marginBottom:"80px" }}>
            <div>
              <div className="badge">Nuestra Historia</div>
              <h2 style={{ fontSize:"clamp(36px,5vw,58px)",fontWeight:"300",lineHeight:1.1,marginBottom:"28px" }}>
                <em style={{ color:gold,fontStyle:"italic" }}>Beyond the Limits</em>
              </h2>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"14px",color:"rgba(232,223,200,0.7)",lineHeight:1.9,marginBottom:"16px" }}>
                Con más de 6 años en el sector financiero no bancario mexicano, hemos construido una red de 45 alianzas directas con las principales financieras, fondos de deuda y fintechs del país.
              </p>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"14px",color:"rgba(232,223,200,0.7)",lineHeight:1.9 }}>
                No somos un intermediario más. Somos el puente estratégico entre la realidad financiera de las PyMEs mexicanas y las oportunidades reales que el mercado alternativo tiene para ofrecerles.
              </p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px" }}>
              {[["+850M","MDP colocados"],["45","Alianzas directas"],["6+","Años de experiencia"],["7","Productos financieros"]].map(([n,l],i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.025)",border:"1px solid rgba(196,161,92,0.12)",borderRadius:"16px",padding:"32px 24px",textAlign:"center" }}>
                  <div style={{ fontSize:"clamp(28px,3.5vw,44px)",fontWeight:"400",color:gold,marginBottom:"6px" }}>{n}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.5)",letterSpacing:"0.06em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:gold,marginBottom:"24px",textAlign:"center" }}>Nuestros Pilares</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px" }}>
              {[
                {icon:"⚡",t:"Tecnología",d:"FinBroker MX — nuestra plataforma propia de análisis crediticio y gestión de expedientes"},
                {icon:"🤝",t:"Transparencia",d:"Sin letras chicas. Comisiones claras, procesos documentados y resultados medibles"},
                {icon:"🎯",t:"Especialización",d:"100% PyMEs. 100% no bancario. Conocemos cada producto y cada financiera del portafolio"},
              ].map((v,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.025)",border:"1px solid rgba(196,161,92,0.12)",borderRadius:"16px",padding:"32px 28px" }}>
                  <div style={{ fontSize:"26px",marginBottom:"12px" }}>{v.icon}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:"600",fontSize:"14px",marginBottom:"10px" }}>{v.t}</div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"12px",color:"rgba(232,223,200,0.55)",lineHeight:1.7 }}>{v.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="dv" />

      {/* CONTACTO */}
      <Section id="contacto" style={{ padding:"100px 32px" }}>
        <div style={{ maxWidth:"860px",margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:"56px" }}>
            <div className="badge">Hablemos</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:"300",marginBottom:"16px",lineHeight:1.1 }}>¿Listo para el siguiente nivel?</h2>
            <p style={{ color:"rgba(232,223,200,0.55)",fontFamily:"'Montserrat',sans-serif",fontSize:"15px",fontWeight:"300",lineHeight:1.8 }}>
              Ya sea que busques financiamiento, quieras tu reporte de diagnóstico o quieras crecer como broker — estamos aquí para acompañarte.
            </p>
          </div>
          {!enviado ? (
            <div style={{ background:"rgba(255,255,255,0.025)",border:"1px solid rgba(196,161,92,0.15)",borderRadius:"24px",padding:"48px" }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px" }}>
                {[["nombre","Nombre completo"],["empresa","Empresa"],["telefono","Teléfono"],["email","Correo electrónico"]].map(([k,l]) => (
                  <div key={k}><label style={lbl}>{l}</label><input style={inp} value={formData[k]} onChange={e => setF(k,e.target.value)} /></div>
                ))}
              </div>
              <div style={{ marginBottom:"16px" }}>
                <label style={lbl}>Soy...</label>
                <select style={inp} value={formData.tipo} onChange={e => setF("tipo",e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="pyme">PyME — Busco financiamiento</option>
                  <option value="broker">Broker — Quiero afiliarme</option>
                  <option value="financiera">Financiera — Busco alianza</option>
                </select>
              </div>
              <div style={{ marginBottom:"32px" }}>
                <label style={lbl}>¿En qué podemos ayudarte?</label>
                <textarea style={{ ...inp,resize:"vertical",minHeight:"90px" }} value={formData.mensaje} onChange={e => setF("mensaje",e.target.value)} />
              </div>
              <div style={{ textAlign:"center" }}>
                <button className="btn-g" disabled={!formData.nombre||!formData.email||!formData.tipo} onClick={() => setEnviado(true)} style={{ padding:"15px 48px" }}>
                  Enviar mensaje
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center",padding:"60px",background:"rgba(74,222,128,0.05)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:"24px" }}>
              <div style={{ fontSize:"48px",marginBottom:"20px" }}>✅</div>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"16px",color:"#4ade80",fontWeight:"500" }}>¡Mensaje recibido! Te contactamos en menos de 24 horas.</p>
            </div>
          )}
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(196,161,92,0.1)",padding:"48px 32px",background:"rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"24px" }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"18px",fontWeight:"500",color:gold,marginBottom:"4px" }}>FSM Global Advisory</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"10px",color:"rgba(232,223,200,0.35)",letterSpacing:"0.15em",textTransform:"uppercase" }}>Financial Structuring & Capital Solutions</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:"36px",height:"36px",background:"linear-gradient(135deg,#c4a15c,#a8843e)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontWeight:"800",fontSize:"15px",color:"#080d1a",margin:"0 auto 6px" }}>F</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"9px",color:"rgba(232,223,200,0.2)",letterSpacing:"0.12em",textTransform:"uppercase" }}>Powered by FinBroker MX Technology</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"11px",color:"rgba(232,223,200,0.3)" }}>© 2025 FSM Global Advisory. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
