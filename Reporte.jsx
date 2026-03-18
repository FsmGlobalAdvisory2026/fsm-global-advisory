import { useState } from "react";

const STEPS = [
  { id: 1, title: "Datos Generales", icon: "🏢" },
  { id: 2, title: "Facturación SAT", icon: "🧾" },
  { id: 3, title: "Flujos Bancarios", icon: "🏦" },
  { id: 4, title: "Estados Financieros", icon: "📊" },
  { id: 5, title: "Historial Crediticio", icon: "📋" },
  { id: 6, title: "Garantías", icon: "🔒" },
];

const SECTORES = [
  "Comercio al por mayor", "Comercio al por menor", "Manufactura", "Construcción",
  "Transporte y logística", "Servicios profesionales", "Tecnología", "Alimentos y bebidas",
  "Agropecuario", "Salud", "Educación", "Turismo y hospitalidad", "Otro"
];

const REGIMENES = [
  "Régimen General de Ley (Persona Moral)",
  "Régimen Simplificado de Confianza (RESICO PM)",
  "Régimen de Actividades Empresariales (Persona Física)",
  "RESICO Persona Física",
  "Régimen de Incorporación Fiscal (RIF)",
  "Otro"
];

export default function FSMReporte() {
  const [step, setStep] = useState(0); // 0=intro, 1-6=form, 7=analyzing, 8=report
  const [form, setForm] = useState({
    // Datos Generales
    razonSocial: "", sector: "", regimen: "", aniosOperacion: "", empleados: "",
    estadoRepublica: "", rfcEmpresa: "",
    // Facturación SAT
    facturacionPromedio24: "", facturacionMin: "", facturacionMax: "",
    mesesSinFacturar: "", dependenciaGobierno: "", clientePrincipalPct: "",
    proveedorPrincipalPct: "", clientesPrincipales: "", proveedoresPrincipales: "",
    tendenciaFacturacion: "",
    // Flujos Bancarios
    numeroCuentas: "", promedioMensualBancario: "", ingresoRealEstimado: "",
    traspasosIdentificados: "", ciclicidadIngresos: "", autenticidadEdos: "",
    bancoPrincipal: "",
    // Estados Financieros
    totalActivos: "", totalPasivos: "", activoCirculante: "", pasivoCortoplazo: "",
    pasivolargoplazo: "", capitalContable: "", utilidadNeta: "", perdidaFiscal: "",
    ventasAnuales: "", capacidadPagoEstimada: "",
    // Historial Crediticio
    tieneHistorial: "", nivelBuro: "", creditosActivos: "", montoCreditosActivos: "",
    diasMoraMax: "", creditosLiquidados: "",
    // Garantías
    tieneInmueble: "", valorInmueble: "", tieneEquipo: "", valorEquipo: "",
    tieneAval: "", otrasGarantias: "",
    // Solicitud
    montoSolicitado: "", destinoCredito: "", plazoDeseado: "",
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildPrompt = (f) => `Eres un analista de crédito senior especializado en PyMEs mexicanas con 15 años de experiencia en instituciones financieras como NAFIN, Banorte y fondos de deuda privada.
Analiza el siguiente perfil empresarial y genera un reporte financiero institucional completo en formato JSON.
Sé específico, profesional y usa los datos reales proporcionados en tu análisis. No uses placeholders genéricos.

DATOS DE LA EMPRESA:
- Razón Social: ${f.razonSocial}
- RFC: ${f.rfcEmpresa}
- Sector: ${f.sector}
- Régimen Fiscal: ${f.regimen}
- Estado: ${f.estadoRepublica}
- Años de operación: ${f.aniosOperacion}
- Empleados: ${f.empleados}
- Facturación promedio mensual SAT: $${Number(f.facturacionPromedio24).toLocaleString()} MXN
- Facturación anual total: $${Number(f.ventasAnuales).toLocaleString()} MXN
- Facturación mínima mensual: $${Number(f.facturacionMin).toLocaleString()} MXN
- Facturación máxima mensual: $${Number(f.facturacionMax).toLocaleString()} MXN
- Meses sin facturar (últimos 24): ${f.mesesSinFacturar}
- Tendencia de facturación: ${f.tendenciaFacturacion}
- % ingresos de gobierno: ${f.dependenciaGobierno}%
- % cliente principal: ${f.clientePrincipalPct}%
- Clientes principales: ${f.clientesPrincipales}
- % proveedor principal: ${f.proveedorPrincipalPct}%
- Proveedores principales: ${f.proveedoresPrincipales}
- Banco principal: ${f.bancoPrincipal}
- Número de cuentas bancarias: ${f.numeroCuentas}
- Promedio mensual bancario total: $${Number(f.promedioMensualBancario).toLocaleString()} MXN
- Ingreso real estimado (sin traspasos): $${Number(f.ingresoRealEstimado).toLocaleString()} MXN
- Traspasos entre cuentas propias: ${f.traspasosIdentificados}
- Ciclicidad de ingresos: ${f.ciclicidadIngresos}
- Autenticidad de estados de cuenta: ${f.autenticidadEdos}
- Total Activos: $${Number(f.totalActivos).toLocaleString()} MXN
- Total Pasivos: $${Number(f.totalPasivos).toLocaleString()} MXN
- Activo Circulante: $${Number(f.activoCirculante).toLocaleString()} MXN
- Capital Contable: $${Number(f.capitalContable).toLocaleString()} MXN
- Pasivo Corto Plazo: $${Number(f.pasivoCortoplazo).toLocaleString()} MXN
- Pasivo Largo Plazo: $${Number(f.pasivolargoplazo).toLocaleString()} MXN
- Utilidad Neta Anual: $${Number(f.utilidadNeta).toLocaleString()} MXN
- Pérdida Fiscal: $${Number(f.perdidaFiscal || 0).toLocaleString()} MXN
- Capacidad de pago mensual estimada: $${Number(f.capacidadPagoEstimada).toLocaleString()} MXN
- Historial crediticio: ${f.tieneHistorial}
- Score Buró: ${f.nivelBuro}
- Créditos activos: ${f.creditosActivos} por $${Number(f.montoCreditosActivos).toLocaleString()} MXN
- Días de mora máximos: ${f.diasMoraMax}
- Créditos liquidados: ${f.creditosLiquidados}
- Inmueble como garantía: ${f.tieneInmueble} — Valor: $${Number(f.valorInmueble || 0).toLocaleString()} MXN
- Equipo/Maquinaria: ${f.tieneEquipo} — Valor: $${Number(f.valorEquipo || 0).toLocaleString()} MXN
- Aval: ${f.tieneAval}
- Otras garantías: ${f.otrasGarantias}
- Monto solicitado: $${Number(f.montoSolicitado).toLocaleString()} MXN
- Destino del crédito: ${f.destinoCredito}
- Plazo deseado: ${f.plazoDeseado} meses

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta, sin texto adicional ni markdown:
{
  "resumenEjecutivo": "2-3 párrafos de resumen ejecutivo profesional con datos específicos de la empresa",
  "seccion1": {
    "titulo": "Perfil Empresarial",
    "hallazgos": ["hallazgo específico 1", "hallazgo específico 2", "hallazgo específico 3"],
    "semaforo": "verde",
    "comentario": "comentario analítico específico"
  },
  "seccion2": {
    "titulo": "Análisis de Facturación SAT — 24 meses",
    "hallazgos": ["hallazgo 1", "hallazgo 2", "hallazgo 3"],
    "semaforo": "verde",
    "dependenciaRiesgo": "análisis de riesgo de concentración específico",
    "analisisClientes": "análisis de solidez de los clientes mencionados",
    "analisisProveedores": "análisis de riesgo de los proveedores mencionados",
    "comentario": "comentario analítico"
  },
  "seccion3": {
    "titulo": "Análisis de Flujos Bancarios — 12 meses",
    "hallazgos": ["hallazgo 1", "hallazgo 2", "hallazgo 3"],
    "semaforo": "verde",
    "ingresoRealVsDeclarado": "análisis de brecha con los números reales",
    "ciclicidad": "análisis de ciclicidad con los datos",
    "alertas": ["alerta si existe"],
    "comentario": "comentario analítico"
  },
  "seccion4": {
    "titulo": "Estados Financieros — Relaciones Analíticas",
    "hallazgos": ["hallazgo 1", "hallazgo 2", "hallazgo 3"],
    "semaforo": "verde",
    "razonLiquidez": "cálculo real y análisis",
    "razonEndeudamiento": "cálculo real y análisis",
    "perdidaFiscalImpacto": "impacto real en el perfil",
    "capacidadPagoReal": "análisis detallado con los números",
    "comentario": "comentario analítico"
  },
  "seccion5": {
    "titulo": "Historial Crediticio",
    "hallazgos": ["hallazgo 1", "hallazgo 2"],
    "semaforo": "verde",
    "comentario": "comentario analítico"
  },
  "seccion6": {
    "titulo": "Garantías y Colateral",
    "hallazgos": ["hallazgo 1", "hallazgo 2"],
    "semaforo": "verde",
    "cobertura": "análisis de cobertura vs monto solicitado con números reales",
    "comentario": "comentario analítico"
  },
  "scoreFSM": {
    "puntaje": 75,
    "nivel": "Medio-Alto",
    "semaforo": "verde",
    "desglose": {
      "facturacion": 80,
      "flujos": 70,
      "estadosFinancieros": 65,
      "historialCrediticio": 85,
      "garantias": 75
    }
  },
  "argumentoAFavor": "Mínimo 3 párrafos. Este es el argumento más importante del reporte. Debe ser convincente, usar los datos reales del cliente, y explicar por qué ESTA empresa específica ES sujeto de crédito. Debe ayudar al broker a presentar el caso ante la financiera de forma sólida.",
  "productosRecomendados": [
    {"producto": "nombre específico", "institucion": "tipo de institución financiera", "razon": "razón específica basada en el perfil", "montoSugerido": "rango basado en capacidad de pago"},
    {"producto": "nombre específico", "institucion": "tipo de institución", "razon": "razón específica", "montoSugerido": "rango sugerido"}
  ],
  "recomendaciones": [
    {"prioridad": "alta", "accion": "acción concreta y específica", "impacto": "impacto esperado en el perfil crediticio"},
    {"prioridad": "media", "accion": "acción concreta", "impacto": "impacto esperado"},
    {"prioridad": "baja", "accion": "acción concreta", "impacto": "impacto esperado"}
  ],
  "conclusionBroker": "Nota confidencial para el broker con la estrategia de colocación recomendada, qué financieras priorizar y cómo presentar el caso."
}`;

  const generateReport = () => {
    const f = form;
    const activos = Number(f.totalActivos) || 0;
    const pasivos = Number(f.totalPasivos) || 0;
    const circulante = Number(f.activoCirculante) || 0;
    const pasivoCP = Number(f.pasivoCortoplazo) || 0;
    const capital = Number(f.capitalContable) || 0;
    const utilidad = Number(f.utilidadNeta) || 0;
    const facturacion = Number(f.facturacionPromedio24) || 0;
    const ingresoReal = Number(f.ingresoRealEstimado) || 0;
    const promBancario = Number(f.promedioMensualBancario) || 0;
    const capacidadPago = Number(f.capacidadPagoEstimada) || 0;
    const monto = Number(f.montoSolicitado) || 0;
    const valorInmueble = Number(f.valorInmueble) || 0;
    const razonLiquidez = pasivoCP > 0 ? (circulante / pasivoCP).toFixed(2) : "N/A";
    const razonEndeudamiento = activos > 0 ? ((pasivos / activos) * 100).toFixed(1) : "N/A";
    const brechaIngreso = promBancario > 0 ? (((promBancario - ingresoReal) / promBancario) * 100).toFixed(1) : "0";
    const cobertura = monto > 0 && valorInmueble > 0 ? ((valorInmueble / monto) * 100).toFixed(0) : "Sin inmueble";
    const scoreBase = Math.min(95, Math.max(30,
      (f.tieneHistorial?.includes("positivo") ? 20 : f.tieneHistorial?.includes("sin_historial") ? 10 : 5) +
      (f.tendenciaFacturacion === "creciente" ? 20 : f.tendenciaFacturacion === "estable" ? 15 : 8) +
      (f.autenticidadEdos?.includes("originales") || f.autenticidadEdos?.includes("cfdi") ? 15 : 5) +
      (f.tieneInmueble?.includes("libre") ? 15 : f.tieneInmueble?.includes("hipotecado") ? 8 : 3) +
      (f.diasMoraMax === "0" ? 15 : 5) +
      (Number(f.aniosOperacion) >= 3 ? 10 : 5)
    ));
    const result = {
      resumenEjecutivo: f.razonSocial + " es una empresa del sector " + f.sector + " con " + f.aniosOperacion + " años de operación en " + (f.estadoRepublica || "México") + ", bajo el " + f.regimen + ". Con una facturación promedio mensual de $" + facturacion.toLocaleString() + " MXN y un ingreso real bancario depurado de $" + ingresoReal.toLocaleString() + " MXN mensuales, la empresa presenta un perfil " + (scoreBase >= 70 ? "sólido y con viabilidad crediticia favorable" : scoreBase >= 50 ? "con viabilidad moderada que requiere análisis detallado" : "que requiere fortalecimiento antes de la solicitud formal") + ".\n\nDesde una perspectiva institucional, el análisis de sus 24 meses de facturación SAT, combinado con la revisión de flujos bancarios y estados financieros, permite construir un argumento de colocación " + (scoreBase >= 60 ? "robusto" : "estructurado") + " ante las financieras aliadas de Financial Success Mexico. La razón de endeudamiento del " + razonEndeudamiento + "% y una capacidad de pago mensual estimada de $" + capacidadPago.toLocaleString() + " MXN son los indicadores clave para determinar el producto y monto óptimo.\n\nEste reporte ha sido elaborado bajo los estándares de análisis de Financial Success Mexico, con el objetivo de identificar el mejor ángulo de colocación para este cliente y maximizar las probabilidades de aprobación con las condiciones más favorables disponibles en el mercado no bancario.",
      seccion1: {
        titulo: "Perfil Empresarial",
        hallazgos: [
          "Empresa con " + f.aniosOperacion + " años de operación — " + (Number(f.aniosOperacion) >= 3 ? "antigüedad suficiente para la mayoría de financieras del mercado no bancario" : "antigüedad en proceso de consolidación, viable para productos de capital de trabajo a corto plazo"),
          "Régimen fiscal: " + f.regimen + " — " + (f.regimen?.includes("General") ? "perfil fiscal robusto con mayor acceso a productos institucionales" : "régimen compatible con la mayoría de financieras no bancarias"),
          "Sector " + f.sector + " — " + (["Manufactura","Construcción","Alimentos y bebidas"].includes(f.sector) ? "sector con alta demanda de financiamiento productivo y buena recepción por fondos de deuda" : "sector activo con acceso a diversas líneas de crédito en el mercado alternativo")
        ],
        semaforo: Number(f.aniosOperacion) >= 3 ? "verde" : "amarillo",
        comentario: "La empresa cuenta con los elementos básicos de elegibilidad. Con " + (f.empleados || "N/D") + " empleados y operaciones en " + (f.estadoRepublica || "México") + ", presenta un tamaño compatible con los parámetros de las financieras no bancarias en el portafolio FSM."
      },
      seccion2: {
        titulo: "Análisis de Facturación SAT — 24 meses",
        hallazgos: [
          "Facturación promedio mensual de $" + facturacion.toLocaleString() + " MXN — tendencia " + (f.tendenciaFacturacion || "por determinar") + " en los últimos 24 meses",
          Number(f.mesesSinFacturar) > 0 ? "Se detectaron " + f.mesesSinFacturar + " meses sin facturación en el período analizado — requiere justificación ante la financiera" : "Facturación continua sin interrupciones — punto positivo para la evaluación institucional",
          Number(f.dependenciaGobierno) > 30 ? f.dependenciaGobierno + "% dependencia de gobierno — riesgo de concentración moderado-alto" : Number(f.clientePrincipalPct) > 40 ? "Cliente principal representa el " + f.clientePrincipalPct + "% — concentración elevada a documentar" : "Diversificación de ingresos aceptable para el perfil solicitado"
        ],
        semaforo: f.tendenciaFacturacion === "creciente" || f.tendenciaFacturacion === "estable" ? "verde" : "amarillo",
        dependenciaRiesgo: Number(f.dependenciaGobierno) > 50 ? "Dependencia de gobierno del " + f.dependenciaGobierno + "% representa un riesgo de concentración significativo. Se recomienda documentar contratos vigentes y órdenes de compra para mitigar la percepción de riesgo ante la financiera." : "El nivel de dependencia de gobierno (" + (f.dependenciaGobierno || 0) + "%) y concentración en cliente principal (" + (f.clientePrincipalPct || 0) + "%) se encuentra dentro de parámetros manejables para el mercado no bancario.",
        analisisClientes: f.clientesPrincipales ? "Clientes identificados: " + f.clientesPrincipales + ". Se recomienda solicitar referencias comerciales para fortalecer el expediente." : "Se recomienda documentar la cartera de clientes con contratos y facturas de los últimos 6 meses.",
        analisisProveedores: f.proveedoresPrincipales ? "Proveedores identificados: " + f.proveedoresPrincipales + ". Concentración en proveedor principal del " + (f.proveedorPrincipalPct || "N/D") + "% — evaluar riesgo de cadena de suministro." : "Perfil de proveedores pendiente de documentación para análisis completo.",
        comentario: "La facturación SAT presenta un comportamiento " + (f.tendenciaFacturacion || "estable") + " con un promedio mensual de $" + facturacion.toLocaleString() + " MXN. Este indicador es el principal argumento de ingresos ante cualquier financiera no bancaria."
      },
      seccion3: {
        titulo: "Análisis de Flujos Bancarios — 12 meses",
        hallazgos: [
          "Promedio mensual bancario bruto: $" + promBancario.toLocaleString() + " MXN — Ingreso real depurado: $" + ingresoReal.toLocaleString() + " MXN",
          "Brecha entre ingreso bancario y real: " + brechaIngreso + "% — " + (Number(brechaIngreso) > 25 ? "nivel de traspasos elevado que requiere documentación clara" : "nivel de traspasos dentro de parámetros normales"),
          "Ciclicidad de ingresos: " + (f.ciclicidadIngresos || "por determinar") + " — " + (f.ciclicidadIngresos === "constante" ? "perfil ideal para financieras con análisis de flujo mensual" : "se recomienda documentar estacionalidad para justificar variaciones")
        ],
        semaforo: f.autenticidadEdos?.includes("dudosa") ? "rojo" : Number(brechaIngreso) > 30 ? "amarillo" : "verde",
        ingresoRealVsDeclarado: "El ingreso real depurado de $" + ingresoReal.toLocaleString() + " MXN representa el " + (promBancario > 0 ? ((ingresoReal/promBancario)*100).toFixed(0) : "N/A") + "% del flujo bancario total. Esta depuración es fundamental para presentar un ingreso real sólido ante la financiera.",
        ciclicidad: "El patrón de ingresos " + (f.ciclicidadIngresos || "identificado") + " sugiere " + (f.ciclicidadIngresos === "estacional" ? "planificar el crédito considerando los meses de mayor liquidez para cubrir el servicio de la deuda" : f.ciclicidadIngresos === "constante" ? "una empresa con flujos predecibles — perfil favorito para financieras de corto y mediano plazo" : "documentar los factores que explican la variabilidad de ingresos") + ".",
        alertas: f.autenticidadEdos?.includes("dudosa") ? ["⚠️ Se detectaron inconsistencias en estados de cuenta — requiere verificación antes de presentar expediente"] : [],
        comentario: "Con un ingreso real mensual de $" + ingresoReal.toLocaleString() + " MXN y capacidad de pago de $" + capacidadPago.toLocaleString() + " MXN, la empresa puede soportar un servicio de deuda de hasta $" + Math.round(capacidadPago * 0.35).toLocaleString() + " MXN mensuales bajo parámetros conservadores."
      },
      seccion4: {
        titulo: "Estados Financieros — Relaciones Analíticas",
        hallazgos: [
          "Razón de liquidez: " + razonLiquidez + "x — " + (Number(razonLiquidez) >= 1.5 ? "liquidez sólida, empresa puede cubrir sus obligaciones de corto plazo con holgura" : Number(razonLiquidez) >= 1 ? "liquidez ajustada pero positiva" : "liquidez por debajo de 1x — punto a trabajar en el expediente"),
          "Razón de endeudamiento: " + razonEndeudamiento + "% — " + (Number(razonEndeudamiento) < 50 ? "nivel de apalancamiento conservador y favorable" : Number(razonEndeudamiento) < 70 ? "nivel moderado, dentro de parámetros del mercado no bancario" : "endeudamiento elevado — requiere análisis de flujo de caja para compensar"),
          "Capital contable de $" + capital.toLocaleString() + " MXN con utilidad neta de $" + utilidad.toLocaleString() + " MXN — " + (utilidad > 0 ? "empresa rentable con generación positiva de valor" : "empresa con resultado negativo — documentar causa y perspectiva de recuperación")
        ],
        semaforo: Number(razonEndeudamiento) < 60 && utilidad >= 0 ? "verde" : Number(razonEndeudamiento) < 75 ? "amarillo" : "rojo",
        razonLiquidez: "Razón de liquidez: " + razonLiquidez + "x (Activo Circulante $" + circulante.toLocaleString() + " / Pasivo C.P. $" + pasivoCP.toLocaleString() + "). " + (Number(razonLiquidez) >= 1.5 ? "Excelente indicador de solvencia a corto plazo." : Number(razonLiquidez) >= 1 ? "Liquidez positiva pero ajustada." : "Requiere refuerzo — considerar garantía adicional."),
        razonEndeudamiento: "Razón de endeudamiento: " + razonEndeudamiento + "% (Pasivos $" + pasivos.toLocaleString() + " / Activos $" + activos.toLocaleString() + "). " + (Number(razonEndeudamiento) < 50 ? "Apalancamiento conservador — empresa con amplio margen para nueva deuda." : "Nivel de apalancamiento que deberá ser justificado con el flujo de caja real."),
        perdidaFiscalImpacto: Number(f.perdidaFiscal) > 0 ? "Pérdida fiscal de $" + Number(f.perdidaFiscal).toLocaleString() + " MXN. Se recomienda preparar una explicación documentada de su origen para neutralizar su impacto en el análisis institucional." : "Sin pérdida fiscal registrada — perfil fiscal limpio y favorable para la evaluación institucional.",
        capacidadPagoReal: "Con un ingreso real de $" + ingresoReal.toLocaleString() + " MXN mensuales y capacidad de pago de $" + capacidadPago.toLocaleString() + " MXN, la empresa puede comprometer hasta el 35% de su flujo libre en servicio de deuda, equivalente a $" + Math.round(capacidadPago * 0.35).toLocaleString() + " MXN mensuales. Para un monto de $" + monto.toLocaleString() + " MXN a " + (f.plazoDeseado || 24) + " meses, la mensualidad estimada sería de $" + (monto > 0 ? Math.round((monto * 1.18) / Number(f.plazoDeseado || 24)).toLocaleString() : "N/A") + " MXN.",
        comentario: "Las relaciones analíticas muestran un perfil " + (Number(razonEndeudamiento) < 60 ? "financieramente sano" : "que requiere estructuración cuidadosa") + " para el monto y plazo solicitados."
      },
      seccion5: {
        titulo: "Historial Crediticio",
        hallazgos: [
          f.tieneHistorial === "si_positivo" ? "Historial positivo en Buró — activo principal para la colocación" : f.tieneHistorial === "si_regular" ? "Historial con incidencias resueltas — documentar con cartas de liberación" : f.tieneHistorial === "sin_historial" ? "Sin historial crediticio formal — aplican financieras con criterio de flujo de caja" : "Historial con incidencias activas — requiere plan de regularización",
          Number(f.creditosActivos) > 0 ? f.creditosActivos + " crédito(s) activo(s) por $" + Number(f.montoCreditosActivos).toLocaleString() + " MXN — verificar que las mensualidades estén al corriente" : "Sin créditos activos — empresa sin compromisos financieros formales vigentes"
        ],
        semaforo: f.tieneHistorial === "si_positivo" ? "verde" : f.tieneHistorial === "sin_historial" || f.tieneHistorial === "si_regular" ? "amarillo" : "rojo",
        comentario: "El historial crediticio " + (f.tieneHistorial === "si_positivo" ? "es el activo más sólido del perfil para la colocación" : f.tieneHistorial === "sin_historial" ? "no es impedimento — las financieras no bancarias priorizan el flujo de caja sobre el historial formal" : "requiere manejo cuidadoso en la presentación del expediente") + "."
      },
      seccion6: {
        titulo: "Garantías y Colateral",
        hallazgos: [
          f.tieneInmueble === "si_libre" ? "Inmueble libre de gravamen con valor de $" + valorInmueble.toLocaleString() + " MXN — garantía de primer nivel que abre acceso a las mejores tasas" : f.tieneInmueble === "si_hipotecado" ? "Inmueble con hipoteca parcial — evaluar valor residual disponible como garantía complementaria" : "Sin inmueble disponible — se trabajará con garantía prendaria o aval para la colocación",
          f.tieneAval === "si_solido" ? "Aval con perfil crediticio sólido — refuerza significativamente la solicitud" : f.tieneAval === "si_regular" ? "Aval disponible — profundizar en su perfil crediticio antes de presentar" : "Sin aval identificado — considerar incluir uno para ampliar opciones"
        ],
        semaforo: f.tieneInmueble === "si_libre" ? "verde" : f.tieneInmueble === "no" && f.tieneAval === "no" ? "amarillo" : "verde",
        cobertura: valorInmueble > 0 && monto > 0 ? "La garantía inmobiliaria de $" + valorInmueble.toLocaleString() + " MXN representa el " + cobertura + "% del monto solicitado ($" + monto.toLocaleString() + " MXN). " + (Number(cobertura) >= 130 ? "Cobertura excelente — abre acceso a tasas preferenciales." : Number(cobertura) >= 100 ? "Cobertura suficiente para la mayoría de los productos disponibles." : "Cobertura parcial — complementar con aval o garantías adicionales.") : "Sin garantía inmobiliaria declarada. Se recomienda estructurar con garantía prendaria más aval personal.",
        comentario: "El esquema de garantías " + (f.tieneInmueble === "si_libre" ? "es sólido y permite acceder a los mejores productos del portafolio FSM" : "requiere estructuración creativa para maximizar las opciones de colocación disponibles") + "."
      },
      scoreFSM: {
        puntaje: scoreBase,
        nivel: scoreBase >= 75 ? "Alto" : scoreBase >= 60 ? "Medio-Alto" : scoreBase >= 45 ? "Medio" : "En Desarrollo",
        semaforo: scoreBase >= 65 ? "verde" : scoreBase >= 45 ? "amarillo" : "rojo",
        desglose: {
          facturacion: Math.min(100, Math.max(30, f.tendenciaFacturacion === "creciente" ? 85 : f.tendenciaFacturacion === "estable" ? 75 : 55)),
          flujos: Math.min(100, Math.max(30, f.autenticidadEdos?.includes("originales") || f.autenticidadEdos?.includes("cfdi") ? 80 : 60)),
          estadosFinancieros: Math.min(100, Math.max(30, Number(razonEndeudamiento) < 50 ? 80 : Number(razonEndeudamiento) < 70 ? 65 : 45)),
          historialCrediticio: Math.min(100, Math.max(20, f.tieneHistorial === "si_positivo" ? 90 : f.tieneHistorial === "sin_historial" ? 55 : f.tieneHistorial === "si_regular" ? 60 : 30)),
          garantias: Math.min(100, Math.max(25, f.tieneInmueble === "si_libre" ? 90 : f.tieneInmueble === "si_hipotecado" ? 65 : f.tieneAval === "si_solido" ? 55 : 35))
        }
      },
      argumentoAFavor: f.razonSocial + " es una empresa del sector " + f.sector + " con " + f.aniosOperacion + " años de trayectoria comprobable vía SAT y estados de cuenta bancarios, con una facturación promedio mensual de $" + facturacion.toLocaleString() + " MXN en los últimos 24 meses y un ingreso real depurado de $" + ingresoReal.toLocaleString() + " MXN. La consistencia de su flujo de caja es el argumento central para la colocación: la empresa genera suficientes recursos para cubrir el servicio de deuda solicitado con un margen de seguridad adecuado.\n\nDesde el análisis de estados financieros, la empresa presenta una razón de endeudamiento del " + razonEndeudamiento + "% y un capital contable de $" + capital.toLocaleString() + " MXN, lo que indica que existe base patrimonial real. La capacidad de pago mensual estimada de $" + capacidadPago.toLocaleString() + " MXN es verificable a través de los estados de cuenta bancarios presentados, lo que permite una evaluación objetiva de riesgo.\n\nEl monto solicitado de $" + monto.toLocaleString() + " MXN representa una proporción manejable de su facturación anual y tiene un destino productivo claramente definido (" + (f.destinoCredito || "capital de trabajo") + "), lo que incrementa la probabilidad de recuperación de la inversión. Financial Success Mexico presenta este expediente con la confianza de que cumple con los criterios de elegibilidad del portafolio y con el respaldo de 6 años de experiencia en colocación exitosa en el mercado no bancario mexicano.",
      productosRecomendados: [
        {
          producto: "Crédito Simple para Capital de Trabajo",
          institucion: "Fintech / Fondo de Deuda No Bancario",
          razon: "Perfil de facturación SAT continua y flujo bancario verificable de $" + ingresoReal.toLocaleString() + " MXN mensuales — cumple criterios de elegibilidad",
          montoSugerido: "$" + Math.round(monto * 0.8).toLocaleString() + " — $" + monto.toLocaleString() + " MXN"
        },
        {
          producto: "Línea de Crédito Revolvente",
          institucion: "Financiera especializada en PyME",
          razon: "Facturación con tendencia " + (f.tendenciaFacturacion || "estable") + " ideal para línea revolvente — flexibilidad para ciclo de negocio",
          montoSugerido: "$" + Math.round(facturacion * 1.5).toLocaleString() + " — $" + Math.round(facturacion * 2.5).toLocaleString() + " MXN"
        }
      ],
      recomendaciones: [
        {
          prioridad: "alta",
          accion: Number(f.mesesSinFacturar) > 0 ? "Documentar y justificar los " + f.mesesSinFacturar + " meses sin facturación con carta explicativa y evidencia de continuidad operativa" : "Mantener la facturación continua durante el proceso de gestión del crédito",
          impacto: "Elimina la principal objeción de riesgo que puede levantar el analista de la financiera"
        },
        {
          prioridad: "media",
          accion: f.tieneAval === "no" ? "Identificar y documentar un aval con buen perfil crediticio para ampliar el abanico de productos disponibles" : "Actualizar los estados financieros al período más reciente para presentar información vigente",
          impacto: "Amplía el número de financieras elegibles y puede mejorar las condiciones del crédito"
        },
        {
          prioridad: "baja",
          accion: "Consolidar la documentación de clientes y contratos vigentes para fortalecer el argumento de ingresos recurrentes",
          impacto: "Incrementa la confianza de la financiera en la estabilidad de los ingresos futuros"
        }
      ],
      conclusionBroker: "ESTRATEGIA DE COLOCACIÓN RECOMENDADA — CONFIDENCIAL FSM\n\nPara " + f.razonSocial + ", el ángulo más sólido de presentación es el flujo de caja real ($" + ingresoReal.toLocaleString() + " MXN/mes) y la continuidad de facturación SAT. Priorizar financieras que evalúen por flujo bancario sobre las que dependen exclusivamente de estados financieros auditados.\n\nPerfil de financieras a priorizar: " + (f.tieneInmueble === "si_libre" ? "Fondos de deuda con garantía hipotecaria — acceso a mejores tasas y montos mayores" : "Fintechs y fondos de deuda con garantía prendaria o aval — proceso más ágil") + ". Evitar financieras con requisito de 3 ejercicios fiscales positivos consecutivos si la empresa tiene pérdida fiscal.\n\nTiempo estimado de colocación: 15-25 días hábiles con expediente completo."
    };
    setReport(result);
    setStep(8);
  };

    const semaforoColor = (s) => {
    if (s === "verde") return "#4ade80";
    if (s === "amarillo") return "#facc15";
    return "#f87171";
  };

  const semaforoLabel = (s) => {
    if (s === "verde") return "Favorable";
    if (s === "amarillo") return "Atención";
    return "Riesgo";
  };

  const scoreColor = (n) => {
    if (n >= 70) return "#4ade80";
    if (n >= 50) return "#facc15";
    return "#f87171";
  };

  const inp = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(196,161,92,0.25)",
    borderRadius: "8px",
    color: "#e8dfc8",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    fontFamily: "'Montserrat', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };
  const lbl = {
    fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#c4a15c", marginBottom: "6px", display: "block",
    fontFamily: "'Montserrat', sans-serif"
  };
  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
  const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #111827 60%, #0d1a2e 100%)",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      color: "#e8dfc8",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select option { background: #111827; color: #e8dfc8; }
        input::placeholder, textarea::placeholder { color: rgba(232,223,200,0.25); }
        input:focus, select:focus, textarea:focus { border-color: rgba(196,161,92,0.7) !important; box-shadow: 0 0 0 3px rgba(196,161,92,0.08); }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: rgba(196,161,92,0.3); border-radius: 3px; }
        .btn-gold { background: linear-gradient(135deg, #c4a15c, #a8843e); color: #0a0f1e; border: none; padding: 13px 32px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,161,92,0.3); }
        .btn-gold:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
        .btn-ghost { background: transparent; color: #c4a15c; border: 1px solid rgba(196,161,92,0.35); padding: 11px 24px; font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(196,161,92,0.08); }
        .card { background: rgba(255,255,255,0.025); border: 1px solid rgba(196,161,92,0.15); border-radius: 16px; padding: 28px; margin-bottom: 16px; }
        .card-green { border-color: rgba(74,222,128,0.25); background: rgba(74,222,128,0.04); }
        .card-yellow { border-color: rgba(250,204,21,0.25); background: rgba(250,204,21,0.04); }
        .card-red { border-color: rgba(248,113,113,0.25); background: rgba(248,113,113,0.04); }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-family: 'Montserrat', sans-serif; font-weight: 600; letter-spacing: 0.05em; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .step-indicator { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(196,161,92,0.12)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,15,30,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #c4a15c, #a8843e)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#0a0f1e", fontFamily: "'Montserrat', sans-serif" }}>F</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "500", letterSpacing: "0.02em" }}>Financial Success Mexico</div>
            <div style={{ fontSize: "9px", color: "#c4a15c", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif" }}>Reporte de Diagnóstico PyME</div>
          </div>
        </div>
        {step > 0 && step < 7 && (
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(232,223,200,0.5)" }}>
            Paso {step} de 6
          </div>
        )}
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* INTRO */}
        {step === 0 && (
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "16px" }}>
              Herramienta Exclusiva FSM
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", lineHeight: 1.15, marginBottom: "20px" }}>
              Diagnóstico Financiero<br /><em style={{ color: "#c4a15c", fontStyle: "italic" }}>Institucional PyME</em>
            </h1>
            <p style={{ color: "rgba(232,223,200,0.6)", fontSize: "16px", fontFamily: "'Montserrat', sans-serif", fontWeight: "300", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 40px" }}>
              Análisis profundo de 7 dimensiones financieras para determinar la viabilidad crediticia de tu empresa desde una perspectiva institucional.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "40px", textAlign: "left" }}>
              {[
                { icon: "🧾", title: "Facturación SAT", desc: "24 meses de análisis continuo" },
                { icon: "🏦", title: "Flujos Reales", desc: "Depuración de ingresos bancarios" },
                { icon: "📊", title: "Relaciones Analíticas", desc: "Capacidad de pago real" },
                { icon: "📋", title: "Historial Crediticio", desc: "Perfil en Buró de Crédito" },
                { icon: "🔒", title: "Garantías", desc: "Cobertura y colateral disponible" },
                { icon: "🎯", title: "Argumento FSM", desc: "El punto a tu favor ante financieras" },
              ].map(i => (
                <div key={i.title} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(196,161,92,0.12)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{i.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: "500", fontFamily: "'Montserrat', sans-serif", marginBottom: "4px" }}>{i.title}</div>
                  <div style={{ fontSize: "11px", color: "rgba(232,223,200,0.5)", fontFamily: "'Montserrat', sans-serif" }}>{i.desc}</div>
                </div>
              ))}
            </div>
            <button className="btn-gold" onClick={() => setStep(1)}>Iniciar Diagnóstico →</button>
          </div>
        )}

        {/* STEP PROGRESS */}
        {step >= 1 && step <= 6 && (
          <div style={{ marginBottom: "32px" }}>
            <div className="step-indicator" style={{ marginBottom: "12px" }}>
              {STEPS.map(s => (
                <div key={s.id} className="step-dot" style={{
                  width: step === s.id ? "24px" : "8px",
                  height: "8px",
                  borderRadius: step === s.id ? "4px" : "50%",
                  background: s.id < step ? "#c4a15c" : s.id === step ? "#c4a15c" : "rgba(196,161,92,0.2)"
                }} />
              ))}
            </div>
            <div style={{ textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(196,161,92,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {STEPS[step - 1].icon} {STEPS[step - 1].title}
            </div>
          </div>
        )}

        {/* STEP 1 — Datos Generales */}
        {step === 1 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Razón Social *</label>
                  <input style={inp} placeholder="Ej. Grupo Industrial del Norte S.A. de C.V." value={form.razonSocial} onChange={e => set("razonSocial", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>RFC *</label>
                  <input style={inp} placeholder="GIN850101XYZ" value={form.rfcEmpresa} onChange={e => set("rfcEmpresa", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Estado de la República</label>
                  <input style={inp} placeholder="Ej. Nuevo León" value={form.estadoRepublica} onChange={e => set("estadoRepublica", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Sector / Giro *</label>
                  <select style={inp} value={form.sector} onChange={e => set("sector", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Régimen Fiscal *</label>
                  <select style={inp} value={form.regimen} onChange={e => set("regimen", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {REGIMENES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Años de Operación *</label>
                  <input style={inp} type="number" min="0" placeholder="Ej. 7" value={form.aniosOperacion} onChange={e => set("aniosOperacion", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Número de Empleados</label>
                  <input style={inp} type="number" placeholder="Ej. 35" value={form.empleados} onChange={e => set("empleados", e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(0)}>← Atrás</button>
              <button className="btn-gold" disabled={!form.razonSocial || !form.sector || !form.regimen || !form.aniosOperacion} onClick={() => setStep(2)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Facturación SAT */}
        {step === 2 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ marginBottom: "20px", padding: "12px 16px", background: "rgba(196,161,92,0.08)", borderRadius: "8px", borderLeft: "3px solid #c4a15c" }}>
                <p style={{ fontSize: "13px", fontFamily: "'Montserrat', sans-serif", color: "rgba(232,223,200,0.7)", lineHeight: 1.6 }}>
                  Ingresa los datos de facturación de los últimos 24 meses para analizar continuidad, tendencia y dependencia de ingresos.
                </p>
              </div>
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div>
                  <label style={lbl}>Facturación Promedio Mensual (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 850000" value={form.facturacionPromedio24} onChange={e => set("facturacionPromedio24", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Facturación Anual Total (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 10200000" value={form.ventasAnuales} onChange={e => set("ventasAnuales", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Mes con Facturación Mínima (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 300000" value={form.facturacionMin} onChange={e => set("facturacionMin", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Mes con Facturación Máxima (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 1500000" value={form.facturacionMax} onChange={e => set("facturacionMax", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Meses sin Facturar (últimos 24)</label>
                  <input style={inp} type="number" min="0" max="24" placeholder="Ej. 2" value={form.mesesSinFacturar} onChange={e => set("mesesSinFacturar", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Tendencia de Facturación</label>
                  <select style={inp} value={form.tendenciaFacturacion} onChange={e => set("tendenciaFacturacion", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="creciente">Creciente — Aumenta mes a mes</option>
                    <option value="estable">Estable — Se mantiene constante</option>
                    <option value="decreciente">Decreciente — Ha bajado</option>
                    <option value="irregular">Irregular — Muy variable</option>
                  </select>
                </div>
              </div>
              <div style={{ height: "1px", background: "rgba(196,161,92,0.12)", margin: "20px 0" }} />
              <div style={{ marginBottom: "12px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif" }}>
                Análisis de Dependencia
              </div>
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div>
                  <label style={lbl}>% Ingresos de Gobierno</label>
                  <input style={inp} type="number" min="0" max="100" placeholder="Ej. 40" value={form.dependenciaGobierno} onChange={e => set("dependenciaGobierno", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>% del Cliente Principal</label>
                  <input style={inp} type="number" min="0" max="100" placeholder="Ej. 35" value={form.clientePrincipalPct} onChange={e => set("clientePrincipalPct", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Principales Clientes (nombre / giro)</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "70px" }} placeholder="Ej. Empresa ABC (manufactura) - 35%, Empresa XYZ (comercio) - 20%..." value={form.clientesPrincipales} onChange={e => set("clientesPrincipales", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>% del Proveedor Principal</label>
                  <input style={inp} type="number" min="0" max="100" placeholder="Ej. 50" value={form.proveedorPrincipalPct} onChange={e => set("proveedorPrincipalPct", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Principales Proveedores (nombre / giro)</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "70px" }} placeholder="Ej. Proveedor ABC (materia prima) - 50%..." value={form.proveedoresPrincipales} onChange={e => set("proveedoresPrincipales", e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn-gold" disabled={!form.facturacionPromedio24 || !form.ventasAnuales} onClick={() => setStep(3)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Flujos Bancarios */}
        {step === 3 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ marginBottom: "20px", padding: "12px 16px", background: "rgba(196,161,92,0.08)", borderRadius: "8px", borderLeft: "3px solid #c4a15c" }}>
                <p style={{ fontSize: "13px", fontFamily: "'Montserrat', sans-serif", color: "rgba(232,223,200,0.7)", lineHeight: 1.6 }}>
                  Basado en la revisión de los 12 estados de cuenta bancarios. Este análisis depura el ingreso real vs. el declarado.
                </p>
              </div>
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div>
                  <label style={lbl}>Banco Principal</label>
                  <input style={inp} placeholder="Ej. BBVA, Banorte, HSBC..." value={form.bancoPrincipal} onChange={e => set("bancoPrincipal", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Número de Cuentas Bancarias</label>
                  <input style={inp} type="number" min="1" placeholder="Ej. 3" value={form.numeroCuentas} onChange={e => set("numeroCuentas", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Promedio Mensual Bancario Total (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 920000" value={form.promedioMensualBancario} onChange={e => set("promedioMensualBancario", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Ingreso Real Estimado (sin traspasos) *</label>
                  <input style={inp} type="number" placeholder="Ej. 780000" value={form.ingresoRealEstimado} onChange={e => set("ingresoRealEstimado", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Traspasos entre Cuentas Propias Identificados</label>
                  <select style={inp} value={form.traspasosIdentificados} onChange={e => set("traspasosIdentificados", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="no">No se detectaron traspasos significativos</option>
                    <option value="bajos">Traspasos bajos — menos del 10% del total</option>
                    <option value="medios">Traspasos medios — entre 10% y 30%</option>
                    <option value="altos">Traspasos altos — más del 30%</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Ciclicidad de Ingresos</label>
                  <select style={inp} value={form.ciclicidadIngresos} onChange={e => set("ciclicidadIngresos", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="constante">Constante — Ingresos todos los meses</option>
                    <option value="estacional">Estacional — Concentrado en ciertas épocas</option>
                    <option value="irregular">Irregular — Sin patrón claro</option>
                    <option value="picos">Con picos — Meses muy buenos y muy malos</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Autenticidad de Estados de Cuenta</label>
                  <select style={inp} value={form.autenticidadEdos} onChange={e => set("autenticidadEdos", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="originales">Originales del banco verificados</option>
                    <option value="cfdi">Descargados directamente del portal bancario</option>
                    <option value="escaneados">Escaneados — pendiente verificación</option>
                    <option value="dudosa">Se detectaron inconsistencias</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>← Atrás</button>
              <button className="btn-gold" disabled={!form.promedioMensualBancario || !form.ingresoRealEstimado} onClick={() => setStep(4)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Estados Financieros */}
        {step === 4 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ marginBottom: "20px", padding: "12px 16px", background: "rgba(196,161,92,0.08)", borderRadius: "8px", borderLeft: "3px solid #c4a15c" }}>
                <p style={{ fontSize: "13px", fontFamily: "'Montserrat', sans-serif", color: "rgba(232,223,200,0.7)", lineHeight: 1.6 }}>
                  Datos del Balance General y Estado de Resultados más reciente. Se utilizarán para calcular relaciones analíticas y capacidad de pago real.
                </p>
              </div>
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div>
                  <label style={lbl}>Total Activos (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 5000000" value={form.totalActivos} onChange={e => set("totalActivos", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Total Pasivos (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 2000000" value={form.totalPasivos} onChange={e => set("totalPasivos", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Activo Circulante (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 1800000" value={form.activoCirculante} onChange={e => set("activoCirculante", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Capital Contable (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 3000000" value={form.capitalContable} onChange={e => set("capitalContable", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Pasivo a Corto Plazo (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 800000" value={form.pasivoCortoplazo} onChange={e => set("pasivoCortoplazo", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Pasivo a Largo Plazo (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 1200000" value={form.pasivolargoplazo} onChange={e => set("pasivolargoplazo", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Utilidad Neta Anual (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 450000" value={form.utilidadNeta} onChange={e => set("utilidadNeta", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Pérdida Fiscal (MXN, si aplica)</label>
                  <input style={inp} type="number" placeholder="Ej. 0 si no hay" value={form.perdidaFiscal} onChange={e => set("perdidaFiscal", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Capacidad de Pago Estimada Mensual (MXN) *</label>
                  <input style={inp} type="number" placeholder="Ej. 85000" value={form.capacidadPagoEstimada} onChange={e => set("capacidadPagoEstimada", e.target.value)} />
                </div>
              </div>
              <div style={{ height: "1px", background: "rgba(196,161,92,0.12)", margin: "20px 0" }} />
              <div style={{ marginBottom: "12px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif" }}>
                Solicitud de Financiamiento
              </div>
              <div style={{ ...grid3 }}>
                <div>
                  <label style={lbl}>Monto Solicitado (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 1500000" value={form.montoSolicitado} onChange={e => set("montoSolicitado", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Destino del Crédito</label>
                  <select style={inp} value={form.destinoCredito} onChange={e => set("destinoCredito", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="capital_trabajo">Capital de trabajo</option>
                    <option value="equipo">Equipo / Maquinaria</option>
                    <option value="expansion">Expansión</option>
                    <option value="inmueble">Adquisición de inmueble</option>
                    <option value="refinanciamiento">Refinanciamiento</option>
                    <option value="tecnologia">Tecnología</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Plazo Deseado</label>
                  <select style={inp} value={form.plazoDeseado} onChange={e => set("plazoDeseado", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="12">12 meses</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                    <option value="60">60 meses</option>
                    <option value="mas">Más de 60 meses</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(3)}>← Atrás</button>
              <button className="btn-gold" disabled={!form.totalActivos || !form.totalPasivos || !form.capacidadPagoEstimada} onClick={() => setStep(5)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — Historial Crediticio */}
        {step === 5 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>¿Tiene historial en Buró de Crédito? *</label>
                  <select style={inp} value={form.tieneHistorial} onChange={e => set("tieneHistorial", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="si_positivo">Sí — Historial positivo sin manchas</option>
                    <option value="si_regular">Sí — Historial con algunas incidencias resueltas</option>
                    <option value="si_negativo">Sí — Historial con incidencias activas</option>
                    <option value="sin_historial">Sin historial (empresa nueva o sin créditos previos)</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Nivel de Buró (Score MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 680" value={form.nivelBuro} onChange={e => set("nivelBuro", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Número de Créditos Activos</label>
                  <input style={inp} type="number" min="0" placeholder="Ej. 2" value={form.creditosActivos} onChange={e => set("creditosActivos", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Monto Total Créditos Activos (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 350000" value={form.montoCreditosActivos} onChange={e => set("montoCreditosActivos", e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Días de Mora Máximos Registrados</label>
                  <select style={inp} value={form.diasMoraMax} onChange={e => set("diasMoraMax", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="0">0 días — Sin mora</option>
                    <option value="1_30">1 a 30 días</option>
                    <option value="31_60">31 a 60 días</option>
                    <option value="61_90">61 a 90 días</option>
                    <option value="mas_90">Más de 90 días</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Créditos Liquidados Anteriores</label>
                  <select style={inp} value={form.creditosLiquidados} onChange={e => set("creditosLiquidados", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="varios_exitosos">Varios — Liquidados sin problemas</option>
                    <option value="algunos">Algunos — Con incidencias resueltas</option>
                    <option value="ninguno">Ninguno</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(4)}>← Atrás</button>
              <button className="btn-gold" disabled={!form.tieneHistorial} onClick={() => setStep(6)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* STEP 6 — Garantías */}
        {step === 6 && (
          <div className="fade-up">
            <div className="card">
              <div style={{ ...grid2, marginBottom: "16px" }}>
                <div>
                  <label style={lbl}>¿Dispone de Inmueble como Garantía?</label>
                  <select style={inp} value={form.tieneInmueble} onChange={e => set("tieneInmueble", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="si_libre">Sí — Libre de gravamen</option>
                    <option value="si_hipotecado">Sí — Con hipoteca parcial</option>
                    <option value="no">No dispone de inmueble</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Valor Aproximado del Inmueble (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 3500000" value={form.valorInmueble} onChange={e => set("valorInmueble", e.target.value)} disabled={!form.tieneInmueble || form.tieneInmueble === "no"} />
                </div>
                <div>
                  <label style={lbl}>¿Dispone de Equipo / Maquinaria?</label>
                  <select style={inp} value={form.tieneEquipo} onChange={e => set("tieneEquipo", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="si">Sí — Con valor significativo</option>
                    <option value="si_menor">Sí — Valor menor</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Valor Aproximado del Equipo (MXN)</label>
                  <input style={inp} type="number" placeholder="Ej. 800000" value={form.valorEquipo} onChange={e => set("valorEquipo", e.target.value)} disabled={!form.tieneEquipo || form.tieneEquipo === "no"} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>¿Dispone de Aval?</label>
                  <select style={inp} value={form.tieneAval} onChange={e => set("tieneAval", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="si_solido">Sí — Aval con buen perfil crediticio</option>
                    <option value="si_regular">Sí — Aval con perfil regular</option>
                    <option value="no">No dispone de aval</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Otras Garantías Disponibles</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "70px" }} placeholder="Ej. Inventario valorado en $500,000, cuentas por cobrar, etc." value={form.otrasGarantias} onChange={e => set("otrasGarantias", e.target.value)} />
                </div>
              </div>
            </div>
            {error && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", color: "#f87171" }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-ghost" onClick={() => setStep(5)}>← Atrás</button>
              <button className="btn-gold" onClick={generateReport}>
                Generar Reporte FSM →
              </button>
            </div>
          </div>
        )}

        {/* ANALYZING */}
        {step === 7 && (
          <div className="fade-up" style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: "64px", height: "64px", border: "3px solid rgba(196,161,92,0.2)", borderTop: "3px solid #c4a15c", borderRadius: "50%", margin: "0 auto 32px", animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "12px" }}>Analizando el perfil empresarial</h2>
            <p style={{ color: "rgba(232,223,200,0.5)", fontFamily: "'Montserrat', sans-serif", fontSize: "14px" }}>
              La IA está procesando todas las dimensiones financieras...<br />Esto puede tardar unos segundos.
            </p>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px", margin: "32px auto 0" }}>
              {["Analizando facturación SAT...", "Depurando flujos bancarios...", "Calculando relaciones analíticas...", "Construyendo argumento a favor...", "Generando Score FSM..."].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.6, fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "rgba(232,223,200,0.7)" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c4a15c", flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT */}
        {step === 8 && report && (
          <div className="fade-up">
            {/* Report Header */}
            <div style={{ textAlign: "center", marginBottom: "32px", padding: "32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(196,161,92,0.2)", borderRadius: "20px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "8px" }}>
                Reporte de Diagnóstico Financiero Institucional
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: "400", marginBottom: "4px" }}>{form.razonSocial}</h2>
              <p style={{ color: "rgba(232,223,200,0.5)", fontFamily: "'Montserrat', sans-serif", fontSize: "12px" }}>
                {form.sector} · {form.aniosOperacion} años de operación · {form.estadoRepublica}
              </p>
              <div style={{ height: "1px", background: "rgba(196,161,92,0.15)", margin: "20px 0" }} />
              <p style={{ color: "rgba(232,223,200,0.7)", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", lineHeight: 1.8, textAlign: "left" }}>
                {report.resumenEjecutivo}
              </p>
            </div>

            {/* Score FSM */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(196,161,92,0.2)", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(196,161,92,0.1)" strokeWidth="8" />
                    <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor(report.scoreFSM?.puntaje || 0)} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (1 - (report.scoreFSM?.puntaje || 0) / 100)}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)" />
                    <text x="55" y="50" textAnchor="middle" fill={scoreColor(report.scoreFSM?.puntaje || 0)} fontSize="24" fontWeight="700" fontFamily="Montserrat">{report.scoreFSM?.puntaje || 0}</text>
                    <text x="55" y="65" textAnchor="middle" fill="rgba(232,223,200,0.4)" fontSize="9" fontFamily="Montserrat">/ 100</text>
                  </svg>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: "600", color: scoreColor(report.scoreFSM?.puntaje || 0), marginTop: "4px" }}>
                    Score FSM: {report.scoreFSM?.nivel}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "14px" }}>
                    Desglose por Dimensión
                  </div>
                  {report.scoreFSM?.desglose && Object.entries(report.scoreFSM.desglose).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(232,223,200,0.7)", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: scoreColor(v), fontWeight: "600" }}>{v}</span>
                      </div>
                      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                        <div style={{ height: "4px", width: `${v}%`, background: scoreColor(v), borderRadius: "2px", transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections */}
            {[report.seccion1, report.seccion2, report.seccion3, report.seccion4, report.seccion5, report.seccion6].filter(Boolean).map((sec, idx) => (
              <div key={idx} className={`card card-${sec.semaforo || 'green'}`} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "500", fontFamily: "'Montserrat', sans-serif" }}>{sec.titulo}</div>
                  <span className="tag" style={{ background: `rgba(${sec.semaforo === 'verde' ? '74,222,128' : sec.semaforo === 'amarillo' ? '250,204,21' : '248,113,113'},0.15)`, color: semaforoColor(sec.semaforo), border: `1px solid rgba(${sec.semaforo === 'verde' ? '74,222,128' : sec.semaforo === 'amarillo' ? '250,204,21' : '248,113,113'},0.3)` }}>
                    {semaforoLabel(sec.semaforo)}
                  </span>
                </div>
                <ul style={{ margin: "0 0 12px 0", padding: "0 0 0 16px", color: "rgba(232,223,200,0.75)", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", lineHeight: "1.9" }}>
                  {(sec.hallazgos || []).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
                {sec.comentario && (
                  <p style={{ fontSize: "13px", color: "rgba(232,223,200,0.6)", fontFamily: "'Montserrat', sans-serif", lineHeight: 1.7, fontStyle: "italic", borderTop: "1px solid rgba(196,161,92,0.1)", paddingTop: "10px", margin: 0 }}>
                    {sec.comentario}
                  </p>
                )}
              </div>
            ))}

            {/* Argumento a Favor */}
            <div style={{ background: "linear-gradient(135deg, rgba(196,161,92,0.08), rgba(196,161,92,0.03))", border: "1px solid rgba(196,161,92,0.3)", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #c4a15c, #a8843e)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎯</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", fontFamily: "'Montserrat', sans-serif" }}>Argumento a Favor — FSM</div>
                  <div style={{ fontSize: "11px", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif" }}>El punto más sólido para presentar ante la financiera</div>
                </div>
              </div>
              <p style={{ color: "rgba(232,223,200,0.85)", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", lineHeight: 1.9 }}>
                {report.argumentoAFavor}
              </p>
            </div>

            {/* Productos Recomendados */}
            {report.productosRecomendados?.length > 0 && (
              <div className="card" style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "16px" }}>
                  Productos Financieros Recomendados
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {report.productosRecomendados.map((p, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(196,161,92,0.12)", borderRadius: "10px", padding: "14px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{p.producto}</div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "#c4a15c", marginBottom: "6px" }}>{p.institucion}</div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "rgba(232,223,200,0.6)" }}>{p.razon}</div>
                        </div>
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "#4ade80", fontWeight: "600", whiteSpace: "nowrap", marginLeft: "16px" }}>{p.montoSugerido}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {report.recomendaciones?.length > 0 && (
              <div className="card" style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "16px" }}>
                  Plan de Mejora
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {report.recomendaciones.map((r, i) => {
                    const pc = r.prioridad === "alta" ? "#f87171" : r.prioridad === "media" ? "#facc15" : "#4ade80";
                    return (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span className="tag" style={{ background: `rgba(${r.prioridad === 'alta' ? '248,113,113' : r.prioridad === 'media' ? '250,204,21' : '74,222,128'},0.12)`, color: pc, border: `1px solid rgba(${r.prioridad === 'alta' ? '248,113,113' : r.prioridad === 'media' ? '250,204,21' : '74,222,128'},0.25)`, flexShrink: 0 }}>
                          {r.prioridad?.toUpperCase()}
                        </span>
                        <div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", marginBottom: "3px" }}>{r.accion}</div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(232,223,200,0.5)" }}>{r.impacto}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conclusión para el Broker */}
            {report.conclusionBroker && (
              <div style={{ background: "rgba(10,15,30,0.6)", border: "1px solid rgba(196,161,92,0.15)", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c4a15c", fontFamily: "'Montserrat', sans-serif", marginBottom: "10px" }}>
                  🔐 Nota Confidencial para el Broker
                </div>
                <p style={{ color: "rgba(232,223,200,0.7)", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", lineHeight: 1.8, margin: 0 }}>
                  {report.conclusionBroker}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-ghost" onClick={() => { setStep(0); setReport(null); setForm({ razonSocial: "", sector: "", regimen: "", aniosOperacion: "", empleados: "", estadoRepublica: "", rfcEmpresa: "", facturacionPromedio24: "", facturacionMin: "", facturacionMax: "", mesesSinFacturar: "", dependenciaGobierno: "", clientePrincipalPct: "", proveedorPrincipalPct: "", clientesPrincipales: "", proveedoresPrincipales: "", tendenciaFacturacion: "", numeroCuentas: "", promedioMensualBancario: "", ingresoRealEstimado: "", traspasosIdentificados: "", ciclicidadIngresos: "", autenticidadEdos: "", bancoPrincipal: "", totalActivos: "", totalPasivos: "", activoCirculante: "", pasivoCortoplazo: "", pasivolargoplazo: "", capitalContable: "", utilidadNeta: "", perdidaFiscal: "", ventasAnuales: "", capacidadPagoEstimada: "", tieneHistorial: "", nivelBuro: "", creditosActivos: "", montoCreditosActivos: "", diasMoraMax: "", creditosLiquidados: "", tieneInmueble: "", valorInmueble: "", tieneEquipo: "", valorEquipo: "", tieneAval: "", otrasGarantias: "", montoSolicitado: "", destinoCredito: "", plazoDeseado: "" }); }}>
                + Nuevo Diagnóstico
              </button>
              <button className="btn-gold" onClick={() => window.print()}>
                Imprimir / Guardar PDF
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(196,161,92,0.1)" }}>
              <div style={{ fontSize: "10px", color: "rgba(196,161,92,0.5)", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Financial Success Mexico — Beyond the Limits
              </div>
              <div style={{ fontSize: "10px", color: "rgba(232,223,200,0.2)", fontFamily: "'Montserrat', sans-serif", marginTop: "4px" }}>
                Reporte generado con tecnología FinBroker MX · Uso confidencial
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
